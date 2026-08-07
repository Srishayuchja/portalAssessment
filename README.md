# DEALPORT Admin Dashboard + Products API

Full-stack take-home submission: a NestJS + Prisma + PostgreSQL API and a Next.js admin
dashboard implementing the scoped DEALPORT screens (Dashboard, Add Product, Product List).
See [`REQUIREMENTS.md`](./REQUIREMENTS.md) for the original brief this was built against.

## Stack

| Layer    | Tech |
|----------|------|
| Backend  | NestJS 11, TypeScript, Prisma 6, PostgreSQL, JWT (Passport) |
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Recharts |

## Monorepo layout

```
apps/
  api/   NestJS backend
  web/   Next.js frontend
```

npm workspaces tie the two together — a single `npm install` at the repo root installs
both apps' dependencies.

## Local setup

### 1. Backend (`apps/api`)

Prerequisites: PostgreSQL running locally (or any reachable Postgres instance).

```bash
cd apps/api
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string, and JWT_SECRET

npx prisma migrate dev   # creates tables
npx prisma db seed       # seeds admin user + categories + sample products

npm run start:dev        # from repo root: npm run dev:api
```

API runs on `http://localhost:3000` by default (see `PORT` in `.env`).

### 2. Frontend (`apps/web`)

```bash
cd apps/web
cp .env.example .env.local
# edit .env.local: set NEXT_PUBLIC_API_URL to the backend URL

npm run dev               # from repo root: npm run dev:web
```

Frontend runs on `http://localhost:3001` (or whatever port Next.js picks if 3000 is taken
by the API — run them from separate terminals).

### Seed credentials

```
email:    admin@dealport.dev
password: Admin@123
```

The login page pre-fills these for convenience during review.

## Architecture notes

- **Layering**: every backend feature module follows Controller → Service → Prisma. Prisma
  is never called directly from a controller — `PrismaService` is injected only into
  services (`src/prisma/prisma.service.ts`, exported globally via `PrismaModule`).
- **Auth**: `POST /auth/login` verifies credentials with bcrypt and returns a signed JWT.
  Write endpoints on `/products` (`POST`, `PATCH`, `DELETE`) are protected with
  `JwtAuthGuard`; read endpoints (`GET /products`, `GET /categories`) are left public so the
  dashboard and product list can be viewed without requiring a token on every read — the
  frontend still attaches the Bearer token on every request once logged in.
- **Validation**: all write DTOs use `class-validator` decorators, enforced globally via a
  `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) in `main.ts`.
- **Prisma version**: pinned to Prisma **6.x** rather than the newly-released 7.x. Prisma 7's
  default client generator is ESM-first and requires a driver-adapter wiring
  (`@prisma/adapter-pg`) that doesn't yet interoperate cleanly with NestJS's default
  CommonJS build. Prisma 6's classic `prisma-client-js` generator is the well-trodden,
  stable path for a NestJS project and was the safer choice under this project's timebox.
- **Image upload**: per the brief, real file upload was treated as out of scope. The Add
  Product form accepts one or more **image URLs** instead (`images: string[]` on the
  `Product` model) — paste a URL and it's added as a thumbnail. Seeded products use
  `picsum.photos` placeholder URLs.
- **Dashboard "Best selling" / "Top products" widgets**: these load from the real
  `GET /products` endpoint (sorted by `totalOrders` desc and `createdAt` desc respectively),
  per the requirement that dashboard product widgets must not be mock-only data. The stat
  cards, "Report for this week" chart, and the Transaction table are **static placeholder
  data** in the frontend — there is no Order Management API in this build (explicitly out
  of scope per the brief), so there's no real backend source for sales/order figures. This
  is the documented static-data exception the brief allows for those specific widgets.
- **"Best selling" data source**: since Order Management is out of scope, there's no real
  orders table to derive a sales count from. `Product.totalOrders` is a seeded integer field
  used only to make the Best Selling widget sort meaningfully; it's not incremented by any
  real order flow.

## API reference

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| POST   | `/auth/login` | – | Returns `{ accessToken, user }` |
| GET    | `/products` | – | Query: `search`, `page`, `limit`, `status`, `categoryId`, `sortBy`, `sortOrder` |
| GET    | `/products/:id` | – | |
| POST   | `/products` | Bearer | |
| PATCH  | `/products/:id` | Bearer | |
| DELETE | `/products/:id` | Bearer | |
| GET    | `/categories` | – | |

## Scope

Implemented: Dashboard shell (sidebar + top bar), Add Product form (Publish / Save Draft),
Product List (search + pagination, API-integrated).

Out of scope (per brief): Order Management, Customers, Coupon Code, Brand, Product Media /
Reviews, Admin role / Control Authority, and any other screen from the Figma kit.

## Deployment

- Live frontend URL: _TBD_
- Live API URL: _TBD_
- Hours spent (approx): _TBD_
