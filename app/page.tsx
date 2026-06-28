import { Slider } from "@/components/Slider";
import { ProductList } from "@/components/ProductList";

// Бывш. Catalog.jsx: слайдер + секции по категориям. Закуски сгруппированы из
// 4 списков (как в оригинале). Якоря <a name> — для навигации /#pizzas и т.п.
export default function Home() {
	return (
		<div className="main-container">
			<Slider />

			<div className="main-pizzas" id="pizzas">
				<h3>Пиццы</h3>
				<ProductList category="pizzas" listClassName="pizzas-goods" />
			</div>

			<div className="main-snacks" id="snacks">
				<h3>Закуски</h3>
				<ProductList category="snacks" listClassName="snacks-goods" />
				<ProductList category="snacksset" listClassName="snacks-goods-set" />
				<ProductList
					category="snacksfreetur"
					listClassName="snacks-goods-freetur"
				/>
				<ProductList
					category="snacksrolls"
					listClassName="snacks-goods-rolls"
				/>
			</div>

			<div className="main-desserts" id="desserts">
				<h3>Десерты</h3>
				<ProductList category="desserts" listClassName="desserts-goods" />
			</div>

			<div className="main-drinks" id="drinks">
				<h3>Напитки</h3>
				<ProductList category="drinks" listClassName="drinks-goods" />
			</div>

			<div className="main-sauces" id="sauces">
				<h3>Соусы</h3>
				<ProductList category="sauces" listClassName="sauces-goods" />
			</div>
		</div>
	);
}
