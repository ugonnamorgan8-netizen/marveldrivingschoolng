-- =====================================================================
-- LAUNCH HARDENING
-- Run once in Supabase Dashboard → SQL Editor. Safe to re-run.
--
-- IMPORTANT ORDER: set SUPABASE_SERVICE_ROLE_KEY in Vercel and deploy the
-- new code FIRST. This migration removes public (anon) inserts into
-- `enrollments`; after it runs, enquiries can only arrive through the
-- /api/enquiry server function (which validates, rate-limits and emails).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENROLLMENTS: new columns, constraints, lock down direct inserts
-- ---------------------------------------------------------------------
alter table public.enrollments add column if not exists source text;
alter table public.enrollments add column if not exists preferred_time text;
alter table public.enrollments add column if not exists ip_hash text;
alter table public.enrollments add column if not exists vehicle text;
alter table public.enrollments add column if not exists branch text;

-- Quick enrollment only asks for name + phone, so email becomes optional.
alter table public.enrollments alter column email drop not null;

alter table public.enrollments drop constraint if exists enrollments_field_lengths;
alter table public.enrollments add constraint enrollments_field_lengths check (
  char_length(full_name) between 1 and 200
  and (email is null or char_length(email) <= 320)
  and char_length(phone) between 3 and 50
  and (message is null or char_length(message) <= 2000)
  and (service is null or char_length(service) <= 100)
  and (source is null or char_length(source) <= 30)
  and (preferred_time is null or char_length(preferred_time) <= 50)
  and (vehicle is null or char_length(vehicle) <= 60)
  and (branch is null or char_length(branch) <= 100)
  and (ip_hash is null or char_length(ip_hash) <= 64)
) not valid;  -- not valid = existing rows are not re-checked, new rows are

create index if not exists enrollments_created_at_idx on public.enrollments (created_at desc);
create index if not exists enrollments_ip_hash_idx on public.enrollments (ip_hash, created_at desc);

-- No more direct anonymous inserts: the server function (service role) inserts.
drop policy if exists "Anyone can submit enrollment" on public.enrollments;
revoke insert, update, delete on public.enrollments from anon;

-- Database-level rate limit (defence in depth — applies even to the service role).
create or replace function public.enforce_enrollment_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent int;
begin
  select count(*) into recent
  from public.enrollments
  where created_at > now() - interval '1 hour'
    and (
      (new.email is not null and lower(email) = lower(new.email))
      or regexp_replace(phone, '\D', '', 'g') = regexp_replace(new.phone, '\D', '', 'g')
    );
  if recent >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001',
      detail = 'Too many enquiries for this email or phone in the last hour';
  end if;

  select count(*) into recent
  from public.enrollments
  where created_at > now() - interval '10 minutes';
  if recent >= 60 then
    raise exception 'rate_limited' using errcode = 'P0001',
      detail = 'Global enquiry limit reached';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_enrollment_rate_limit() from public, anon, authenticated;

drop trigger if exists enrollments_rate_limit on public.enrollments;
create trigger enrollments_rate_limit
before insert on public.enrollments
for each row execute function public.enforce_enrollment_rate_limit();

-- ---------------------------------------------------------------------
-- 2. ANALYTICS: page events (written only by the /api/track function)
-- ---------------------------------------------------------------------
create table if not exists public.page_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in ('pageview', 'click')),
  path text not null check (char_length(path) <= 300),
  label text check (label is null or char_length(label) <= 100),
  referrer text check (referrer is null or char_length(referrer) <= 300),
  device text check (device is null or device in ('mobile', 'tablet', 'desktop')),
  country text check (country is null or char_length(country) <= 2),
  visitor_hash text check (visitor_hash is null or char_length(visitor_hash) <= 64),
  session_id text check (session_id is null or char_length(session_id) <= 64)
);

create index if not exists page_events_created_at_idx on public.page_events (created_at desc);

alter table public.page_events enable row level security;

revoke all on public.page_events from anon;
revoke insert, update on public.page_events from authenticated;

