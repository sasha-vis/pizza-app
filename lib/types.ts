export type Product = {
	id: string;
	img: string;
	name: string;
	size: string;
	description: string;
	cost: string;
};

export type CategoryKey =
	| "pizzas"
	| "snacks"
	| "snacksset"
	| "snacksfreetur"
	| "snacksrolls"
	| "desserts"
	| "drinks"
	| "sauces";
