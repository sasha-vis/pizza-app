import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getCost } from "@/lib/products";
import type { CategoryKey } from "@/lib/types";

export type CartItem = {
	category: CategoryKey;
	id: string;
	qty: number;
};

type CartState = {
	items: CartItem[];
	add: (category: CategoryKey, id: string) => void;
	inc: (category: CategoryKey, id: string) => void;
	dec: (category: CategoryKey, id: string) => void;
	remove: (category: CategoryKey, id: string) => void;
	clear: () => void;
};

const sameItem =
	(category: CategoryKey, id: string) =>
	(item: CartItem): boolean =>
		item.category === category && item.id === id;

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],

			// Добавление «В корзину»: если позиции нет — qty:1; если есть — без изменений
			// (повторяет исходную логику toCart из ProductsComponents).
			add: (category, id) =>
				set((state) =>
					state.items.some(sameItem(category, id))
						? state
						: { items: [...state.items, { category, id, qty: 1 }] },
				),

			inc: (category, id) =>
				set((state) => ({
					items: state.items.map((item) =>
						sameItem(category, id)(item)
							? { ...item, qty: item.qty + 1 }
							: item,
					),
				})),

			// Уменьшение: qty→0 удаляет позицию из корзины.
			dec: (category, id) =>
				set((state) => ({
					items: state.items
						.map((item) =>
							sameItem(category, id)(item)
								? { ...item, qty: item.qty - 1 }
								: item,
						)
						.filter((item) => item.qty > 0),
				})),

			remove: (category, id) =>
				set((state) => ({
					items: state.items.filter(
						(item) => !sameItem(category, id)(item),
					),
				})),

			clear: () => set({ items: [] }),
		}),
		{
			// Новый ключ: старый формат `cart` (JSON-строка) несовместим — игнорируем.
			name: "cart-v2",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

// Бейдж навбара — суммарное количество позиций.
export const useCartAmount = (): number =>
	useCartStore((state) => state.items.reduce((sum, item) => sum + item.qty, 0));

// Итоговая сумма заказа. Округление 1:1 с оригиналом: каждая позиция — до 2 знаков,
// итог — до 1 знака.
export const useTotalCost = (): number =>
	useCartStore((state) => {
		const total = state.items.reduce(
			(sum, item) =>
				sum + Number((getCost(item.category, item.id) * item.qty).toFixed(2)),
			0,
		);
		return Number(total.toFixed(1));
	});

// Для кнопки «В корзину» / «В корзине».
export const useHasInCart = (category: CategoryKey, id: string): boolean =>
	useCartStore((state) => state.items.some(sameItem(category, id)));
