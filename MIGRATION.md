# MIGRATION.md — миграция «Пицца Феникс» на целевой стек

Пошаговый план миграции с **Vite + React 18 (JS)** на стек из `PLAN.md`:
**Next.js (App Router) + React 19 + TypeScript + Tailwind + ESLint/Prettier + Zustand
+ (позже) TanStack Query + Supabase**, деплой на **Vercel**.

> Это документ-инструкция. Код пока не пишется — здесь расписан каждый шаг: что делаем,
> зачем, какие файлы затрагиваются и как проверить результат.

## Принятые решения

1. **Дизайн сохраняем** — существующий CSS переносим как есть (классы не меняем),
   Tailwind подключаем как инструмент, но вёрстку пока не переписываем, позже заменяем CSS классы на Tailwind.
2. **Данные сначала из JSON** — Supabase подключаем отдельной поздней фазой (Фаза 2).
3. **Текущие незакоммиченные правки** (`vite.config.js` → `base`, префикс `/PizzaAppReactJS/`
   в `products.json`) пока не откатываем; пути картинок приведём в порядок на шаге миграции данных.
4. Миграция — **в этом же репозитории**, изменить название ветки с `master` на `main`.
5. **React последней версии**: `react-slick` если надо заменяется на альтернативу.
6. **Архитектура — простая структура** (`app/` + `components/` + `lib/` + `data/`).
   FSD/Atomic рассмотрены и отклонены как избыточные для приложения такого размера
   (Atomic к тому же покрывает только UI, а не состояние/фичи). При росте проекта
   к FSD можно перейти позже.
7. **Объём Фазы 1:** React→Next + App Router (новый роутинг), TypeScript, **ESLint + Prettier**,
   Tailwind (подключение), Zustand для корзины, перенос данных/стилей/статики.

## Исходное состояние (факт из репо)

- `src/index.jsx` → `src/App.jsx` (header/nav/footer/роуты + состояние корзины через Context).
- `src/context.jsx` — `React.createContext()`.
- `src/Catalog.jsx` (route `/`), `src/Cart.jsx` (route `/cart`), `src/CartAdd.jsx`, `src/Slider.jsx`.
- `src/ProductsComponents/*.jsx` — 8 почти одинаковых компонентов (отличаются ключом
  категории и `className` у `<ul>`).
- Данные: `src/json/products.json`, `src/json/images.json`. Картинки: `public/images/**`.
- Стили: `src/App.css`, `src/Cart.css`, `src/media.css`, `src/index.css`.
- Иконки UI: `src/images/*` (arrow-top.png, cross.svg, \*-ico.png), логотип `src/phoenix-logo.png`.
- Корзина: JSON-строка в state `cart` ↔ localStorage (ключ `cart`), формат
  `{ <категория>: [id, id, ...] }` (повтор id = количество). Мин. сумма заказа — 15 руб.

## Архитектура и структура каталогов (целевая)

Простая структура без FSD/Atomic. Next-`app/` — роутинг и layout, остальное рядом:

```
app/
  layout.tsx          # header + footer + <Nav/> + <ScrollTopButton/>, импорт стилей
  page.tsx            # главная (каталог)
  cart/page.tsx       # корзина
  globals.css         # reset + шрифт + директивы Tailwind
  styles/             # перенесённый существующий CSS (app.css, cart.css, media.css)
components/           # Nav, Slider, ProductList, CartList, OrderPopup, ScrollTopButton
lib/                  # types.ts, products.ts (доступ к меню), store.ts (Zustand)
data/                 # products.json, images.json
public/images/...      # картинки товаров + ui/ (иконки, логотип)
```

---

# ФАЗА 1 — Next.js + TS + существующий CSS + Zustand (данные из JSON)

Цель фазы: приложение визуально идентично текущему, работает на Next, деплоится на Vercel,
корзина — на Zustand (хрупкая логика `CartAdd` устранена).

## Шаг 1.0 — Переименование ветки `master` → `main`

**Что:** `git branch -m master main`; на GitHub — `git push -u origin main`, затем сменить
default branch на `main` в настройках репозитория и удалить старую `origin/master`.

**Зачем:** перейти на общепринятое имя ветки по умолчанию.

**Проверка:** `git branch --show-current` → `main`; default branch на GitHub — `main`.

## Шаг 1.1 — Зависимости и каркасные конфиги (Next, TS, Tailwind, ESLint, Prettier)

