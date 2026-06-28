"use client";

// Бывш. <div id="arrowTop"> из App.jsx. Стилизуется фоном-стрелкой в app.css.
export function ScrollTopButton() {
	return <div id="arrowTop" onClick={() => window.scrollTo(0, 0)} />;
}
