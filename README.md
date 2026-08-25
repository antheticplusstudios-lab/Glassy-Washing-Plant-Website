# Glassy Washing Plant

Marketing site + client portal for Glassy Washing Plant, built with TanStack
Start (React 19), Supabase (auth, database, storage) and Resend (transactional
email). Developed by NexGrowth Solutions.

## Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (SSR, file-based routing, server functions)
- [Nitro](https://nitro.build) — universal server build, deploys to Vercel with zero extra config
- [Supabase](https://supabase.com) — Postgres, auth, row-level security
- [Resend](https://resend.com) — transactional email for the contact form and admin replies
- Tailwind CSS v4 + shadcn/ui components
- Motion (Framer Motion successor) for page/scroll animation, with an automatic low-power mode

## Local development

Requires Node.js 20+.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
cp .env.example .env   # then fill in real values, see below
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL`, `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API (anon/publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (service_role key — **server-only, never prefix with `VITE_`**) |
| `RESEND_API_KEY` | Resend → API Keys |

`VITE_`-prefixed variables are bundled into the browser. Everything else stays
server-side only — never put a secret behind the `VITE_` prefix.

The service-role key is required for admin operations (sending replies to
submissions, the contact form's own insert, CSV export, user management) —
without it those features will fail.

## Database

Schema and RLS policies live in `supabase/migrations/`. Apply them with the
[Supabase CLI](https://supabase.com/docs/guides/cli):

```sh
supabase link --project-ref <your-project-ref>
supabase db push
```

The first migration seeds the admin role: whichever address matches the
hardcoded email in `handle_new_user()` gets the `admin` role on sign-up. Change
that email in the migration (or update the `user_roles` table directly) before
applying it to a fresh project.

## Deploying to Vercel

This project builds with the [Nitro Vite plugin](https://vercel.com/docs/frameworks/full-stack/tanstack-start),
which Vercel detects automatically — no custom build command or output
directory needed. `vercel.json` pins the framework preset explicitly as a
safety net.

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from the table above under **Project Settings
   → Environment Variables** (Production, Preview, and Development).
4. Deploy.

## Project structure

- `src/routes/` — file-based routes (see `src/routes/README.md` for conventions)
- `src/components/` — shared UI, motion primitives, site shell
- `src/integrations/supabase/` — Supabase clients (browser, server/admin, auth middleware)
- `src/lib/` — server functions, email sending, CSV export, motion preferences
- `supabase/migrations/` — database schema and RLS policies
