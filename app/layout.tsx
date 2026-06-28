import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import "./globals.css";
import "./styles/app.css";
import "./styles/cart.css";
import "./styles/media.css";

import images from "@/data/images.json";
import { Nav } from "@/components/Nav";
import { ScrollTopButton } from "@/components/ScrollTopButton";

export const metadata: Metadata = {
	title: "Пицца Феникс",
	description: "Доставка пиццы в Минске — круглосуточно и бесплатно.",
};

const LOGO = "/images/ui/phoenix-logo.png";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ru">
			<body>
				<div className="site">
					<header className="header">
						<div className="header-container">
							<div className="header-wrapper">
								<div className="header-top-left">
									Доставка пиццы<div>бесплатно</div>
								</div>
								<div className="header-top-center">
									<Link href="/">
										<img className="logo" src={LOGO} alt="Пицца Феникс" />
									</Link>
									Пицца Феникс
								</div>
								<div className="header-top-right">
									<div className="header-contacts">
										<a href="tel:+375293776020">377-60-20</a>
									</div>
									<div className="header-deliverytime">
										доставка пиццы<div>круглосуточно</div>
									</div>
								</div>
							</div>
						</div>
					</header>

					<Nav />

					<main className="main">
						{children}
						<ScrollTopButton />
					</main>

					<footer className="footer">
						<div className="footer-container">
							<div className="footer-wrapper">
								<div className="logo">
									<Link href="/">
										<img src={LOGO} alt="Пицца Феникс" />
									</Link>
								</div>
								<div className="footer-contacts">
									<div className="messangers">
										<a href="https://www.instagram.com">
											<img src={images.contacts.inst} alt="Instagram" />
										</a>
										<a href="https://www.vkontakte.ru">
											<img src={images.contacts.vkon} alt="ВКонтакте" />
										</a>
									</div>
									<div className="pay">
										<img src={images.pay.belcard} alt="Белкарт" />
										<img src={images.pay.bePaid} alt="bePaid" />
										<img src={images.pay.cartaPokupok} alt="Карта покупок" />
										<img src={images.pay.fun} alt="" />
										<img src={images.pay.halva} alt="Халва" />
										<img src={images.pay.maestro} alt="Maestro" />
										<img src={images.pay.magnit} alt="Магнит" />
										<img src={images.pay.masterCard} alt="MasterCard" />
										<img
											src={images.pay.masterCardSecur}
											alt="MasterCard SecureCode"
										/>
										<img src={images.pay.verVisa} alt="Verified by Visa" />
										<img src={images.pay.visa} alt="Visa" />
									</div>
									<div className="tel">
										<a href="tel:+375293776020">+375 29 377-60-20</a>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
