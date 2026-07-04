# Phoenix Pizza — online pizza delivery store

A small but complete e-commerce front end for a pizza delivery shop (Minsk):
product catalog, persistent cart, and a checkout form that writes orders to a
database. Originally a 2021 CRA/React 17 single-page app on GitHub Pages, it has
since been migrated to **Next.js 15 (App Router)** and connected to **Supabase**.

> **Note:** the storefront UI is in Russian by design — the product targets a
> Russian-speaking market (Minsk, Belarus). Internationalization (i18n) is a
> possible future enhancement.

**Live demo:** https://pizza-app-aleksandrvysotski.vercel.app

## Tech stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Framework    | Next.js 15 (App Router), React 19              |
| Language     | TypeScript (strict)                            |
| Styling      | Tailwind CSS v4 + migrated plain CSS           |
| Client state | Zustand 5 (cart, persisted to `localStorage`)  |
| Backend / DB | Supabase (Postgres) — orders + admin dashboard |
| Carousel     | embla-carousel-react                           |
| Tooling      | ESLint 9 (flat config), Prettier               |
| Deployment   | Vercel (front end) + Supabase (DB)             |

## Features

- **Catalog** with categories (pizzas, snacks, sets, rolls, desserts, drinks,
  sauces) rendered from server components.
- **Cart** with add / increment / decrement / remove, a live badge, line totals,
  and a grand total. State is persisted across reloads.
- **Checkout** with form validation (name, phone, address, payment) and a minimum
  order guard (15 BYN).
- **Order persistence** — submitted orders are written to Supabase and visible in
  the Supabase Studio dashboard. Row Level Security restricts the public key to
  `INSERT` only.
- **Static prerendering** of the `/` and `/cart` routes for fast first paint.
- **Responsive** layout with a mobile burger menu and a scroll-to-top button.

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project (for the checkout flow)

### Installation

```bash
git clone https://github.com/sasha-vis/pizza-app.git
cd pizza-app
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-key>
```

The app expects an `orders` table in Supabase:

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'new'
);

-- Public key may only create orders, not read or modify them.
alter table orders enable row level security;
create policy "anon can insert orders"
  on orders for insert to anon with check (true);
```

### Running locally

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
npm run format   # prettier --write .
```

## Project structure

```
app/            App Router: layout, pages (/ and /cart), global styles
components/     UI components (Nav, Slider, ProductList, CartList, OrderPopup, …)
lib/            data access (products), Zustand store, Supabase client + orders
data/           products.json, images.json
public/images/  product images, UI icons, logo
```

The catalog categories live in a single source of truth — the `CATEGORIES`
array in `lib/products.ts` (the `CategoryKey` type is derived from it, and the
home-page sections are built from it).

The codebase is being restructured into a **feature-based architecture**
(`features/catalog`, `features/cart`, `features/checkout` + `shared/`, with
`app/` reduced to thin route composition) — see the roadmap below.

## Roadmap

- [x] Migrate from CRA/Vite to Next.js 15 + TypeScript + Zustand
- [x] Persist orders to Supabase with form validation
- [ ] Restructure into a feature-based architecture (`features/*` + `shared/`)
- [ ] Move menu & site settings to the database (Supabase + TanStack Query)
- [ ] Convert styling to Tailwind utilities
- [ ] Admin panel (manage products, branding, order statuses)
- [ ] Storybook & PWA

## License

This is a personal portfolio project.
