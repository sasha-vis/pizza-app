import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";

// Единый источник списка категорий: ключ данных + className списка + раздел
// каталога (секция на главной, к которой относится категория). Добавляешь
// категорию — только сюда. CategoryKey выводится из этого же массива.
// Несколько категорий подряд с одинаковым section.id образуют одну секцию на
// странице (см. SECTIONS ниже) — так закуски (snacks/snacksset/snacksfreetur/
// snacksrolls) рендерятся под одним заголовком без отдельного массива.
export const CATEGORIES = [
	{
		key: "pizzas",
		listClassName: "pizzas-goods",
		section: { id: "pizzas", title: "Пиццы", className: "main-pizzas" },
	},
	{
		key: "snacks",
		listClassName: "snacks-goods",
		section: { id: "snacks", title: "Закуски", className: "main-snacks" },
	},
	{
		key: "snacksset",
		listClassName: "snacks-goods-set",
		section: { id: "snacks", title: "Закуски", className: "main-snacks" },
	},
	{
		key: "snacksfreetur",
		listClassName: "snacks-goods-freetur",
		section: { id: "snacks", title: "Закуски", className: "main-snacks" },
	},
	{
		key: "snacksrolls",
		listClassName: "snacks-goods-rolls",
		section: { id: "snacks", title: "Закуски", className: "main-snacks" },
	},
	{
		key: "desserts",
		listClassName: "desserts-goods",
		section: { id: "desserts", title: "Десерты", className: "main-desserts" },
	},
	{
		key: "drinks",
		listClassName: "drinks-goods",
		section: { id: "drinks", title: "Напитки", className: "main-drinks" },
	},
	{
		key: "sauces",
		listClassName: "sauces-goods",
		section: { id: "sauces", title: "Соусы", className: "main-sauces" },
	},
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

type Category = (typeof CATEGORIES)[number];

// Секции для рендера на главной: соседние категории с одинаковым section.id
// схлопываются в одну секцию (закуски → 4 категории под одним заголовком).
export const SECTIONS = CATEGORIES.reduce<
	{ id: string; title: string; className: string; categories: Category[] }[]
>((sections, category) => {
	const last = sections[sections.length - 1];
	if (last && last.id === category.section.id) {
		last.categories.push(category);
	} else {
		sections.push({ ...category.section, categories: [category] });
	}
	return sections;
}, []);

type ProductsData = Record<CategoryKey, Record<string, Product>>;

const products = productsData as unknown as ProductsData;

// Ключ объекта товара = 'product' + (id + 1) — конвенция из исходного CartAdd.jsx
function productKey(id: string): string {
	return "product" + (Number(id) + 1);
}

export function getProducts(category: CategoryKey): Product[] {
	return Object.values(products[category]);
}

export function getProduct(
	category: CategoryKey,
	id: string,
): Product | undefined {
	return products[category][productKey(id)];
}

export function getCost(category: CategoryKey, id: string): number {
	const product = getProduct(category, id);
	return product ? parseFloat(product.cost.replace(",", ".")) : 0;
}
