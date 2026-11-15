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
