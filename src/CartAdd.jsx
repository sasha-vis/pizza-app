import React, { useState, useContext, useEffect } from 'react';
import { Context } from './context';

import productsData from './json/products.json';

export function CartAdd() {

    let {cart, setCart, totalCost, setTotalCost} = useContext(Context);

    let cartProduct = [];
    let cartProductJsx = <div className='cart-item'><div className="cart-empty-text">Корзина пуста</div></div>;

    const deleteItem = function (event) {

        const elem = event.target.closest('.cart-item');
        
        const itemType = elem.dataset.type;
        const itemId= elem.dataset.id;

        const cartObj = JSON.parse(cart);
        let cartObj2 = JSON.parse(cart);


        if (cartObj[itemType].indexOf(itemId) != -1) {
            cartObj2 = cartObj2[itemType];

            cartObj2.forEach((item, index) => {
                if (item === itemId) {
                    delete cartObj[itemType][index]
                }
            });

            cartObj[itemType] = cartObj[itemType].filter(item => {
                if (item) return item;
            });

            const cartStr = JSON.stringify(cartObj);

            setCart(cartStr);
        }
    };
    
    const minusItem = function (event) {
        const elem = event.target.closest('.cart-item');
        
        const itemType = elem.dataset.type;
        const itemId= elem.dataset.id;

        const cartObj = JSON.parse(cart);

        const index = cartObj[itemType].indexOf(itemId);

        cartObj[itemType].splice(index, 1);

        const cartStr = JSON.stringify(cartObj);

        setCart(cartStr);

    };

    const plusItem = function (event) {
        const elem = event.target.closest('.cart-item');
        
        const itemType = elem.dataset.type;
        const itemId= elem.dataset.id;

        const cartObj = JSON.parse(cart);

        const index = cartObj[itemType].indexOf(itemId);

        cartObj[itemType].push(cartObj[itemType][index]);

        const cartStr = JSON.stringify(cartObj);

        setCart(cartStr);

    };

    let summa;

    const changeSumm = function (summ) {
        summa = summ;
        return summa;
    };

    useEffect(function () {
        if(summa === undefined) summa = 0;
		setTotalCost(summa)
	}, [changeSumm]);

    if (cart.length === 0) {
        return cartProductJsx;
    } else {
        let cartData = JSON.parse(cart);

        let keys = Object.keys(cartData)


        keys.forEach(key => {
            cartData[key].forEach(indexProduct => {
                productsData[key]['product' + (+indexProduct + 1)].type = key;
                productsData[key]['product' + (+indexProduct + 1)].id = indexProduct;
                cartProduct.push(productsData[key]['product' + (+indexProduct + 1)])
            });
        });


        if (cartProduct.length !== 0) {

            console.log(cartProduct)

            let cartProductRendered = [];

            let summTotalCost = 0;
           
            cartProductJsx = cartProduct.map((item, index) => {

                let cartObj = JSON.parse(cart);
                let amount = 0;

                cartObj[item.type].forEach(cartItem => {
                    if (cartItem === item.id) amount++;
                })

                if(amount === 0) {
                    amount = 1;
                    summTotalCost = 0;
                }

                if (cartProductRendered.indexOf(item.id+item.type) === -1) {
                    cartProductRendered.push(item.id+item.type);

                    let itemCost = Number((parseFloat(item.cost.replace(',', '.'))*amount).toFixed(2));
                    summTotalCost += itemCost;

                    return <div className="cart-item" key={index} data-index={index} data-id={item.id} data-type={item.type}>
                        <div className="item-image"><div className='image-wrapper'><img src={item.img}></img></div></div>
                        <div className="item-title">{item.name}</div>
                        <div className="item-amount">
                            <div className="amount-changer" onClick={minusItem}><span>-</span></div>
                            <div className="amount">{amount}</div>
                            <div className="amount-changer" onClick={plusItem}><span>+</span></div>
                        </div>
                        <div className="item-price"><span className="price-value">{itemCost} руб.</span></div>
                        <div className="item-delete"><div className="delete-btn" onClick={deleteItem}><div className="cross"></div></div></div>
                    </div>
                }

            })

            changeSumm(Number(summTotalCost.toFixed(1)));
        }

        return cartProductJsx;
    }
};

