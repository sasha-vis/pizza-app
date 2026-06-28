# CLAUDE.md

Этот файл — ориентир для работы с кодом в этом репозитории.

## О проекте

Интернет-магазин пиццы «Пицца Феникс» (доставка в Минске): каталог товаров,
корзина с персистом в localStorage, форма оформления заказа с записью заявки в
БД. Изначально — CRA/React 18 SPA на GitHub Pages; мигрирован на
**Next.js 15 (App Router)** (Фаза 1), заказы пишутся в **Supabase** (Фаза 2).
Деплой — на Vercel (ветка `gh-pages` и старый GitHub Pages удалены).

Теги: `v1` — оригинал (CRA/React 17, 2021); `v2` — Next.js + Supabase.

## Стек

- **Next.js 15** — App Router, серверные и клиентские компоненты.
- **React 19**, **TypeScript** (strict).
- **Tailwind CSS v4** — CSS-first (без `tailwind.config`); подключён через
  `@import "tailwindcss";` в `app/globals.css`, плагин `@tailwindcss/postcss`.
  Основная вёрстка — на обычном CSS (перенесён из старого проекта), Tailwind
  доступен для нового кода.
- **Zustand 5** — стор корзины с middleware `persist`.
- **Supabase** (`@supabase/supabase-js`) — БД заказов (Postgres) + админка.
  Заказ пишется с клиента publishable-ключом; доступ ограничен RLS.
- **embla-carousel-react** — слайдер баннеров на главной (заменил react-slick).
- **ESLint 9** (flat config, `eslint.config.mjs`) + **Prettier** (отступы табами).

## Команды

```bash
npm run dev      # dev-сервер Next (http://localhost:3000)
npm run build    # production-сборка
npm start        # запуск прод-сборки (после build)
npm run lint     # eslint .
npm run format   # prettier --write .
```

Тестов в проекте нет. Проверка изменений — `npm run lint` + `npx tsc --noEmit`
+ `npm run build`, затем ручная проверка в браузере (см. сценарии ниже).

## Архитектура

Файловый роутинг App Router. Маршруты `/` и `/cart` пререндерятся статически.

- **`app/layout.tsx`** (server) — корневой layout: `<html lang="ru">`, header,
  footer (контакты и иконки оплаты из `data/images.json`, лого
  `/images/ui/phoenix-logo.png`), `<Nav/>`, `{children}`, `<ScrollTopButton/>`.
  Импортирует `globals.css` + `app/styles/{app,cart,media}.css`.
- **`app/page.tsx`** (server) — главная (бывш. `Catalog.jsx`): `<Slider/>` +
  секции по категориям. Закуски сгруппированы из 4 списков. Якоря секций — через
  `id` на `div` (`id="pizzas"` и т.п.), навигация — ссылки `/#pizzas`.
- **`app/cart/page.tsx`** (client) — корзина: сумма из `useTotalCost`,
  `<CartList/>`, `<OrderPopup/>`.

### Компоненты (`components/`)

- **`Nav.tsx`** (client) — навигация; бургер-меню через `useState` (тогглит классы
  `nav-goods`/`burger-open` и `bg`/`bg-open` — без `querySelector`); бейдж из
  `useCartAmount()`; ссылка на `/cart` через `next/link`.
- **`Slider.tsx`** (client) — embla-карусель (слайды из `images.json`, `loop`,
  кнопки «назад/вперёд»). Стили `.embla*` — в `app/styles/app.css`.
- **`ProductList.tsx`** (server) — **обобщает 8 прежних `ProductsComponents`**:
  пропсы `category` + `listClassName`, рендер карточек. `size`/`description`
  рендерятся только при наличии (у напитков/десертов нет `description`, у соусов —
  ни того, ни другого).
- **`AddButton.tsx`** (client) — кнопка «В корзину»/«В корзине» (`add` +
  `useHasInCart`). Вынесена из `ProductList`, чтобы тот оставался серверным.
- **`CartList.tsx`** (client) — позиции корзины (бывш. `CartAdd.jsx`), кнопки
  +/−/удалить и построчная сумма — из стора, без DOM-датасетов и замыканий.
- **`OrderPopup.tsx`** (client) — кнопки «Вернуться»/«Заказать» + попап-форма;
  открытие/закрытие через `useState`; гард мин. суммы 15 руб. На submit: чтение
  полей через `FormData` (имена полей — русские: `Имя`, `Номер телефона`, `Улица`,
  `Дом`, ...), валидация обязательных (имя, телефон ≥7 цифр, улица+дом, оплата),
  сборка адреса в строку, `createOrder(...)` → `clear()` + сообщение; кнопка
  блокируется на время отправки (`sending`).
- **`ScrollTopButton.tsx`** (client) — `window.scrollTo(0, 0)`.

### Данные и доступ (`data/`, `lib/`)

- **`data/products.json`** — все товары. Структура:
  `{ <категория>: { "product1": {id, img, name, size?, description?, cost}, ... } }`.
  Категории: `pizzas`, `snacks`, `snacksset`, `snacksfreetur`, `snacksrolls`,
  `desserts`, `drinks`, `sauces`. Внимание: `id` — строка («0», «1», ...), а ключ
  объекта — `"product" + (Number(id) + 1)`. Пути картинок — корневые `/images/...`.
- **`data/images.json`** — пути к картинкам слайдера, оплаты, контактов (корневые
  `/images/...`).