drop policy if exists "Admins can read page events" on public.page_events;
create policy "Admins can read page events"
  on public.page_events for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete page events" on public.page_events;
create policy "Admins can delete page events"
  on public.page_events for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Aggregated dashboard data, computed in the database. Admin only.
create or replace function public.admin_analytics(p_days int default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  days int := least(greatest(coalesce(p_days, 30), 1), 365);
  start_day date := (now() at time zone 'Africa/Lagos')::date - (days - 1);
  start_ts timestamptz := start_day::timestamp at time zone 'Africa/Lagos';
  result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  with ev as (
    select *, (created_at at time zone 'Africa/Lagos')::date as d
    from public.page_events
    where created_at >= start_ts
  ),
  pv as (select * from ev where event_type = 'pageview'),
  enq as (
    select *, (created_at at time zone 'Africa/Lagos')::date as d
    from public.enrollments
    where created_at >= start_ts
  ),
  days_series as (
    select generate_series(start_day, start_day + (days - 1), interval '1 day')::date as d
  )
  select jsonb_build_object(
    'days', days,
    'totals', jsonb_build_object(
      'pageviews', (select count(*) from pv),
      'visitors', (select count(distinct (d, visitor_hash)) from pv),
      'sessions', (select count(distinct session_id) from pv),
      'clicks', (select count(*) from ev where event_type = 'click'),
      'enquiries', (select count(*) from enq),
      'new_enquiries', (select count(*) from public.enrollments where status = 'new')
    ),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'date', s.d,
        'pageviews', (select count(*) from pv where pv.d = s.d),
        'visitors', (select count(distinct visitor_hash) from pv where pv.d = s.d),
        'enquiries', (select count(*) from enq where enq.d = s.d)
      ) order by s.d), '[]'::jsonb)
      from days_series s
    ),
    'top_pages', (
      select coalesce(jsonb_agg(jsonb_build_object('name', path, 'value', n) order by n desc), '[]'::jsonb)
      from (select path, count(*) n from pv group by path order by n desc limit 8) t
    ),
    'referrers', (
      select coalesce(jsonb_agg(jsonb_build_object('name', ref, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(nullif(referrer, ''), 'Direct') ref, count(*) n from pv group by 1 order by n desc limit 8) t
    ),
    'devices', (
      select coalesce(jsonb_agg(jsonb_build_object('name', dev, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(device, 'unknown') dev, count(*) n from pv group by 1) t
    ),
    'countries', (
      select coalesce(jsonb_agg(jsonb_build_object('name', c, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(country, '??') c, count(*) n from pv group by 1 order by n desc limit 8) t
    ),
    'clicks', (
      select coalesce(jsonb_agg(jsonb_build_object('name', label, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(label, 'unlabelled') label, count(*) n from ev where event_type = 'click' group by 1 order by n desc limit 10) t
    ),
    'enquiry_status', (
      select coalesce(jsonb_agg(jsonb_build_object('name', st, 'value', n) order by n desc), '[]'::jsonb)
      from (select status::text st, count(*) n from enq group by 1) t
    ),
    'enquiry_sources', (
      select coalesce(jsonb_agg(jsonb_build_object('name', src, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(source, 'contact') src, count(*) n from enq group by 1) t
    ),
    'enquiry_services', (
      select coalesce(jsonb_agg(jsonb_build_object('name', svc, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(nullif(service, ''), 'Not specified') svc, count(*) n from enq group by 1) t
    ),
    'enquiry_branches', (
      select coalesce(jsonb_agg(jsonb_build_object('name', b, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(nullif(branch, ''), 'Not specified') b, count(*) n from enq group by 1) t
    ),
    'enquiry_vehicles', (
      select coalesce(jsonb_agg(jsonb_build_object('name', v, 'value', n) order by n desc), '[]'::jsonb)
      from (select coalesce(nullif(vehicle, ''), 'Not specified') v, count(*) n from enq group by 1) t
    ),
    'pending_reviews', (select count(*) from public.testimonials where published = false)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_analytics(int) from public, anon;
grant execute on function public.admin_analytics(int) to authenticated;

-- ---------------------------------------------------------------------
-- 3. LEAST PRIVILEGE on helper functions
-- ---------------------------------------------------------------------
-- has_role is only needed by signed-in users' RLS policies.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- 4. STORAGE: images only, max 5 MB (blocks HTML/SVG uploads → no stored XSS)
-- ---------------------------------------------------------------------
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id in ('blog-images', 'gallery-images');

-- ---------------------------------------------------------------------
-- 5. TESTIMONIALS: website review submissions (stored unpublished)
-- ---------------------------------------------------------------------
alter table public.testimonials add column if not exists source text;
alter table public.testimonials add column if not exists ip_hash text;

alter table public.testimonials drop constraint if exists testimonials_field_lengths;
alter table public.testimonials add constraint testimonials_field_lengths check (
  char_length(name) between 1 and 100
  and char_length(role) <= 100
  and char_length(content) between 1 and 2000
  and (source is null or char_length(source) <= 30)
  and (ip_hash is null or char_length(ip_hash) <= 64)
) not valid;

create index if not exists testimonials_ip_hash_idx on public.testimonials (ip_hash, created_at desc);

-- Only the server function (service role) and admins write testimonials.
revoke insert, update, delete on public.testimonials from anon;

create or replace function public.enforce_review_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent int;
begin
  if coalesce(new.source, '') <> 'website' then
    return new;  -- admin-entered testimonials are not limited
  end if;
  new.published := false;  -- website reviews always start hidden

  if new.ip_hash is not null then
    select count(*) into recent from public.testimonials
    where ip_hash = new.ip_hash and created_at > now() - interval '1 day';
    if recent >= 3 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
  end if;

  select count(*) into recent from public.testimonials
  where source = 'website' and published = false and created_at > now() - interval '1 hour';
  if recent >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_review_rate_limit() from public, anon, authenticated;

drop trigger if exists testimonials_rate_limit on public.testimonials;
create trigger testimonials_rate_limit
before insert on public.testimonials
for each row execute function public.enforce_review_rate_limit();

-- Real recommendations from the school's Facebook page (public reviews).
-- Inserted once; edit or hide them any time in Admin → Testimonials.
insert into public.testimonials (name, role, content, rating, sort_order, published, source)
select v.name, v.role, v.content, 5, v.sort_order, true, 'facebook'
from (values
  ('Chikkie Ezeokoye', 'Facebook review · Aug 2024', 'I used to have intense driving phobia (I used to be very scared of driving)… After my trainings in Marvel Driving School… I literally lost my fear… and now I am very confident in driving… All thanks to the staff, team and management of Marvel Driving School. They all contributed to my growth… I’m super excited that I’m a confident driver now', 1),
  ('Ikenga Mark', 'Facebook review · Aug 2024', 'Wow I never knew there was such professionalism in Umuahia. My experience was awesome. Guys choose Marvel''s one month plan and thank me later. This is litrarily the BEST DRIVING SCHOOL IN ABIA STATE.', 2),
  ('Susan Susan', 'Facebook review · Sep 2024', 'With the motto patience and Focus your driving is safe. Is all amazing experience and it Worth both the money and time. Have no regrets in connecting with Marvel Driving School. Another sweet part of it is the CBT exams I Love it.', 3),
  ('Samuel Kindness', 'Facebook review · Aug 2025', 'A very nice driving school for beginners to learn driving fast and safe and for professionals to enhance their driving skills', 4),
  ('Barbie Sleek', 'Facebook review · Aug 2024', 'Services are top notch... very patient with a good technique', 5),
  ('Skulbaby Mikolo', 'Facebook review · Aug 2024', 'Best driving school I''ve seen', 6)
) as v(name, role, content, sort_order)
where not exists (
  select 1 from public.testimonials t where t.name = v.name and t.source = 'facebook'
);
