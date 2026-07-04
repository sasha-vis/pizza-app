import { Slider } from "@/components/Slider";
import { ProductList } from "@/components/ProductList";
import { SECTIONS } from "@/lib/products";

// Бывш. Catalog.jsx: слайдер + секции по категориям. Разбивка на секции и
// группировка закусок (4 категории под одним заголовком) заданы в SECTIONS
// (lib/products.ts). Якоря — для навигации /#pizzas и т.п.
export default function Home() {
	return (
		<div className="main-container">
			<Slider />

			{SECTIONS.map((section) => (
				<div key={section.id} className={section.className} id={section.id}>
					<h3>{section.title}</h3>
					{section.categories.map((category) => (
						<ProductList
							key={category.key}
							category={category.key}
							listClassName={category.listClassName}
						/>
					))}
				</div>
			))}
		</div>
	);
}
