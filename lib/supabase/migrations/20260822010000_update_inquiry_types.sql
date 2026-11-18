update public.inquiries
set type = case type
  when 'event' then 'registration'
  when 'support' then 'general'
  when 'partnership' then 'general'
  else type
end
where type in ('event', 'support', 'partnership');

alter table public.inquiries
  drop constraint if exists inquiries_type_check;

alter table public.inquiries
  add constraint inquiries_type_check
  check (type in ('general', 'registration', 'correction', 'report', 'advertising'));

comment on column public.inquiries.type is
  'general, registration, correction, report, advertising';
