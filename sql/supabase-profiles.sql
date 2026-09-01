-- EventZoa member profiles
-- Run this file before supabase-function.sql in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  provider text not null default 'email',
  providers text[] not null default '{}'::text[],
  role text not null default 'user',
  status text not null default 'active',
  visit_count bigint not null default 0,
  last_visited_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('user', 'admin')),
  constraint profiles_status_check check (
    status in ('active', 'suspended', 'withdrawn')
  ),
  constraint profiles_visit_count_check check (visit_count >= 0)
);

comment on table public.profiles is
  'Application profile data linked one-to-one with auth.users.';
comment on column public.profiles.provider is
  'Primary sign-in provider reported by Supabase Auth.';
comment on column public.profiles.providers is
  'All sign-in providers linked to the member account.';
comment on column public.profiles.role is
  'Application authorization role. Only trusted server/admin code may change it.';
comment on column public.profiles.status is
  'Account lifecycle status: active, suspended, or withdrawn.';
comment on column public.profiles.visit_count is
  'Number of successful sign-ins observed through auth.users.last_sign_in_at.';

create index if not exists profiles_role_idx
  on public.profiles (role);

create index if not exists profiles_status_idx
  on public.profiles (status);

create index if not exists profiles_provider_idx
  on public.profiles (provider);

alter table public.profiles enable row level security;
