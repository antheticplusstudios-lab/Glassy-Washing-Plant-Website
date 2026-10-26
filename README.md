# Glassy Washing Plant

Marketing site + client portal for Glassy Washing Plant, built with TanStack
Start (React 19), Supabase (auth, database, storage) and Resend (transactional
email). Developed by NexGrowth Solutions.

## Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (SSR, file-based routing, server functions)
- [Nitro](https://nitro.build) — Node.js server output for Hostinger hosting
- [Supabase](https://supabase.com) — Postgres, auth, row-level security
- [Resend](https://resend.com) — transactional email for the contact form and admin replies
- Tailwind CSS v4 + shadcn/ui components
- Motion (Framer Motion successor) for page/scroll animation, with an automatic low-power mode

## Local development

Requires Node.js 22 or newer (Node.js 22 or 24 in Hostinger).

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
| `RESEND_ACCOUNT_EMAIL`, `BRIEF_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL` | Notification inbox and a Resend sender; production sender must use a verified domain |

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

## Deploying to Hostinger Node.js hosting

This project uses Nitro's `node-server` preset. The production build creates
`.output/server/index.mjs`, which is started by the `npm start` script.

1. In Hostinger hPanel, open **Websites → Add Website → Node.js app** (availability depends on your hosting plan).
2. Connect this GitHub repository or upload the project files.
3. Select Node.js **22.x or 24.x** in Hostinger. Supabase's server client needs Node.js 22+ for the native WebSocket implementation.
4. Set the install command to `npm install` and build command to `npm run build`.
5. Set the startup command to `npm start` (equivalent to `node .output/server/index.mjs`).
6. Add the environment variables from `.env.example` in the Hostinger Node.js app settings. Do not upload a real `.env` file to a public repository. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; only the variables prefixed with `VITE_` may be exposed to the browser.
7. Build/restart the application in hPanel and connect your domain.

**Important:** This is a full-stack SSR application, not a static website. It needs Node.js hosting; uploading only a `dist` folder to ordinary shared hosting will not run server routes, authentication callbacks, or email functions. If your Hostinger plan does not offer Node.js applications, use a Node.js-capable VPS or hosting plan.

## Project structure

- `src/routes/` — file-based routes (see `src/routes/README.md` for conventions)
- `src/components/` — shared UI, motion primitives, site shell
- `src/integrations/supabase/` — Supabase clients (browser, server/admin, auth middleware)
- `src/lib/` — server functions, email sending, CSV export, motion preferences
- `supabase/migrations/` — database schema and RLS policies
