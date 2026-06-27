import React from 'react';
import Slider from "react-slick";

import images from './json/images.json';

export function SliderComponent() {

    const slidesArr = Object.values(images.slides);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="slider-container">
            <Slider className="slider" {...settings}>
                {slidesArr.map((item, index) => {
                    return <div data-index={index} key={index}><img src={item}/></div>
                })}
            </Slider>
        </div>
    );
};

