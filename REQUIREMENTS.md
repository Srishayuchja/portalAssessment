# Full-Stack Take-Home — DEALPORT Admin Dashboard + Products API

**Role:** Full-Stack Developer (NestJS-heavy backend, Next.js admin UI)
**Timebox:** 48–72 hours
**Brand:** DEALPORT (emerald/green admin shell)

> Implement the scoped DEALPORT screens from the public Figma Community file, with a real NestJS + Prisma API for products. Do **not** build the entire kit — depth on the scoped slice beats breadth.

---

## 1. Stack (required)

| Layer    | Tech |
|----------|------|
| Backend  | NestJS, TypeScript, Prisma, PostgreSQL, JWT |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Deploy   | Public URL for frontend + backend (or monorepo deploy) |

---

## 2. Design source

Public Figma Community file only (duplicate to drafts, implement **only** the scoped screens):
https://www.figma.com/design/pb00zvXQ4XQo6zIh1hxko7/E-commerce-Dashboard--Admin--UI-Kits--Community-?node-id=5-1346

Reference screenshots for the scoped UI are in:
- `Portal Hiring TEST.pdf` (pages 4–5: Dashboard, Add Product)
- `E-commerce Dashboard (Admin) UI Kits (Community)/` folder (full kit screenshots — only Dashboard.png and Add Product.png are directly in-scope references; the rest are context only, not to be built)

---

## 3. Scoped screens (IN SCOPE)

### 3.1 Dashboard
App shell (sidebar + top bar), plus:
- Stat cards: sales / orders / pending
- "Report for this week" summary + chart area (chart library **or** static SVG is OK)
- Transaction table (seeded API or static data OK **if documented** in README)
- Best selling / Top products widgets **MUST** load from the real NestJS product APIs

### 3.2 Add Product
Form with:
- Basic details (name, description)
- Pricing (price, discounted price, tax included, expiration dates)
- Inventory (stock quantity, stock status, "unlimited" toggle, featured toggle)
- Categories / tags
- Image upload UI (real upload **or** URL/base64 stub OK **if documented** in README)
- Actions: **Publish Product** and **Save to draft** → both map to product `status`, both persist via `POST /products`

### 3.3 Product List
- Sidebar entry: "Product List"
- Table/list **MUST** be API-integrated (no mock-only data)
- Minimal search + filter support

---

## 4. Explicitly OUT OF SCOPE

Do **not** build these, even though they exist in the Figma kit / screenshots folder:
- Order Management (full flows)
- Customers
- Coupon Code
- Brand
- Product Media / Product Reviews (beyond what Add Product's image field needs)
- Admin role / Control Authority
- Theme polish beyond matching the green primary look
- Any other screen in the kit not listed in Section 3

---

## 5. Backend requirements (NestJS)

- **Modules:** `auth`, `products`, `categories` (+ `tags` if the Add Product form needs a separate tag entity)
- **Auth:** JWT login for an admin/seller persona
- **Prisma + PostgreSQL models:** `User`, `Product`, `Category` (+ optional `Tag`, image URLs as string/array field)
- **Minimum endpoints:**
  | Method | Route | Notes |
  |--------|-------|-------|
  | POST | `/auth/login` | seeded admin user |
  | GET | `/products` | list — supports search + pagination |
  | POST | `/products` | create |
  | GET | `/products/:id` | read one |
  | PATCH | `/products/:id` | update |
  | DELETE | `/products/:id` | delete |
  | GET | `/categories` | seed: Electronic, Fashion, Home, etc. |
- **Validation:** DTOs + `class-validator` on all write endpoints
- **Layering:** Controller → Service → Prisma. **No Prisma calls inside controllers.**
- **No mock-only product data anywhere:** Product List, Add Product, and the dashboard product widgets must all read from this real API.

---

## 6. Frontend requirements (Next.js)

- App Router + TypeScript + Tailwind CSS
- Layout matches the DEALPORT shell: sidebar with **Dashboard / Add Products / Product List**, active-state highlighting
- Typed API client, attaches Bearer token after login
- Desktop-first (~1440px design). Mobile "usable" is a nice-to-have, not required.
- Layout fidelity target: good-enough match (spacing, hierarchy, table/form structure). **Pixel-perfect is not required.**

---

## 7. Deliverables

1. GitHub repo (public or invite-only) — monorepo or separate FE/BE repos
2. Deployed demo URL(s) — frontend and backend both live
3. README containing:
   - Setup instructions
   - Env vars via `.env.example` only (**no real secrets committed**)
   - Architecture notes
   - Seed users/passwords (so reviewers can log in immediately)
4. Seed script (creates admin user + sample categories/products)

---

## 8. Submission fields required

- GitHub URL
- Live frontend URL
- Live API URL
- Seed credentials
- Hours spent (approx)

---

## 9. Key notes / gotchas

- **A real NestJS API is required for products — a frontend backed by mock data fails the assessment outright.**
- No company-internal designs or codebases are provided or allowed — use only the public Figma Community link above.
- Grading favors **depth on the 3 scoped screens** over building extra screens from the kit.
