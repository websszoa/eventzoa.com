alter table public.inquiries
  drop column if exists organization,
  drop column if exists phone;
