"use client";

import { useState } from "react";
import Link from "next/link";

import { useCartAmount } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export function Nav() {
	const [open, setOpen] = useState(false);
	const hydrated = useHydrated();
	const amount = useCartAmount();

	const closeBurger = () => setOpen(false);

	return (
		<nav className="nav">
			<div className="nav-container">
				<div className="nav-wrapper">
					{/* Бургер тогглит класс списка через state вместо querySelector */}
					<ul className={open ? "burger-open" : "nav-goods"}>
						<li className="pizza-ico">
							<Link onClick={closeBurger} href="/#pizzas">
								<p>Пиццы</p>
							</Link>
						</li>
						<li className="snack-ico">
							<Link onClick={closeBurger} href="/#snacks">
								<p>Закуски</p>
							</Link>
						</li>
						<li className="dessert-ico">
							<Link onClick={closeBurger} href="/#desserts">
								<p>Десерты</p>
							</Link>
						</li>
						<li className="drink-ico">
							<Link onClick={closeBurger} href="/#drinks">
								<p>Напитки</p>
							</Link>
						</li>
						<li className="sauce-ico">
							<Link onClick={closeBurger} href="/#sauces">
								<p>Соусы</p>
							</Link>
						</li>
						<div
							className={open ? "bg bg-open" : "bg"}
							onClick={closeBurger}
						></div>
					</ul>

					<Link
						href="/cart"
						onClick={() => window.scrollTo(0, 0)}
						className="cart-btn"
					>
						Корзина<span>{hydrated ? amount : 0}</span>
					</Link>

					<div className="burger-btn" onClick={() => setOpen(true)}>
						<div className="burger-line"></div>
					</div>
				</div>
			</div>
		</nav>
	);
}
