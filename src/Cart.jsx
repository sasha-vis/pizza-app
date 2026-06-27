import React, {useContext, useState} from 'react';
import {NavLink} from 'react-router-dom';
import { Context } from './context';
import { CartAdd } from './CartAdd';

export function Cart() {

    let {cart, setCart, totalCost, setTotalCost, cartAmount, setCartAmount} = useContext(Context);

    const [checked, setChecked] = useState(false);

    const openPopup = function () {
        if (totalCost < 15) {
            return alert('Необходимая сумма для заказа 15 рублей. Пожалуйста, добавьте что-нибудь еще')
        }
        const popup = document.querySelector('.order-popup');
        popup.classList.add('popup-open');
    };

    const exitPopup = function () {
        const popup = document.querySelector('.order-popup');
        popup.classList.remove('popup-open');
    };

    const sbmtAlrt = function (e) {
        e.preventDefault();
        
        // code

        exitPopup();
        alert('Спасибо за ваш заказ. Оператор свяжется с вами в ближайшее время')
        setCart('')
        localStorage.setItem('cart', cart);
        setCartAmount(0);
    };

    return (
        <div className="сart">
            <div className="cart-container">
                <a name="top"></a>
                <h3 className="cart-title">Корзина</h3>
                <div className="cart-list">
                    <CartAdd />
                </div>
                <div className="cart-alert">Внимание, минимальная сумма заказа для доставки 15 руб.<br></br>Чтобы добавить позицию в заказ <NavLink href="#top" to="/">вернитесь в меню</NavLink></div>
                <div className="cart-cost">
                    <div className="cart-cost-container">
                        Сумма заказа:<span><span>{totalCost}</span> руб.</span>
                    </div>
                </div>
                <div className="cart-btn-container">
                    <button className="return-btn"><NavLink to='/'>Вернуться в меню</NavLink></button>
                    <button className="order-btn" onClick={openPopup}><a href="#">Заказать</a></button>
                </div>
                <div className="order-popup">
                    <div className="popup-container">
                        <h3>Куда доставить?</h3>
                        <form method="post" className="form-container">
                            <div className="input-wrapper lg-2">
                                <input className="form-input" type="text" name="Имя" placeholder="Ваше имя"></input>
                            </div>
                            <div className="input-wrapper lg-2">
                                <input className="form-input" type="tel" name="Номер телефона" placeholder="Контактный номер телефона"></input>
                            </div>
                            <div className="input-wrapper lg-3">
                                <input className="form-input" type="text" name="Улица" placeholder="Улица"></input>
                            </div>
                            <div className="input-wrapper lg-1">
                                <input className="form-input" type="text" name="Дом" placeholder="Дом"></input>
                            </div>
                            <div className="input-wrapper lg-1">
                                <input className="form-input" type="number" name="Квартира" placeholder="Квартира"></input>
                            </div>
                            <div className="input-wrapper lg-1">
                                <input className="form-input" type="text" name="Подъезд" placeholder="Подъезд"></input>
                            </div>
                            <div className="input-wrapper lg-1">
                                <input className="form-input" type="text" name="Код двери" placeholder="Код двери"></input>
                            </div>
                            <div className="input-wrapper lg-1">
                                <input className="form-input" type="number" name="Этаж" placeholder="Этаж"></input>
                            </div>
                            <div className="input-wrapper lg-4">
                                <textarea className="form-textarea" name="Комментарий" maxLength="254" rows="3" placeholder="Комментарий"></textarea>
                            </div>
                            <div className="payment-wrapper">
                                <hr></hr>
                                <h5>Оплата</h5>
                                <div className="payment">
                                    <div className="payment-child">
                                        <label className="label-control">
                                            <input className="payment-input" type="radio" name="Оплата" value="Наличными" onChange={() => setChecked("Наличными")} checked={checked == "Наличными"}></input>
                                            Наличными
                                        </label>
                                    </div>
                                    <div className="payment-child">
                                        <label className="label-control">
                                            <input className="payment-input" type="radio" name="Оплата" value="Картой курьеру" onChange={() => setChecked("Картой курьеру")} checked={checked == "Картой курьеру"}></input>
                                            Картой курьеру
                                        </label>
                                    </div>
                                    <div className="payment-child">
                                        <label className="label-control">
                                            <input className="payment-input" type="radio" name="Оплата" value="Картой онлайн" onChange={() => setChecked("Картой онлайн")} checked={checked == "Картой онлайн"}></input>
                                            Картой онлайн
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button className="confirm-btn" type="submit" onClick={sbmtAlrt}>Подтвердить заказ</button>
                        </form>
                        <button className="form-close-btn" type="button" onClick={exitPopup}>
                            <i></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

