import React from 'react';

import { PizzaProducts } from './ProductsComponents/PizzaProducts';
import { SnackProducts } from './ProductsComponents/SnackProducts';
import { SnackSetProducts } from './ProductsComponents/SnackSetProducts';
import { SnackFreeturProducts } from './ProductsComponents/SnackFreeturProducts';
import { SnackRollProducts } from './ProductsComponents/SnackRollsProducts';
import { DessertProducts } from './ProductsComponents/DessertProducts';
import { DrinkProducts } from './ProductsComponents/DrinkProducts';
import { SauceProducts } from './ProductsComponents/SauceProducts';

import { SliderComponent } from './Slider';

export function Catalog() {

    return (
        <div className="main-container">

            <SliderComponent />

            <div className="main-pizzas">
                <a name="pizzas"></a>
                <h3>Пиццы</h3>
                <PizzaProducts />
            </div>
            <div className="main-snacks">
                <a name="snacks"></a>
                <h3>Закуски</h3>
                <SnackProducts />
                <SnackSetProducts />
                <SnackFreeturProducts />
                <SnackRollProducts />
            </div>
            <div className="main-desserts">
                <a name="desserts"></a>
                <h3>Десерты</h3>
                <DessertProducts />
            </div>
            <div className="main-drinks">
                <a name="drinks"></a>
                <h3>Напитки</h3>
                <DrinkProducts />
            </div>
            <div className="main-sauces">
                <a name="sauces"></a>
                <h3>Соусы</h3>
                <SauceProducts />
            </div>
        </div>
    )
}
