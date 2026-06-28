import { getProducts } from "@/lib/products";
import type { CategoryKey } from "@/lib/types";
import { AddButton } from "@/components/AddButton";

type Props = { category: CategoryKey; listClassName: string };

// Обобщает 8 прежних ProductsComponents. Серверный компонент (статичная разметка
// карточек); интерактивная кнопка вынесена в клиентский AddButton.
// size/description рендерятся только при наличии — у напитков/десертов нет
// description, у соусов нет ни size, ни description (как в оригинале).
export function ProductList({ category, listClassName }: Props) {
	const products = getProducts(category);

	return (
		<ul className={listClassName}>
			{products.map((product) => (
				<li className="product" key={product.id}>
					<div className="product-img">
						<img src={product.img} alt={product.name} />
					</div>
					<div className="product-description">
						<h3>{product.name}</h3>
						{product.size && (
							<div className="size-weight">{product.size}</div>
						)}
						{product.description && (
							<div className="description">{product.description}</div>
						)}
					</div>
					<div className="add-container">
						<div className="cost">{product.cost}</div>
						<AddButton category={category} id={product.id} />
					</div>
				</li>
			))}
		</ul>
	);
}
