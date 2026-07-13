# Padua Wedding Planning

A private digital planning concierge for couples considering or celebrating at Padua Weddings, a historic Southern California Spanish Revival estate.

The application combines a public editorial landing experience, adaptive onboarding, a complete demo couple workspace, private-tour preparation, and role-aware staff/administrator operations. It runs without credentials in local demo mode; Supabase credentials activate secure authentication and route protection.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- shadcn-style Radix primitives and reusable UI components
- Supabase Auth, PostgreSQL, Row Level Security, and private Storage
- React Hook Form and Zod
- Recharts, date-fns, dnd-kit, Lucide
- Vitest and Testing Library

## Application routes

| Route         | Purpose                                           |
| ------------- | ------------------------------------------------- |
| `/`           | Public landing page                               |
| `/onboarding` | Personalized three-step planning profile          |
| `/login`      | Password, account creation, magic link, and reset |
| `/tour`       | Tour preparation and request flow                 |
| `/planning/*` | Couple overview and planning tools                |
| `/staff`      | Assigned-couple operations                        |
| `/admin`      | Platform administration                           |

## Project structure

```text
src/
  app/
    api/support/          validated, rate-limit-ready support endpoint
    auth/callback/        Supabase PKCE callback
    planning/[section]/   couple workspace routes
    staff/                staff authorization and dashboard
    admin/                administrator authorization and dashboard
  components/
    planning/             interactive planning feature modules
    planner-shell.tsx     responsive authenticated navigation
    ui.tsx                accessible design-system primitives
  lib/
    supabase/             browser and server clients
    analytics.ts          vendor-neutral event boundary
    auth.ts               server-side role enforcement
    demo-data.ts          complete Olivia & Marcus preview
    rate-limit.ts         distributed-limiter integration boundary
supabase/
  migrations/             schema, indexes, triggers, RLS, storage policies
  seed.sql                local demo identities and planning data
docs/
  TESTING.md
  ROADMAP.md
```

## Local setup

Requirements: Node.js 20.9+ and npm. Supabase CLI and Docker are optional for the database-backed mode.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. With placeholder or missing Supabase values, the application uses its safe local demo experience. Do not enter sensitive information into demo mode.

### Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Supabase setup

1. Create a Supabase project, or start the local stack:

   ```bash
   npx supabase start
   npx supabase db reset
   ```

   `db reset` applies `supabase/migrations/202607130001_initial_schema.sql` and `supabase/seed.sql`.

2. Add the project URL and anon key to `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<local anon key>
   ```

3. In Supabase Auth, set the Site URL to `http://localhost:3000` and add:

   ```text
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/update-password
   ```

4. For a hosted project, apply migrations with the Supabase CLI after linking:

   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

5. Create production users through Auth. Never run `supabase/seed.sql` in production.

### Local seed accounts

All seeded accounts use the password `padua-demo`.

- Couple: `olivia@example.com`
- Partner: `marcus@example.com`
- Staff: `claire@paduaweddings.com`
- Administrator: `admin@paduaweddings.com`

The authorization boundary is `wedding_members`. Couple users see only their wedding. Staff see only assigned weddings. Administrators can access the full platform. Internal notes and staff-only messages have additional policy checks.

### Private file storage

The migration creates a private `wedding-documents` bucket. Object paths must use:

```text
<wedding-uuid>/<document-uuid>/<sanitized-filename>
```

RLS validates the wedding UUID at the first path segment. Production downloads should use short-lived signed URLs created after a server-side membership check.

## Vercel deployment

1. Import the repository into Vercel using the Next.js preset.
2. Set `NEXT_PUBLIC_APP_URL` to the canonical production origin.
3. Set the Supabase URL and anon key for Production, Preview, and Development as appropriate.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. The current application does not require it for browser operations.
5. Add production and preview callback origins to the Supabase Auth redirect allowlist.
6. Deploy, then verify `/robots.txt`, `/sitemap.xml`, `/social-preview.svg`, auth callbacks, and protected-route redirects.
7. Before accepting real couple data, connect private document actions, a distributed rate limiter, transactional email, error monitoring, and the data repository mutations listed in the roadmap.

Next.js supplies the Vercel build command (`npm run build`) and output automatically.

## Security model

- Cookie-based Supabase SSR sessions refreshed in `src/proxy.ts`
- Server role checks for staff and administrator route groups
- Wedding-scoped RLS across all couple-owned tables
- Staff-only visibility for internal notes and messages
- Private storage bucket with path-level wedding authorization
- Zod input validation on onboarding and support requests
- Output escaped by React; no user-authored HTML rendering
- No service-role or analytics credentials in client code
- Rate-limit adapter boundary ready for a distributed provider

## Demo and production data

The polished preview is intentionally populated from `src/lib/demo-data.ts`, so design review is available without infrastructure. The SQL seed mirrors Olivia and Marcus in PostgreSQL. Authentication and server authorization are live when Supabase is configured; feature mutations are represented in local interactive state until the typed Supabase repository layer is connected.

See [the testing checklist](docs/TESTING.md) before release and [the product roadmap](docs/ROADMAP.md) for the next data-connected and operational milestones.
