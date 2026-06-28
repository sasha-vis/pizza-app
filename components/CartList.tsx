"use client";

import { useCartStore } from "@/lib/store";
import { getCost, getProduct } from "@/lib/products";
import { useHydrated } from "@/lib/useHydrated";

const EmptyCart = () => (
	<div className="cart-item">
		<div className="cart-empty-text">Корзина пуста</div>
	</div>
);

export function CartList() {
	const hydrated = useHydrated();
	const items = useCartStore((state) => state.items);
	const inc = useCartStore((state) => state.inc);
	const dec = useCartStore((state) => state.dec);
	const remove = useCartStore((state) => state.remove);

	// До гидрации стор пуст на сервере — показываем то же, что при пустой корзине.
	if (!hydrated || items.length === 0) {
		return <EmptyCart />;
	}

	return (
		<>
			{items.map((item) => {
				const product = getProduct(item.category, item.id);
				if (!product) return null;

				// Построчная сумма: цена × количество, округление до 2 знаков (как в оригинале).
				const lineCost = Number(
					(getCost(item.category, item.id) * item.qty).toFixed(2),
				);

				return (
					<div className="cart-item" key={item.category + item.id}>
						<div className="item-image">
							<div className="image-wrapper">
								<img src={product.img} alt={product.name} />
							</div>
						</div>
						<div className="item-title">{product.name}</div>
						<div className="item-amount">
							<div
								className="amount-changer"
								onClick={() => dec(item.category, item.id)}
							>
								<span>-</span>
							</div>
							<div className="amount">{item.qty}</div>
							<div
								className="amount-changer"
								onClick={() => inc(item.category, item.id)}
							>
								<span>+</span>
							</div>
						</div>
						<div className="item-price">
							<span className="price-value">{lineCost} руб.</span>
						</div>
						<div className="item-delete">
							<div
								className="delete-btn"
								onClick={() => remove(item.category, item.id)}
							>
								<div className="cross"></div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
