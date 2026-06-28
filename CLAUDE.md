# CLAUDE.md

Этот файл — ориентир для работы с кодом в этом репозитории.

## О проекте

Одностраничное React-приложение интернет-магазина пиццы «Пицца Феникс»
(доставка в Минске). Каталог товаров, корзина с localStorage, форма оформления
заказа. Деплой на GitHub Pages: https://sasha-vis.github.io/PizzaAppReactJS/

## Стек

- **React 18** (функциональные компоненты + хуки, без TypeScript)
- **Vite 6** — сборка и dev-сервер (миграция с CRA выполнена недавно)
- **react-router-dom 6** — роутинг (`BrowserRouter`)
- **react-slick** + **slick-carousel** — слайдер на главной
- **gh-pages** — деплой статики из `dist/`
- Стили — обычный CSS (без препроцессоров и CSS-модулей)

## Команды

```bash
npm run dev       # dev-сервер Vite
npm run build     # production-сборка в dist/
npm run preview   # локальный просмотр собранной версии
npm run deploy    # build + публикация dist/ на gh-pages
```

Тестов в проекте нет.

## Архитектура

Точка входа `src/index.jsx` → `src/App.jsx`.

- **`App.jsx`** — корневой компонент: header, nav (с бургер-меню),
  footer, роуты. Держит глобальное состояние корзины и отдаёт его через Context.
- **`context.jsx`** — `React.createContext()`. В Provider передаются:
  `cart`, `setCart`, `totalCost`, `setTotalCost`, `cartAmount`, `setCartAmount`.
- **`Catalog.jsx`** (route `/`) — главная: слайдер + секции товаров по категориям.
- **`Cart.jsx`** (route `/cart`) — корзина и попап-форма оформления заказа.
- **`CartAdd.jsx`** — рендер позиций в корзине, расчёт суммы, кнопки +/−/удалить.
- **`Slider.jsx`** — карусель баннеров.
- **`ProductsComponents/*.jsx`** — по одному компоненту на категорию товаров
  (`PizzaProducts`, `SnackProducts`, `SnackSetProducts`, `SnackFreeturProducts`,
  `SnackRollsProducts`, `DessertProducts`, `DrinkProducts`, `SauceProducts`).
  Все устроены одинаково: читают свою секцию из `products.json`, рендерят список,
  кнопка «В корзину» добавляет `data-id` в массив категории внутри `cart`.

### Данные

- **`src/json/products.json`** — все товары. Структура:
  `{ <категория>: { "product1": {id, img, name, size, description, cost}, ... } }`.
  Ключи-категории: `pizzas`, `snacks`, `snacksset`, `snacksfreetur`,
  `snacksrolls`, `desserts`, `drinks`, `sauces`.
  Внимание: `id` — строка («0», «1», ...), а ключ объекта — `"product" + (id+1)`.
- **`src/json/images.json`** — пути к картинкам слайдера, оплаты, контактов.
- **`public/images/`** — статические изображения товаров (раздаются Vite как есть).

### Состояние корзины

Корзина хранится как **JSON-строка** в state `cart` и синхронизируется с
`localStorage` (ключ `cart`) через `useEffect` в `App.jsx`. Формат после парсинга:
`{ <категория>: [<id>, <id>, ...] }` — повторяющийся id означает увеличение
количества. `cartAmount` — общее число позиций, `totalCost` — сумма заказа.
Минимальная сумма заказа — 15 руб.

## Важные особенности и подводные камни

- **`vite.config.js` не задаёт `base`**, хотя приложение деплоится в подпапку
  `/PizzaAppReactJS/` на GitHub Pages. Для корректного деплоя, скорее всего,
  потребуется `base: '/PizzaAppReactJS/'`.
- **Несогласованность путей к картинкам**: в `products.json` пути относительные
  (`./images/...`), а в `images.json` — абсолютные с префиксом
  (`/PizzaAppReactJS/images/...`). Учитывать при работе с `base`.
- **Прямые манипуляции с DOM**: бургер-меню, попап и скролл реализованы через
  `document.querySelector` и переключение классов, а не через состояние React.
- **`BrowserRouter` + GitHub Pages**: прямые переходы по вложенным URL без
  доп. настройки (404-редирект / HashRouter) могут не работать на gh-pages.
- Логика в `CartAdd.jsx` использует `changeSumm`/`summa` через замыкание и
  `useEffect` с функцией в зависимостях — расчёт суммы хрупкий, менять осторожно.
- Якорная навигация по секциям через `<a name="...">` и ссылки `/#pizzas`.

## Стиль кода

- Функциональные компоненты, именованные экспорты (`export function ...`).
- Отступы табами. Текст интерфейса — на русском.
- Без линтера/Prettier в конфиге — придерживаться существующего стиля файла.