**Что:** переписать `package.json` и добавить конфиги.

- `package.json`:
  - `dependencies`: `next@^15`, **`react@^19`, `react-dom@^19`**, **`embla-carousel-react`**
    (вместо `react-slick`/`slick-carousel` — несовместимы с React 19 из-за `findDOMNode`),
    `zustand@^5`.
  - `devDependencies`: `typescript`, `@types/node`, `@types/react@^19`, `@types/react-dom@^19`,
    `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `eslint-config-next`,
    `prettier`, `eslint-config-prettier`.
  - Удалить: `vite`, `@vitejs/plugin-react`, `gh-pages`, `react-slick`, `slick-carousel`,
    поле `homepage`.
  - `scripts`: `dev: next dev`, `build: next build`, `start: next start`, `lint: next lint`,
    `format: prettier --write .`. Удалить `preview`/`predeploy`/`deploy`.
- Новые файлы:
  - `tsconfig.json` — стандартный Next (`strict: true`, `moduleResolution: bundler`,
    `resolveJsonModule: true`, alias `@/*` → корень).
  - `next.config.mjs` — минимальный (`reactStrictMode: true`). **`basePath` НЕ задаём** —
    на Vercel приложение в корне домена.
  - `next-env.d.ts` — стандартный (не редактировать).
  - `postcss.config.mjs`, `tailwind.config.ts` — `content` указывает на `./app` и `./components`.
  - `.eslintrc.json` (`extends: ["next/core-web-vitals", "next/typescript", "prettier"]`),
    `.prettierrc` (правила под текущий стиль: табы, как в проекте), `.prettierignore`.
- `.gitignore` — добавить `.next/`, `out/`, `*.tsbuildinfo`, `next-env.d.ts`; убрать `/dist`.

**Зачем:** заменить сборщик Vite на Next, включить TypeScript, Tailwind, единый линт/формат.

**Проверка:** файлы созданы; `npm install` пройдёт без конфликтов пиров (на шаге 1.10);
`npm run lint` запускается.

## Шаг 1.2 — Перенос статики (иконки и логотип)

**Что:** `git mv` из `src/images/*` и `src/phoenix-logo.png` в `public/images/ui/`.

- `src/images/arrow-top.png cross.svg *-ico.png` → `public/images/ui/`.
- `src/phoenix-logo.png` → `public/images/ui/phoenix-logo.png`.

**Зачем:** в Next папка `public/` отдаётся с корня (`/images/ui/...`); статика должна жить там.

**Проверка:** файлы лежат в `public/images/ui/`, ничего не потеряно.

## Шаг 1.3 — Перенос и правка CSS

**Что:** перенести стили и поправить пути к фоновым картинкам.

- `git mv src/App.css → app/styles/app.css`, `src/Cart.css → app/styles/cart.css`,
  `src/media.css → app/styles/media.css`. Содержимое `src/index.css` (reset + шрифт) — в `app/globals.css`.
- В `app/styles/app.css` заменить `url('./images/...')` (6 ссылок: arrow-top, pizza/snack/
  dessert/drink/sauce-ico) → `url('/images/ui/...')`.
- В `app/styles/cart.css` заменить `url('./images/cross.svg')` → `url('/images/ui/cross.svg')`.
- **Слайдер:** старые правила `.slick-*` в `app.css` под embla не работают. Заменить их на
  небольшой блок стилей для embla-разметки (`.embla`/`.embla__viewport`/`.embla__slide` +
  кнопки «вперёд/назад»), сохранив прежний вид баннера (высота ~280px, стрелки по бокам).

**Зачем:** перенести вид 1:1; абсолютные пути `/images/ui/...` корректно резолвятся в Next.

**Проверка:** после запуска фоновые иконки навигации, стрелка «наверх», крестик удаления
и баннер-слайдер выглядят как раньше.

## Шаг 1.4 — Перенос данных и типы

**Что:** перенести JSON и описать типы.

- `git mv src/json/products.json → data/products.json`, `src/json/images.json → data/images.json`.
- В обоих файлах привести пути картинок: префикс `/PizzaAppReactJS/...` → корневой `/images/...`
  (в `products.json` сейчас именно такой префикс из незакоммиченных правок; в `images.json` — тоже).
- `lib/types.ts`:
  - `type Product = { id: string; img: string; name: string; size: string; description: string; cost: string }`.
  - `type CategoryKey = 'pizzas' | 'snacks' | 'snacksset' | 'snacksfreetur' | 'snacksrolls' | 'desserts' | 'drinks' | 'sauces'`.

**Зачем:** данные вне `src`, типобезопасный доступ.

**Проверка:** `import products from '@/data/products.json'` типизируется; пути картинок начинаются с `/images/`.

## Шаг 1.5 — Доступ к данным (`lib/products.ts`)

**Что:** утилиты доступа к меню (переиспользуются стором и компонентами).

- `getProducts(category: CategoryKey): Product[]` — `Object.values(products[category])`.
- `getProduct(category, id): Product | undefined` — по ключу `'product' + (Number(id) + 1)`
  (повторяет текущую конвенцию `id` ↔ ключ объекта из `CartAdd.jsx`).
- `getCost(category, id): number` — `parseFloat(cost.replace(',', '.'))`.
- `CATEGORIES` — массив `{ key: CategoryKey; listClassName: string }` для рендера секций:
  `pizzas→pizzas-goods`, `snacks→snacks-goods`, `snacksset→snacks-goods-set`,
  `snacksfreetur→snacks-goods-freetur`, `snacksrolls→snacks-goods-rolls`,
  `desserts→desserts-goods`, `drinks→drinks-goods`, `sauces→sauces-goods`.

**Зачем:** убрать дублирование и хрупкое чтение цен из DOM; единый источник истины по меню.

**Проверка:** юнит-проверка вручную в dev — `getCost('pizzas','0')` возвращает число.

## Шаг 1.6 — Стор корзины на Zustand (`lib/store.ts`)

**Что:** заменить Context + JSON-строку чистым стором с персистом.

- `persist` (middleware), ключ localStorage `cart-v2` (старый `cart` несовместим — игнорируем).
- Состояние: `items: { category: CategoryKey; id: string; qty: number }[]`.
- Экшены: `add(category,id)` (если нет — добавить qty:1), `inc`, `dec` (qty→0 удаляет позицию),
  `remove(category,id)`, `clear()`.
- Селекторы (хук-хелперы): `useCartAmount()` = сумма `qty` (бейдж навбара),
  `useTotalCost()` = Σ `getCost(cat,id) * qty`, округление как сейчас.
- Хелпер `useHasInCart(category,id)` для кнопки «В корзину»/«В корзине».

**Зачем:** устранить `changeSumm`/`summa`-замыкание и `useEffect([changeSumm])` из `CartAdd.jsx`,
чтение `data-id`/`data-type` из DOM, ручную синхронизацию localStorage из `App.jsx`.

**Проверка:** после интеграции — добавление/изменение количества обновляет бейдж и сумму
реактивно; перезагрузка восстанавливает корзину.

## Шаг 1.7 — Layout, страницы и роутинг

**Что:** перенести каркас приложения в App Router.

- `app/layout.tsx` (server): `<html lang="ru">`, импорт `globals.css` + `app/styles/*.css`;
  разметка `header` и `footer` из `App.jsx` (контакты, оплата из `images.json`, лого
  `/images/ui/phoenix-logo.png`); внутри — `<Nav/>`, `{children}`, `<ScrollTopButton/>`.
- `app/page.tsx` (server): бывш. `Catalog.jsx` — `<Slider/>` + секции по `CATEGORIES`
  (с `<a name="...">`, `<h3>` и группировкой 4 снек-листов в секции «Закуски»),
  каждый список — `<ProductList category=... listClassName=... />`.
- `app/cart/page.tsx` (client): бывш. `Cart.jsx` — `<CartList/>`, итоговая сумма из селектора,
  кнопки, `<OrderPopup/>`.

**Зачем:** `BrowserRouter/Routes/Route` → файловый роутинг Next; уходит проблема gh-pages
с прямыми URL на вложенные маршруты.

**Проверка:** маршруты `/` и `/cart` открываются напрямую (в т.ч. по перезагрузке).

## Шаг 1.8 — Клиентские компоненты

**Что:** перенести интерактив с `'use client'`.

- `components/Nav.tsx` — бургер через `useState` (тогглим прежние классы `nav-goods`/
  `burger-open`, `bg`/`bg-open` — без `querySelector`), якоря `/#pizzas` и т.п.,
  бейдж `useCartAmount()`, ссылка на `/cart` через `next/link`.
- `components/Slider.tsx` — `embla-carousel-react` (слайды из `images.json`): viewport +
  кнопки «назад/вперёд», поведение как в `Slider.jsx` (1 слайд, зацикленность).
- `components/ProductList.tsx` — **обобщает 8 компонентов**: пропсы `category`, `listClassName`;
  рендер карточек (img/name/size/description/cost), кнопка через `add` + `useHasInCart`.
- `components/CartList.tsx` — бывш. `CartAdd.jsx`, переписан на стор: позиции, +/−/удалить,
  построчная и общая сумма из селекторов (без замыканий и DOM-датасетов).
- `components/OrderPopup.tsx` — попап + форма; открытие/закрытие через `useState`;
  гард мин. суммы 15 руб.; submit → `clear()` + сообщение (запись заказа — Фаза 2).
- `components/ScrollTopButton.tsx` — `window.scrollTo(0,0)`.

**Зачем:** убрать прямые манипуляции DOM, свести 8 файлов к одному `ProductList`.

**Проверка:** см. шаг 1.10.

## Шаг 1.9 — Удаление артефактов Vite/CRA

**Что:** удалить `vite.config.js`, корневой `index.html`, `src/index.jsx`, `src/App.jsx`,
`src/context.jsx`, `src/Catalog.jsx`, `src/Cart.jsx`, `src/CartAdd.jsx`, `src/Slider.jsx`,
`src/ProductsComponents/`, опустевшие `src/json`, `src/images`, каталог `dist/`.

**Зачем:** убрать дублирующий мёртвый код прежнего стека.

**Проверка:** `src/` либо пуст и удалён, либо отсутствует; сборка не ссылается на старые пути.

## Шаг 1.10 — Установка, запуск и верификация

**Что:** `npm install`, затем проверка.

1. `npm install` — без ошибок.
2. `npm run dev` → `http://localhost:3000`:
   - главная: слайдер крутится, все 8 категорий с картинками, кнопка «В корзину» работает
     и переключается на «В корзине»;
   - бейдж в навбаре растёт; `/cart`: +/−/удаление позиций, построчная и общая сумма верны;
   - попап оформления: при сумме < 15 руб. — алерт-гард; submit очищает корзину;
   - бургер-меню на узком экране открывается/закрывается; кнопка «наверх» скроллит.
3. Перезагрузка страницы — корзина восстанавливается из localStorage (persist).
4. `npm run build` — без ошибок типов; `npm start` отдаёт прод-сборку.

## Шаг 1.11 — Деплой на Vercel и документация

**Что:** подключить репозиторий к Vercel (framework определится как Next автоматически);
обновить `CLAUDE.md` под новый стек/команды/архитектуру.

**Проверка:** превью-деплой открывается, картинки и маршруты `/` и `/cart` работают.

---

# ФАЗА 2 — Supabase + TanStack Query (после проверки Фазы 1)

Детализируется отдельно. Кратко:

1. Создать проект Supabase; таблицы `products` (меню) и `orders` (заявки).
   Ключи в `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. `@supabase/supabase-js` + **TanStack Query** — загрузка/кэш меню (заменяет импорт JSON
   в `lib/products.ts`).
3. Картинки товаров — опционально в Supabase Storage (иначе остаются в `public/images`).
4. `OrderPopup` пишет заказ в `orders` (имя, телефон, адрес, состав, оплата), статус
   «заявка принята». Просмотр заявок — Supabase Studio.

---

# Что дальше (после Фазы 1, до Supabase)

- **Перевод вёрстки на Tailwind** — постепенно заменять классы из перенесённого CSS
  (`app/styles/*.css`) на Tailwind-утилиты, компонент за компонентом, удаляя старый CSS
  по мере переноса. Делается после стабилизации Фазы 1, не блокирует деплой.

# Риски и заметки

- **React 19 + embla** — `react-slick` несовместим с React 19 (удалён `findDOMNode`),
  поэтому слайдер переносим на `embla-carousel-react`. Вид баннера воспроизводим стилями
  (шаг 1.3); поведение — 1 слайд, зацикленность, стрелки по бокам.
- **Сброс корзины у текущих пользователей** — старый формат localStorage (`cart`) несовместим
  с новым стором (`cart-v2`); разовая потеря содержимого корзины (приемлемо).
- Незакоммиченные правки `vite.config.js`/`products.json` уходят вместе с удалением Vite;
  префикс путей переопределяется на шаге 1.4.
- Конвенция `id` ↔ ключ объекта (`'product' + (id+1)`) сохраняется в `lib/products.ts`,
  чтобы не переписывать `products.json`.
