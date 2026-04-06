# saas-nextjs-supabase

![CI](https://github.com/Shaisolaris/saas-nextjs-supabase/actions/workflows/ci.yml/badge.svg)

Next.js 14 SaaS starter with Supabase for authentication, database, Row Level Security, and storage. Stripe integration for subscriptions with checkout, webhooks, and customer portal. Team-based multi-tenancy with role-based access, project management, and member invitations.

## Stack

- **Framework:** Next.js 14 App Router, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Storage)
- **Billing:** Stripe (subscriptions, checkout, webhooks, portal)
- **State:** Zustand

## Features

### Authentication (Supabase Auth)
- Email/password registration and login
- Session management via Supabase SSR helpers
- Auto-create profile on signup via database trigger
- Protected dashboard routes

### Team Management
- Team creation with unique slugs
- Role-based access: owner, admin, member
- Member invitations with token-based acceptance
- Team-scoped data via RLS policies

### Billing (Stripe)
- 3-tier pricing: Free, Pro ($29/mo), Enterprise ($99/mo)
- 14-day trial on paid plans
- Stripe Checkout for new subscriptions
- Customer Portal for self-service management
- Webhook handling: checkout.completed, subscription.updated, subscription.deleted, invoice.payment_failed
- Plan-based resource limits (projects, members, storage)

### Database (Supabase + RLS)
- 4 tables: teams, profiles, projects, invitations
- Row Level Security on all tables
- Team members can only view/edit their team's data
- Owner-only team updates
- Admin-only invitation management
- Storage bucket with team-scoped access

### Projects
- CRUD within team scope
- Active/archived status
- Created-by tracking
- RLS-enforced team isolation

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhook events |

## Architecture

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout
│   ├── auth/
│   │   ├── login/page.tsx                # Email/password login
│   │   └── register/page.tsx             # Registration with name
│   ├── dashboard/
│   │   └── page.tsx                      # Dashboard with stats
│   └── api/stripe/
│       ├── checkout/route.ts             # Create checkout session
│       └── webhook/route.ts              # Handle 4 webhook events
├── lib/
│   ├── supabase.ts                       # Browser + service clients, auth/data helpers
│   └── stripe.ts                         # Stripe client, plans config, checkout/portal helpers
├── types/index.ts                        # Profile, Team, Project, Invitation, Database types
└── supabase/schema.sql                   # Full schema with RLS policies and triggers
```

## Database Schema

```sql
teams        → id, name, slug, plan, stripe_*, subscription_status, trial_ends_at
profiles     → id (FK auth.users), email, full_name, avatar_url, team_id, role
projects     → id, team_id, name, description, status, created_by
invitations  → id, team_id, email, role, token, expires_at, accepted_at
```

All tables have RLS enabled with policies scoped to team membership.

## Setup

```bash
git clone https://github.com/Shaisolaris/saas-nextjs-supabase.git
cd saas-nextjs-supabase
npm install
cp .env.example .env.local
# Add Supabase and Stripe keys to .env.local
# Run supabase/schema.sql in Supabase SQL editor
npm run dev
```

## Key Design Decisions

**Supabase RLS for data isolation.** Every table has Row Level Security policies that check team membership via the profiles table. This means even if application code has a bug, the database itself prevents cross-team data access. The service role client bypasses RLS for webhook handlers.

**Database trigger for profile creation.** A PostgreSQL trigger automatically creates a profile row when a user signs up via Supabase Auth. This avoids a race condition between auth creation and profile creation.

**Stripe webhook for subscription state.** Subscription status is updated exclusively via Stripe webhooks, not checkout success redirects. Webhooks are the source of truth for billing state because they handle edge cases (failed payments, manual cancellations, disputes).

**Plan limits in application code.** Resource limits (projects, members, storage) are defined in the `PLANS` config object and checked at creation time. The database doesn't enforce limits because they change frequently and are business logic, not data integrity.

## License

MIT
