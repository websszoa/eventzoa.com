-- EventZoa email notification delivery state
-- Run this entire file in the Supabase SQL Editor once.

alter table public.profiles
  add column if not exists signup_notified_at timestamptz;

comment on column public.profiles.signup_notified_at is
  'Time when the new member notification email was claimed for delivery.';
