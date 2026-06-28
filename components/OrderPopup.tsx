"use client";

import { useState } from "react";
import Link from "next/link";

import { useCartStore, useTotalCost } from "@/lib/store";
import { createOrder, buildOrderProducts } from "@/lib/orders";

export function OrderPopup() {
	const [open, setOpen] = useState(false);
	const [payment, setPayment] = useState("");
	const [sending, setSending] = useState(false);
	const totalCost = useTotalCost();
	const items = useCartStore((state) => state.items);
	const clear = useCartStore((state) => state.clear);

	const openPopup = () => {
		if (totalCost < 15) {
			alert(
				"Необходимая сумма для заказа 15 рублей. Пожалуйста, добавьте что-нибудь еще",
			);
			return;
		}
		setOpen(true);
	};

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fd = new FormData(e.currentTarget);
		const get = (key: string) => String(fd.get(key) ?? "").trim();

		const name = get("Имя");
		const phone = get("Номер телефона");
		const street = get("Улица");
		const house = get("Дом");

		// Простая валидация обязательных полей.
		if (!name) return alert("Пожалуйста, укажите ваше имя");
		if (phone.replace(/\D/g, "").length < 7)
			return alert("Пожалуйста, укажите корректный номер телефона");
		if (!street || !house)
			return alert("Пожалуйста, укажите улицу и дом для доставки");
		if (!payment) return alert("Пожалуйста, выберите способ оплаты");

		// Собираем адрес из заполненных частей в одну строку.
		const address = [
			`ул. ${street}, д. ${house}`,
			get("Квартира") && `кв. ${get("Квартира")}`,
			get("Подъезд") && `подъезд ${get("Подъезд")}`,
			get("Этаж") && `этаж ${get("Этаж")}`,
			get("Код двери") && `код ${get("Код двери")}`,
		]
			.filter(Boolean)
			.join(", ");

		setSending(true);
		try {
			await createOrder({
				name,
				phone,
				address,
				total: totalCost,
				items: {
					products: buildOrderProducts(items),
					payment,
					comment: get("Комментарий"),
				},
			});
			setOpen(false);
			alert(
				"Спасибо за ваш заказ. Оператор свяжется с вами в ближайшее время",
			);
			clear();
		} catch {
			alert(
				"Не удалось оформить заказ. Попробуйте ещё раз или позвоните нам.",
			);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<div className="cart-btn-container">
				<button className="return-btn">
					<Link href="/">Вернуться в меню</Link>
				</button>
				<button className="order-btn" onClick={openPopup}>
					<a>Заказать</a>
				</button>
			</div>

			<div className={open ? "order-popup popup-open" : "order-popup"}>
				<div className="popup-container">
					<h3>Куда доставить?</h3>
					<form method="post" className="form-container" onSubmit={submit}>
						<div className="input-wrapper lg-2">
							<input
								className="form-input"
								type="text"
								name="Имя"
								placeholder="Ваше имя"
							/>
						</div>
						<div className="input-wrapper lg-2">
							<input
								className="form-input"
								type="tel"
								name="Номер телефона"
								placeholder="Контактный номер телефона"
							/>
						</div>
						<div className="input-wrapper lg-3">
							<input
								className="form-input"
								type="text"
								name="Улица"
								placeholder="Улица"
							/>
						</div>
						<div className="input-wrapper lg-1">
							<input
								className="form-input"
								type="text"
								name="Дом"
								placeholder="Дом"
							/>
						</div>
						<div className="input-wrapper lg-1">
							<input
								className="form-input"
								type="number"
								name="Квартира"
								placeholder="Квартира"
							/>
						</div>
						<div className="input-wrapper lg-1">
							<input
								className="form-input"
								type="text"
								name="Подъезд"
								placeholder="Подъезд"
							/>
						</div>
						<div className="input-wrapper lg-1">
							<input
								className="form-input"
								type="text"
								name="Код двери"
								placeholder="Код двери"
							/>
						</div>
						<div className="input-wrapper lg-1">
							<input
								className="form-input"
								type="number"
								name="Этаж"
								placeholder="Этаж"
							/>
						</div>
						<div className="input-wrapper lg-4">
							<textarea
								className="form-textarea"
								name="Комментарий"
								maxLength={254}
								rows={3}
								placeholder="Комментарий"
							/>
						</div>
						<div className="payment-wrapper">
							<hr />
							<h5>Оплата</h5>
							<div className="payment">
								{["Наличными", "Картой курьеру", "Картой онлайн"].map(
									(method) => (
										<div className="payment-child" key={method}>
											<label className="label-control">
												<input
													className="payment-input"
													type="radio"
													name="Оплата"
													value={method}
													onChange={() => setPayment(method)}
													checked={payment === method}
												/>
												{method}
											</label>
										</div>
									),
								)}
							</div>
						</div>
						<button
							className="confirm-btn"
							type="submit"
							disabled={sending}
						>
							{sending ? "Отправляем…" : "Подтвердить заказ"}
						</button>
					</form>
					<button
						className="form-close-btn"
						type="button"
						onClick={() => setOpen(false)}
					>
						<i></i>
					</button>
				</div>
			</div>
		</>
	);
}
