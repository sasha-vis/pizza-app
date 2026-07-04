export type Product = {
	id: string;
	img: string;
	name: string;
	size: string;
	description: string;
	cost: string;
};

// Категории перечислены ровно в одном месте — в CATEGORIES (lib/products.ts).
// CategoryKey выводится оттуда; здесь только реэкспорт, чтобы старые импорты
// `from "@/lib/types"` продолжали работать.
export type { CategoryKey } from "@/lib/products";
