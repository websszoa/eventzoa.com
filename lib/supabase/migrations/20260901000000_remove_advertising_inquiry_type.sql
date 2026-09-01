-- Advertising inquiries are no longer accepted by the contact page.
-- Preserve existing records by moving them to the general inquiry category
-- before tightening the allowed values.

update public.inquiries
set type = 'general'
where type = 'advertising';

alter table public.inquiries
  drop constraint if exists inquiries_type_check;

alter table public.inquiries
  add constraint inquiries_type_check
  check (type in ('general', 'registration', 'correction', 'report'))
  not valid;

alter table public.inquiries
  validate constraint inquiries_type_check;

comment on column public.inquiries.type is
  'general, registration, correction, report';
