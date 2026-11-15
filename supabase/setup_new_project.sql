-- =====================================================================
-- MARVEL DRIVING SCHOOL — COMPLETE DATABASE SETUP FOR A NEW SUPABASE PROJECT
-- Paste this whole file into: Supabase → SQL Editor → New query → Run.
-- It creates every table, security rule, storage bucket and seed row.
-- =====================================================================

-- >>>>> from 20260423013641_70b28edb-93c7-40bb-be8b-334ce8074f6c.sql

-- ===============================
-- ROLES
-- ===============================
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Allow signed-in users to read their own roles (so the UI can decide)
create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

-- Only admins can manage roles
create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===============================
-- ENROLLMENTS / CONTACT SUBMISSIONS
-- ===============================
create type public.enrollment_status as enum ('new', 'contacted', 'enrolled', 'archived');

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service text,
  message text,
  status public.enrollment_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger enrollments_set_updated_at
before update on public.enrollments
for each row execute function public.set_updated_at();

alter table public.enrollments enable row level security;

-- Anyone (even anon) can submit
create policy "Anyone can submit enrollment"
  on public.enrollments for insert
  to anon, authenticated
  with check (true);

-- Only admins can read / update / delete
create policy "Admins can read enrollments"
  on public.enrollments for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update enrollments"
  on public.enrollments for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete enrollments"
  on public.enrollments for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ===============================
-- BLOG POSTS
-- ===============================
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null, -- markdown / paragraphs separated by blank lines
  category text not null default 'General',
  read_time text not null default '5 min read',
  image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

-- Public can read published posts
create policy "Anyone can read published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

-- Admins can read all posts (including drafts)
create policy "Admins can read all posts"
  on public.blog_posts for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update posts"
  on public.blog_posts for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ===============================
-- GALLERY IMAGES
-- ===============================
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  alt_text text not null default '',
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gallery_images_set_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

create policy "Anyone can read gallery"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

create policy "Admins can insert gallery"
  on public.gallery_images for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update gallery"
  on public.gallery_images for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete gallery"
  on public.gallery_images for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ===============================
-- SITE SETTINGS (key/value)
-- ===============================
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "Anyone can read settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins can insert settings"
  on public.site_settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update settings"
  on public.site_settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete settings"
  on public.site_settings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ===============================
-- STORAGE BUCKETS
-- ===============================
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

-- Public read for both buckets
create policy "Public read blog images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

create policy "Public read gallery images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery-images');

-- Admins can upload/update/delete
create policy "Admins upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins upload gallery images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update gallery images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete gallery images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images' and public.has_role(auth.uid(), 'admin'));

-- >>>>> from 20260423013658_697805ff-04b7-4a0b-8aab-fa6264a38b35.sql

-- 1. Fix search_path for set_updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Tighten enrollment insert policy
drop policy if exists "Anyone can submit enrollment" on public.enrollments;

create policy "Anyone can submit enrollment"
  on public.enrollments for insert
  to anon, authenticated
  with check (
    length(trim(full_name)) between 1 and 200
    and length(trim(email)) between 3 and 320
    and length(trim(phone)) between 3 and 50
    and (message is null or length(message) <= 2000)
  );

-- 3. Restrict storage listing — public can only read specific files, not list buckets
drop policy if exists "Public read blog images" on storage.objects;
drop policy if exists "Public read gallery images" on storage.objects;

-- Re-create as targeted SELECT policies that only allow direct file reads
-- (Public buckets serve files via signed URL paths regardless; this just removes broad listing)
create policy "Public read individual blog image"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'blog-images'
    and (storage.foldername(name))[1] is not null
  );

create policy "Public read individual gallery image"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'gallery-images'
    and (storage.foldername(name))[1] is not null
  );

-- >>>>> from 20260423025204_6b71b616-2396-45f8-aaa4-d4ffa64c1d1e.sql
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins can read all testimonials"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- >>>>> from 20261113090000_launch_hardening.sql
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


