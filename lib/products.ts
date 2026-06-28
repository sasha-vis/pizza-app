import productsData from "@/data/products.json";
import type { CategoryKey, Product } from "@/lib/types";

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

// Категории для рендера секций каталога: ключ данных + className списка
export const CATEGORIES: { key: CategoryKey; listClassName: string }[] = [
	{ key: "pizzas", listClassName: "pizzas-goods" },
	{ key: "snacks", listClassName: "snacks-goods" },
	{ key: "snacksset", listClassName: "snacks-goods-set" },
	{ key: "snacksfreetur", listClassName: "snacks-goods-freetur" },
	{ key: "snacksrolls", listClassName: "snacks-goods-rolls" },
	{ key: "desserts", listClassName: "desserts-goods" },
	{ key: "drinks", listClassName: "drinks-goods" },
	{ key: "sauces", listClassName: "sauces-goods" },
];