- **`lib/types.ts`** — `Product`, `CategoryKey`.
- **`lib/products.ts`** — доступ к меню: `getProducts(category)`,
  `getProduct(category, id)` (ключ `'product'+(Number(id)+1)`),
  `getCost(category, id)` (`parseFloat(cost.replace(',', '.'))`), и `CATEGORIES`
  (`{ key, listClassName }[]` для рендера секций).
- **`lib/store.ts`** — Zustand-стор корзины (см. ниже).
- **`lib/supabase.ts`** — клиент Supabase (`createClient` из URL + publishable-
  ключа в env).
- **`lib/orders.ts`** — запись заказа: `buildOrderProducts(cartItems)` (снимок
  позиций: имя/размер/цена на момент заказа) и `createOrder(order)` (`insert` в
  таблицу `orders`, бросает ошибку при сбое).
- **`lib/useHydrated.ts`** — `useHydrated()`: `true` только после монтирования;
  гард против hydration mismatch для значений из persist (бейдж, сумма, состояние
  кнопок) — на сервере и в 1-м клиентском рендере отдаём дефолт.

### Состояние корзины (`lib/store.ts`)

Стор `useCartStore` на Zustand + `persist` (ключ localStorage **`cart-v2`**;
старый формат `cart` несовместим и игнорируется).

- Состояние: `items: { category: CategoryKey; id: string; qty: number }[]`.
- Экшены: `add` (если позиции нет — `qty: 1`; **идемпотентен** — повтор не растит
  qty, как исходная кнопка «В корзину»), `inc`, `dec` (qty → 0 удаляет позицию),
  `remove`, `clear`.
- Селекторы-хуки: `useCartAmount()` (Σ qty — бейдж), `useTotalCost()`
  (Σ `getCost * qty`; округление 1:1 с оригиналом — позиция `toFixed(2)`, итог
  `toFixed(1)`), `useHasInCart(category, id)`.
- Минимальная сумма заказа — 15 руб. (гард в `OrderPopup`).

### Заказы и Supabase (`lib/supabase.ts`, `lib/orders.ts`)

- Таблица **`orders`**: `id, created_at, name, phone, address, items jsonb, total,
  status` (по умолчанию `status = 'new'`). `items` хранит
  `{ products: {name, size?, qty, cost}[], payment, comment }`.
- **RLS включён**, политика разрешает роли `anon` **только `INSERT`**
  (`with check (true)`). С фронта нельзя читать/править заявки — они видны лишь в
  Table Editor Supabase. Если добавляешь чтение/обновление с клиента — нужна новая
  политика.
- Ключ — **publishable** (`sb_publishable_...`), безопасен для браузера.
- Переменные окружения: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  Локально — в `.env.local` (в `.gitignore`); на Vercel — заданы для Production +
  Preview. Префикс `NEXT_PUBLIC_` обязателен (значения нужны клиентскому коду).

### Статика

- **`public/images/`** — раздаётся Next с корня (`/images/...`). Подпапки: товары
  по категориям (`pizzas/`, `snacks/`, ...), `slider/`, `pay/`, `contacts/`, и
  **`ui/`** — иконки навигации, стрелка «наверх», крестик, лого.
- **`app/styles/`** — перенесённый CSS: `app.css`, `cart.css`, `media.css`
  (адаптив). Reset + шрифт — в `app/globals.css`.

## Важные особенности и подводные камни

- **Hydration:** значения из persist-стора (бейдж, сумма, состояние кнопок «В
  корзине») доступны только на клиенте. Любой новый клиентский компонент, который
  их показывает, должен гасить расхождение через `useHydrated()` (дефолт до
  монтирования), иначе hydration mismatch.
- **`ProductList` — серверный**, интерактив вынесен в клиентский `AddButton`.
  Сохраняй это разделение: не тащи хуки стора в `ProductList`.
- **ESLint:** правило `@next/next/no-img-element` отключено намеренно — каталог
  отдаёт много статичных `<img>`, размеры задаёт CSS (не `next/image`).
  `next-env.d.ts` — в `ignores` (автоген triple-slash reference).
- **CSS-классы списков** жёстко связаны со стилями: `pizzas-goods`, `snacks-goods`,
  `snacks-goods-set` (без flex-стилей — как в оригинале), `snacks-goods-freetur`,
  `snacks-goods-rolls`, `desserts-goods`, `drinks-goods`, `sauces-goods`. Значения
  — в `CATEGORIES` и в `app/page.tsx`; менять синхронно с CSS.
- **Поля товара `size`/`description`** у части категорий отсутствуют в данных —
  рендерятся условно по наличию. Не делай их обязательными в разметке.
- При запуске под Node возможен `ExperimentalWarning: localStorage` (SSR persist) —
  безвреден, `createJSONStorage` корректно деградирует на сервере.
- **Supabase env-переменные** нужны и локально (`.env.local`), и на Vercel. Если на
  проде заказ не оформляется — первым делом проверь, что обе переменные заданы для
  Production и сделан Redeploy. `.env.local` в гит не коммитится.

## Стиль кода

- TypeScript, функциональные компоненты, именованные экспорты для компонентов
  (`export function ...`); страницы — `export default`.
- Клиентские компоненты помечаются директивой `"use client"`.
- Отступы табами (Prettier). Текст интерфейса — на русском.
- Алиас импорта `@/*` → корень проекта (см. `tsconfig.json`).
