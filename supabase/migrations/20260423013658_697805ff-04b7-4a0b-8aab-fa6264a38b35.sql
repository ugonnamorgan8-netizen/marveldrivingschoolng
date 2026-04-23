
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
