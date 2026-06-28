"use client";

import { useCartStore, useHasInCart } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import type { CategoryKey } from "@/lib/types";

type Props = { category: CategoryKey; id: string };

// Кнопка «В корзину» / «В корзине». Добавление идемпотентно (см. store.add).
export function AddButton({ category, id }: Props) {
	const hydrated = useHydrated();
	const add = useCartStore((state) => state.add);
	const inCart = useHasInCart(category, id) && hydrated;

	return (
		<button
			className={inCart ? "add-btn at-cart" : "add-btn"}
			onClick={() => add(category, id)}
		>
			{inCart ? "В корзине" : "В корзину"}
		</button>
	);
}
