import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';

import { Context } from './context';

import { Catalog } from './Catalog';
import { Cart } from './Cart';

import './media.css';
import './App.css';
import './Cart.css';

import logo from './phoenix-logo.png';
import images from './json/images.json';

export function App() {

	const [cart, setCart] = useState(function(){
        let cartStr = localStorage.getItem('cart') || '';
        return cartStr;
    });

    const [totalCost, setTotalCost] = useState(0);

	const [cartAmount, setCartAmount] = useState(0);

	const checkCartAmount = function (){
		let count = 0;

		if(cart === '') return;

		const cartObj = JSON.parse(cart);

		let keys = Object.keys(cartObj);

        keys.forEach(key => {
			count += cartObj[key].length;
		});

		setCartAmount(count);
	};

	useEffect(function () {
		localStorage.setItem('cart', cart)
		checkCartAmount();
	}, [cart]);

	const openBurger = function () {
		const nav = document.querySelector('.nav-goods');
		nav.classList.add('burger-open');
		nav.classList.remove('nav-goods');

		const bg = document.querySelector('.bg');
		bg.classList.add('bg-open');
	};

	const exitBurger = function () {
		if (document.querySelector('.burger-open') === null) return;
		const nav = document.querySelector('.burger-open');
		nav.classList.add('nav-goods');
		nav.classList.remove('burger-open');

		const bg = document.querySelector('.bg');
		bg.classList.remove('bg-open');
	};

	const scroll = function () {
		window.scrollTo(0, 0);
	};

	return (
		<BrowserRouter>
		<Context.Provider value={{cart, setCart, totalCost, setTotalCost, cartAmount, setCartAmount}}>
			<div className="site">
				<header className="header">
					<div className="header-container">
						<div className="header-wrapper">

							<div className="header-top-left">Доставка пиццы<div>бесплатно</div></div>

							<div className="header-top-center"><a href="/"><img className='logo' src={logo} alt="#" /></a>Пицца Феникс</div>

							<div className="header-top-right">
								<div className="header-contacts"><a href="tel:+375293776020">377-60-20</a></div>
								<div className="header-deliverytime">доставка пиццы<div>круглосуточно</div></div>
							</div>

						</div>
					</div>
				</header>

				<nav className="nav">
					<div className="nav-container">
						<div className="nav-wrapper">

							<ul className="nav-goods">
								<li className="pizza-ico"><a onClick={exitBurger} href="/#pizzas"><p>Пиццы</p></a></li>
								<li className="snack-ico"><a onClick={exitBurger} href="/#snacks"><p>Закуски</p></a></li>
								<li className="dessert-ico"><a onClick={exitBurger} href="/#desserts"><p>Десерты</p></a></li>
								<li className="drink-ico"><a onClick={exitBurger} href="/#drinks"><p>Напитки</p></a></li>
								<li className="sauce-ico"><a onClick={exitBurger} href="/#sauces"><p>Соусы</p></a></li>
								<div className="bg" onClick={exitBurger}></div>
							</ul>

							<NavLink to='/cart' onClick={scroll} className="cart-btn">Корзина<span>{cartAmount}</span></NavLink>

							<div className="burger-btn" onClick={openBurger}>
								<div className="burger-line"></div>
							</div>

						</div>
					</div>
				</nav>

				<main className="main">
					<Routes>
						<Route path='/' element={<Catalog />} />
						<Route path='/cart' element={<Cart />} />
					</Routes>
					<div id="arrowTop" onClick={scroll}></div>
				</main>

				<footer className="footer">
					<div className="footer-container">
						<div className="footer-wrapper">
							<div className="logo"><a href="/"><img src={logo} alt="#"/></a></div>
							<div className="footer-contacts">
								<div className="messangers">
									<a href="https://www.instagram.com"><img src={images.contacts.inst} alt="#"/></a>
									<a href="https://www.vkontakte.ru"><img src={images.contacts.vkon} alt="#"/></a>
								</div>
								<div className="pay">
									<img src={images.pay.belcard} alt="#"/>
									<img src={images.pay.bePaid} alt="#"/>
									<img src={images.pay.cartaPokupok} alt="#"/>
									<img src={images.pay.fun} alt="#"/>
									<img src={images.pay.halva} alt="#"/>
									<img src={images.pay.maestro} alt="#"/>
									<img src={images.pay.magnit} alt="#"/>
									<img src={images.pay.masterCard} alt="#"/>
									<img src={images.pay.masterCardSecur} alt="#"/>
									<img src={images.pay.verVisa} alt="#"/>
									<img src={images.pay.visa} alt="#"/>
								</div>
								<div className="tel"><a href="tel:+375293776020">+375 29 377-60-20</a></div>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</Context.Provider>
		</BrowserRouter>
	)
}

