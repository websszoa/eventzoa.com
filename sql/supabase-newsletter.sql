-- EventZoa newsletter subscribers
-- Run this entire file in the Supabase SQL Editor.
--
-- runzoa.com sql/supabase-newsletter.sql 을 참고해 EventZoa 방식에 맞췄다.
-- - 문의(supabase-contact.sql)와 같이 RLS는 켜고 정책은 두지 않는다.
--   → anon/authenticated는 직접 접근할 수 없다.
-- - 서버 액션이 service role 키로 subscribe_newsletter RPC를 호출한다.
-- - 관리자 화면도 createAdminClient()(service role)로 조회한다.

begin;

-- 1. 테이블 ------------------------------------------------------------

create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(btrim(email)) between 5 and 320),
  age text check (
    age in ('10대', '20대', '30대', '40대', '50대', '60대 이상')
  ),
  acquisition_source text check (
    acquisition_source in (
      '검색',
      '인스타그램·SNS',
      '지인 추천',
      '커뮤니티·카페',
      '축제 현장',
      '기타'
    )
  ),
  content_preference text check (
    content_preference is null
    or char_length(btrim(content_preference)) between 1 and 500
  ),
  subscription_source text not null default '뉴스레터 페이지' check (
    subscription_source in (
      '메인 구독 배너',
      '뉴스레터 페이지',
      '축제 상세페이지',
      '관리자 등록'
    )
  ),
  agree_privacy boolean not null default false check (agree_privacy = true),
  agree_ads boolean not null default false,
  status text not null default 'subscribed' check (
    status in ('subscribed', 'unsubscribed')
  ),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletters_status_unsubscribed_at_check check (
    (status = 'subscribed' and unsubscribed_at is null)
    or (status = 'unsubscribed' and unsubscribed_at is not null)
  )
);

comment on table public.newsletters is '뉴스레터 구독자';
comment on column public.newsletters.status is 'subscribed(구독중), unsubscribed(구독취소)';
comment on column public.newsletters.subscription_source is '구독 신청 위치';

-- 2. 인덱스 ------------------------------------------------------------

-- 공백·대소문자만 다른 같은 이메일도 중복 구독되지 않는다.
create unique index if not exists newsletters_normalized_email_key
  on public.newsletters (lower(btrim(email)));

create index if not exists newsletters_status_created_at_idx
  on public.newsletters (status, created_at desc);

-- 3. updated_at 자동 갱신 ----------------------------------------------

create or replace function public.set_newsletters_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists newsletters_set_updated_at on public.newsletters;
create trigger newsletters_set_updated_at
before update on public.newsletters
for each row
execute function public.set_newsletters_updated_at();

-- 4. 권한 --------------------------------------------------------------

alter table public.newsletters enable row level security;

revoke all on table public.newsletters from anon, authenticated;
revoke all on function public.set_newsletters_updated_at()
  from public, anon, authenticated;
grant select, insert, update, delete on table public.newsletters to service_role;

-- 5. 구독 RPC: 신규 구독과 재구독(구독취소 → 구독중)을 한 번에 처리 --------
--    반환값: 구독자 id
--    오류 코드: privacy_consent_required, invalid_email, invalid_age,
--              invalid_acquisition_source, invalid_content_preference,
--              invalid_subscription_source, already_subscribed

create or replace function public.subscribe_newsletter(
  subscriber_email text,
  subscriber_age text default null,
  subscriber_acquisition_source text default null,
  subscriber_content_preference text default null,
  subscriber_subscription_source text default '뉴스레터 페이지',
  privacy_agreed boolean default false,
  ads_agreed boolean default false
)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  subscriber_id uuid;
  existing_status text;
  normalized_email text := lower(btrim(subscriber_email));
  normalized_preference text := nullif(btrim(subscriber_content_preference), '');
begin
  if privacy_agreed is not true then
    raise exception 'privacy_consent_required';
  end if;

  if normalized_email is null
    or normalized_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  then
    raise exception 'invalid_email';
  end if;

  if subscriber_age is null
    or subscriber_age not in ('10대', '20대', '30대', '40대', '50대', '60대 이상')
  then
    raise exception 'invalid_age';
  end if;

  if subscriber_acquisition_source is null
    or subscriber_acquisition_source not in (
      '검색',
      '인스타그램·SNS',
      '지인 추천',
      '커뮤니티·카페',
      '축제 현장',
      '기타'
    )
  then
    raise exception 'invalid_acquisition_source';
  end if;

  if normalized_preference is not null
    and char_length(normalized_preference) > 500
  then
    raise exception 'invalid_content_preference';
  end if;

  if subscriber_subscription_source is null
    or subscriber_subscription_source not in (
      '메인 구독 배너',
      '뉴스레터 페이지',
      '축제 상세페이지',
      '관리자 등록'
    )
  then
    raise exception 'invalid_subscription_source';
  end if;

  select id, status
  into subscriber_id, existing_status
  from public.newsletters
  where lower(btrim(email)) = normalized_email
  for update;

  if subscriber_id is not null and existing_status = 'subscribed' then
    raise exception 'already_subscribed';
  end if;

  -- 구독을 취소했던 이메일은 같은 행을 다시 구독 상태로 되돌린다.
  if subscriber_id is not null then
    update public.newsletters
    set
      age = subscriber_age,
      acquisition_source = subscriber_acquisition_source,
      content_preference = normalized_preference,
      subscription_source = subscriber_subscription_source,
      agree_privacy = true,
      agree_ads = coalesce(ads_agreed, false),
      status = 'subscribed',
      unsubscribed_at = null
    where id = subscriber_id;

    return subscriber_id;
  end if;

  insert into public.newsletters (
    email,
    age,
    acquisition_source,
    content_preference,
    subscription_source,
    agree_privacy,
    agree_ads
  )
  values (
    normalized_email,
    subscriber_age,
    subscriber_acquisition_source,
    normalized_preference,
    subscriber_subscription_source,
    true,
    coalesce(ads_agreed, false)
  )
  returning id into subscriber_id;

  return subscriber_id;
exception
  -- 동시에 같은 이메일로 신청한 경우
  when unique_violation then
    raise exception 'already_subscribed';
end;
$$;

-- 서버(service role)만 호출할 수 있다.
revoke all on function public.subscribe_newsletter(text, text, text, text, text, boolean, boolean) from public, anon, authenticated;
grant execute on function public.subscribe_newsletter(text, text, text, text, text, boolean, boolean) to service_role;

commit;

notify pgrst, 'reload schema';
