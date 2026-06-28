import { supabase } from "@/lib/supabase";
import { getProduct, getCost } from "@/lib/products";
import type { CartItem } from "@/lib/store";

// Снимок одной позиции заказа — сохраняем имя/размер/цену на момент заказа,
// чтобы заявка не «поплыла», если меню потом поменяется.
export type OrderProduct = {
	name: string;
	size?: string;
	qty: number;
	cost: number;
};

// Содержимое поля items (jsonb) в таблице orders.
export type OrderItems = {
	products: OrderProduct[];
	payment: string;
	comment: string;
};

export type NewOrder = {
	name: string;
	phone: string;
	address: string;
	items: OrderItems;
	total: number;
};

// Превращает позиции корзины в человекочитаемый снимок для заказа.
export function buildOrderProducts(cartItems: CartItem[]): OrderProduct[] {
	return cartItems.map((item) => {
		const product = getProduct(item.category, item.id);
		return {
			name: product?.name ?? "—",
			size: product?.size,
			qty: item.qty,
			cost: getCost(item.category, item.id),
		};
	});
}

// Записывает заказ в Supabase. Бросает ошибку, если вставка не удалась.
export async function createOrder(order: NewOrder): Promise<void> {
	const { error } = await supabase.from("orders").insert(order);
	if (error) throw error;
}
