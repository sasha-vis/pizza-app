"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import images from "@/data/images.json";

const slides = Object.values(images.slides);

export function Slider() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((src, index) => (
						<div className="embla__slide" key={index}>
							<img src={src} alt="" />
						</div>
					))}
				</div>
			</div>
			<button
				className="embla__button embla__button--prev"
				onClick={scrollPrev}
				aria-label="Предыдущий слайд"
			>
				‹
			</button>
			<button
				className="embla__button embla__button--next"
				onClick={scrollNext}
				aria-label="Следующий слайд"
			>
				›
			</button>
		</div>
	);
}
