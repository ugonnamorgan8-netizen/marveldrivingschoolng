
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
