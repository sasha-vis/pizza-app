"use client";

import Link from "next/link";

import { CartList } from "@/components/CartList";
import { OrderPopup } from "@/components/OrderPopup";
import { useTotalCost } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

// Бывш. Cart.jsx. Сумма заказа и список — из стора; кнопки и попап — в OrderPopup.
export default function CartPage() {
	const hydrated = useHydrated();
	const totalCost = useTotalCost();

	return (
		<div className="cart">
			<div className="cart-container">
				<h3 className="cart-title">Корзина</h3>
				<div className="cart-list">
					<CartList />
				</div>
				<div className="cart-alert">
					Внимание, минимальная сумма заказа для доставки 15 руб.
					<br />
					Чтобы добавить позицию в заказ <Link href="/">вернитесь в меню</Link>
				</div>
				<div className="cart-cost">
					<div className="cart-cost-container">
						Сумма заказа:
						<span>
							<span>{hydrated ? totalCost : 0}</span> руб.
						</span>
					</div>
				</div>
				<OrderPopup />
			</div>
		</div>
	);
}
