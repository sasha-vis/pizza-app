# PLAN.md — дорожная карта «Пицца Феникс» (`pizza-app`)

Интернет-магазин пиццы (доставка в Минске): каталог, корзина, оформление
заказа с записью заявки в БД. Этот файл — живая карта: сверху история по фазам,
снизу — что делаем дальше.

## Стек (текущий)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Zustand 5 ·
Supabase (Postgres) · деплой на Vercel + Supabase. Детали кода — в `CLAUDE.md`.

---

## Сделано

### `v1` — оригинал (2021)

- CRA / React 17, react-router-dom v5, react-slick.
- Чистый фронтенд: без бэка, БД, TypeScript и менеджера состояния.
- Корзина — JSON-строка в localStorage (ключ `cart`). Деплой на GitHub Pages.

### Фаза 1 — миграция на Next.js (→ часть `v2`)

- CRA/Vite → **Next.js 15 (App Router)**, React 19, **TypeScript** (strict).
- Роутинг: `BrowserRouter` → файловый (`/`, `/cart`).
- Корзина: Context + JSON-строка → **Zustand** с `persist` (ключ `cart-v2`);
  убраны чтение `data-*` из DOM и хрупкая логика `CartAdd`.
- 8 почти одинаковых `ProductsComponents` сведены в один серверный `ProductList`
  (интерактив — в клиентском `AddButton`).
- react-slick → **embla-carousel-react** (совместимость с React 19).
- Tailwind v4 подключён; основная вёрстка — на перенесённом 1:1 CSS.
- ESLint 9 (flat) + Prettier. Удалены артефакты Vite/CRA.
- Деплой на **Vercel** (GitHub Pages и ветка `gh-pages` удалены).

### Фаза 2 — заказы в Supabase (→ `v2`)

- Подключён **Supabase** (`@supabase/supabase-js`), клиент в `lib/supabase.ts`.
- Таблица **`orders`** (`name, phone, address, items jsonb, total, status`),
  **RLS**: роль `anon` — только `INSERT`.
- `OrderPopup` пишет заявку в БД (`lib/orders.ts`) + валидация полей формы;
  заглушка submit заменена реальной записью. Заявки видны в Supabase Studio.
- Env-переменные `NEXT_PUBLIC_SUPABASE_*` — в `.env.local` и на Vercel
  (Production + Preview).

---

## Дальше (бэклог)

Основной функционал готов; ниже — необязательные улучшения. Приоритет и детали
дополняются по ходу.

- [ ] **Меню из БД** — перенести `data/products.json` в таблицу `products`
      Supabase; каталог тянет данные оттуда (через TanStack Query). Картинки —
      опционально в Supabase Storage.
- [ ] **Статусы заказов** — работа с полем `status` (например, смена статуса в
      Studio / простая админ-страница).
- [ ] **Перевод вёрстки на Tailwind** — постепенно заменять классы из
      `app/styles/*.css` на утилиты, компонент за компонентом.
- [ ] **Storybook / PWA** — опционально, для портфолио / мобильного заказа.
- [ ] **Мелкие правки** — UI, тексты, доработки валидации.
