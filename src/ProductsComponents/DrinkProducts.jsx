import React, {useContext} from 'react';
import { Context } from '../context';
import productsData from '../json/products.json';

export function DrinkProducts() {

    const productArr = Object.values(productsData.drinks);

    let {cart, setCart} = useContext(Context);

    let cartArr = {};

    if (cart.length > 0) {
        cartArr = JSON.parse(cart);
    }

    if (!cartArr.drinks) cartArr.drinks = [];

    const toCart = function (event) {
        const li = event.target.closest('li');

        if (cartArr.drinks.indexOf(li.dataset.id) === -1) {
            cartArr.drinks.push(li.dataset.id);

            let cartStr = JSON.stringify(cartArr);
            localStorage.setItem('cart', cartStr);

            setCart(cartStr);
        }
    };
 
    return (
        <ul className="drinks-goods">{
            productArr.map((item, index) =>
                <li className="product" key={index} data-id={index}>
                    <div className="product-img">
                        <img src={item.img}></img>
                    </div>
                    <div className="product-description">
                        <h3>{item.name}</h3>
                        <div className="size-weight">{item.size}</div>
                    </div>
                    <div className="add-container">
                        <div className="cost">{item.cost}</div>
                        {cartArr.drinks.indexOf(item.id) === -1 ? <button className="add-btn" onClick={toCart}>В корзину</button> : <button className="add-btn at-cart" onClick={toCart}>В корзине</button>}
                    </div>
                </li>
            )    
        }</ul>
    );
}