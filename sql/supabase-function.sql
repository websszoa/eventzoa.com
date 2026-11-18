-- EventZoa profile functions, Auth triggers, permissions, and RLS policies
-- Run supabase-profiles.sql first.

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profile_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  primary_provider text;
  linked_providers text[];
begin
  primary_provider := coalesce(
    nullif(new.raw_app_meta_data ->> 'provider', ''),
    'email'
  );

  select coalesce(array_agg(provider_name), array[primary_provider])
    into linked_providers
  from jsonb_array_elements_text(
    case
      when jsonb_typeof(new.raw_app_meta_data -> 'providers') = 'array'
        then new.raw_app_meta_data -> 'providers'
      else jsonb_build_array(primary_provider)
    end
  ) as provider(provider_name);

  insert into public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    provider,
    providers,
    visit_count,
    last_visited_at
  )
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'preferred_username', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      '이벤트조아 회원'
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
      nullif(new.raw_user_meta_data ->> 'picture', '')
    ),
    primary_provider,
    linked_providers,
    case when new.last_sign_in_at is null then 0 else 1 end,
    new.last_sign_in_at
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    provider = excluded.provider,
    providers = (
      select array_agg(distinct provider_name order by provider_name)
      from unnest(
        public.profiles.providers || excluded.providers
      ) as provider(provider_name)
    );

  return new;
end;
$$;

drop trigger if exists auth_user_created on auth.users;
create trigger auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

drop trigger if exists auth_user_provider_changed on auth.users;
create trigger auth_user_provider_changed
after update of raw_app_meta_data on auth.users
for each row
when (new.raw_app_meta_data is distinct from old.raw_app_meta_data)
execute function public.handle_new_auth_user();

create or replace function public.handle_auth_user_sign_in()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.last_sign_in_at is distinct from old.last_sign_in_at
    and new.last_sign_in_at is not null then
    update public.profiles
    set
      email = new.email,
      visit_count = visit_count + 1,
      last_visited_at = new.last_sign_in_at
    where id = new.id
      and status = 'active';
  end if;

  return new;
end;
$$;

drop trigger if exists auth_user_signed_in on auth.users;
create trigger auth_user_signed_in
after update of last_sign_in_at on auth.users
for each row
when (new.last_sign_in_at is distinct from old.last_sign_in_at)
execute function public.handle_auth_user_sign_in();

-- Remove functions and policies from earlier versions of this migration.
drop policy if exists "profiles_select_admin" on public.profiles;
drop function if exists public.is_admin();
drop function if exists public.withdraw_account();

create or replace function public.withdraw_account(target_user_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if target_user_id is null then
    raise exception 'Target user ID is required.'
      using errcode = '22004';
  end if;

  update public.profiles
  set
    status = 'withdrawn',
    withdrawn_at = now(),
    email = null,
    display_name = '탈퇴한 회원',
    avatar_url = null
  where id = target_user_id
    and status <> 'withdrawn';

  if not found then
    raise exception 'Active profile not found.'
      using errcode = 'P0002';
  end if;
end;
$$;

comment on function public.withdraw_account(uuid) is
  'Soft-withdraws a member. This service_role-only function must be called by a trusted server after verifying the current user.';

revoke all on function public.set_profile_updated_at()
  from public, anon, authenticated;
revoke all on function public.handle_new_auth_user()
  from public, anon, authenticated;
revoke all on function public.handle_auth_user_sign_in()
  from public, anon, authenticated;
revoke all on function public.withdraw_account(uuid)
  from public, anon, authenticated;

grant execute on function public.withdraw_account(uuid) to service_role;

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;
grant update on table public.profiles to service_role;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
  and status = 'active'
)
with check (
  (select auth.uid()) = id
  and status = 'active'
);

-- Backfill profiles for Auth users that existed before this trigger.
insert into public.profiles (
  id,
  email,
  display_name,
  avatar_url,
  provider,
  providers,
  visit_count,
  last_visited_at,
  created_at
)
select
  auth_user.id,
  auth_user.email,
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'preferred_username', ''),
    nullif(split_part(coalesce(auth_user.email, ''), '@', 1), ''),
    '이벤트조아 회원'
  ),
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(auth_user.raw_user_meta_data ->> 'picture', '')
  ),
  coalesce(
    nullif(auth_user.raw_app_meta_data ->> 'provider', ''),
    'email'
  ),
  case
    when jsonb_typeof(auth_user.raw_app_meta_data -> 'providers') = 'array'
      then array(
        select jsonb_array_elements_text(
          auth_user.raw_app_meta_data -> 'providers'
        )
      )
    else array[
      coalesce(
        nullif(auth_user.raw_app_meta_data ->> 'provider', ''),
        'email'
      )
    ]
  end,
  case when auth_user.last_sign_in_at is null then 0 else 1 end,
  auth_user.last_sign_in_at,
  auth_user.created_at
from auth.users as auth_user
on conflict (id) do nothing;
