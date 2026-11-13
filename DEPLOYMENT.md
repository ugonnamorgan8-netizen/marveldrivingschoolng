# Launch checklist — Marvel Driving School

Do these **in order**. Steps 1–2 must be finished before step 3, or the booking forms will stop working.

## 1. Vercel environment variables

Vercel → project **marveldrivingschoolng** → Settings → Environment Variables. Add for **Production** and **Preview**:

| Name | Value | Secret? |
|---|---|---|
| `VITE_SUPABASE_URL` | same as in your local `.env` | public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | same as in your local `.env` (anon key) | public |
| `VITE_SUPABASE_PROJECT_ID` | same as in your local `.env` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key | **SECRET** |
| `RESEND_API_KEY` | Resend → API Keys → create key (sending access) | **SECRET** |
| `NOTIFY_EMAIL_TO` | inbox that should receive enquiries (comma-separate several) | |
| `NOTIFY_EMAIL_FROM` | `Marvel Driving School <bookings@YOUR-DOMAIN>` once your domain is verified in Resend. Until then leave unset (uses `onboarding@resend.dev`, which can only email the address you signed up to Resend with) | |
| `IP_HASH_SALT` | any long random string (e.g. 40+ random characters) | **SECRET** |
| `ALLOWED_ORIGINS` | optional — only if another domain must call `/api` | |

Rules: never put a secret in a variable starting with `VITE_` (those are shipped to browsers). Never commit `.env`.

## 2. Deploy

Push to `main` (or click **Redeploy** in Vercel). Then check `https://marveldrivingschoolng.vercel.app`:
- the homepage loads, and `/admin/login` opens directly (no 404);
- submit the **Request a Lesson** form → you should get the email.

## 3. Run the database migration

Supabase Dashboard → SQL Editor → New query → paste the whole of
`supabase/migrations/20261113090000_launch_hardening.sql` → **Run**.

It: blocks direct public inserts (forms now go through the server), adds database rate limits,
creates the analytics table + admin-only analytics function, tightens function permissions, and
restricts storage uploads to images ≤ 5 MB. Safe to run more than once.

Submit the form once more afterwards to confirm it still works.

## 4. Supabase Auth settings (Dashboard → Authentication)

- **Sign In / Providers → Email**: turn **off** "Allow new users to sign up". Admins are created by you (below).
- **Password security**: minimum length **12**, require letters + digits, enable **leaked password protection** (if your plan has it).
- **URL Configuration**: Site URL = your live URL. Add redirect URL `https://YOUR-DOMAIN/admin/reset-password` (and the `vercel.app` one).

Passwords are hashed by Supabase Auth with bcrypt — the site never stores or sees password hashes.

### Creating / removing an admin
1. Authentication → Users → **Add user** (email + strong password, tick auto-confirm).
2. SQL Editor:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'person@example.com';
   ```
   Remove access: `delete from public.user_roles where user_id = (select id from auth.users where email = 'person@example.com');`

## 5. Custom domain (when ready)

1. Vercel → Domains → add `marveldrivingschool.ng` (+ `www`), follow the DNS instructions.
2. Update `og:image` / `twitter:image` URLs in `index.html` to the new domain.
3. Update the Supabase Site URL / redirect URLs (step 4).
4. Verify the domain in Resend and set `NOTIFY_EMAIL_FROM` to an address on it.

## What protects what

| Concern | Where it's handled |
|---|---|
| Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer/Permissions-Policy) | `vercel.json` |
| Admin pages not indexed / cached | `vercel.json`, `robots.txt`, `useNoIndex` |
| Admin access | Supabase Auth + `user_roles` + Row Level Security on every table |
| Form validation, sanitising, honeypot, rate limits, CORS | `api/enquiry.js`, `api/_lib/http.js` + DB trigger |
| Email notifications | `api/enquiry.js` → Resend |
| Analytics (no cookies, no raw IPs stored) | `api/track.js` → `page_events`; viewed at `/admin/analytics` |
| Upload restrictions | `src/lib/upload.ts` + storage bucket limits |

Note: Vercel always sends a `Server: Vercel` header (no version number); it cannot be removed and reveals nothing exploitable. No `X-Powered-By` header is sent.

## Local development

```sh
cp .env.example .env   # fill in values
npm install
npm run dev            # http://localhost:8080 — /api works locally too
```
Analytics are not recorded in dev unless `VITE_TRACK_IN_DEV=1`.