-- ---------------------------------------------------------------------
-- 6. SEED: gallery photos (files are served from the website: /public/gallery)
-- ---------------------------------------------------------------------
insert into public.gallery_images (title, alt_text, image_url, sort_order)
select v.title, v.alt_text, v.image_url, v.sort_order
from (values
  ('Theory Classes', 'Friday classroom sessions with packed attendance', '/gallery/fef63e55-1a07-4e4e-a2ef-fc19592e1498.jpg', 1),
  ('Staff', 'Digital Documentation of Student Data', '/gallery/4024a165-b6ee-4230-bf10-5549a77e8a27.jpg', 2),
  ('Staff', 'During classroom sessions', '/gallery/f0b62830-b2ea-4ee6-9e56-1c6ff31d3c42.jpg', 3),
  ('Our Training Vehicles', 'Well-branded fleet of training cars in Umuahia', '/gallery/c5af1400-dfd5-4174-8f66-8900bdd71400.jpg', 4),
  ('Motorbike Training', 'Safe rider training with full protective gear', '/gallery/e41c47bc-ae01-425e-b289-bfa6cb9e53e8.jpg', 5),
  ('Staff', 'Ready for an interactive classroom session', '/gallery/2eb21733-64b5-40e0-ad16-566e8c27939e.jpg', 6),
  ('Training Vehicles', 'Manual & Automatic Cars', '/gallery/00dc3c85-e3b4-4678-8bb5-edbb4ed02e60.jpg', 7),
  ('FRSC Office Visit', 'Our team with FRSC officials in Abia State', '/gallery/fb0bad33-8fcb-43f3-a0bd-baa6da7f9558.jpg', 7),
  ('Training Vehicle', 'Branded and well maintained Automatic Vehicle', '/gallery/2b9b2b96-f506-4dc2-85e9-39a153b4cfb1.jpg', 8),
  ('Motorbike Training', 'Students ready for motorbike training sessions', '/gallery/7b0465fd-91eb-4d0d-a30e-facf2fb9e1fb.jpg', 8),
  ('Students', 'Classroom sessions ', '/gallery/e1d5510f-4022-440a-9954-7f91f9ea90e7.jpg', 9),
  ('Graduates', 'Happy graduates of Marvel Driving School ', '/gallery/833aad67-0ec1-4e1f-9c87-28291c5f8403.jpg', 11),
  ('Staff', 'Marvel Staff posing happily', '/gallery/a6a5dd2a-6978-4b55-ae4c-24c04bad84d1.jpg', 12),
  ('CEO Marvel', 'Always available at Key FRSC events', '/gallery/5d593adc-20be-4bf2-ae58-3059ad2789c2.jpg', 12),
  ('Staff', 'Sensitization programs for the public on driver safety', '/gallery/7eaf3132-1df4-4e81-ae86-e2af3d5959b7.jpg', 14),
  ('FRSC EVENTS', 'Taking part in FRSC Trainings', '/gallery/fcda491f-4f41-49a1-be55-09845f3c81df.jpg', 15),
  ('FRSC CBT Testing', 'Marvel students during weekly CBT Tests', '/gallery/bcd7245a-1b7d-4a60-a5eb-018a337432b3.jpg', 15),
  ('FRSC OFFICIALS', 'FRSC officials present during organized training for approved driving schools', '/gallery/fb5cfb5b-548f-43be-ab9b-17564c2818cc.jpg', 17),
  ('FRSC CBT Testing', 'Weekly computer-based tests with FRSC officials', '/gallery/abfd08fc-e4c9-4e54-aa1c-73ea6b2b6984.jpg', 18),
  ('Marvel Staff', 'Staff wedding Visit', '/gallery/bed0c531-4943-4ff4-9545-f9cdea1121ef.jpg', 18),
  ('Staff', 'Experienced Instructors ready to help you become a confident driver', '/gallery/287cdfe8-36b1-42eb-8491-6b671b2c0194.jpg', 20),
  ('FRSC CBT Testing', 'Marvel students during weekly CBT Tests', '/gallery/54848bb4-1585-43c7-8830-e9ecc4bbcb9e.jpg', 21)
) as v(title, alt_text, image_url, sort_order)
where not exists (select 1 from public.gallery_images g where g.image_url = v.image_url);

-- >>>>> from 20261115090000_grants.sql
-- =====================================================================
-- TABLE PERMISSIONS (needed on newer Supabase projects, which no longer
-- grant table access automatically). Row Level Security still decides
-- WHICH rows each role sees; these grants only allow the role to ask.
-- Safe to run more than once.
-- =====================================================================

grant usage on schema public to anon, authenticated, service_role;

-- Public website (anon = visitors): read-only on public content.
-- RLS limits this to published posts/testimonials.
grant select on public.gallery_images, public.blog_posts, public.testimonials, public.site_settings
  to anon, authenticated;

-- Signed-in users: RLS only lets ADMINS act on these rows.
grant insert, update, delete on public.gallery_images, public.blog_posts, public.testimonials, public.site_settings
  to authenticated;
grant select, update, delete on public.enrollments to authenticated;
grant select, delete on public.page_events to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;

-- Server functions (service role): full access, used only by /api on Vercel.
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Visitors can never touch these directly:
revoke all on public.enrollments, public.page_events, public.user_roles from anon;
revoke insert, update, delete on public.gallery_images, public.blog_posts, public.testimonials, public.site_settings from anon;

-- Functions
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;
grant execute on function public.admin_analytics(int) to authenticated;
