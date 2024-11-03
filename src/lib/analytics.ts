import type { Locale } from "@/config/i18n.config";

declare global {
	interface Window {
		_paq?: Array<unknown>;
	}
}

export function createAnalyticsScript(baseUrl: string, id: number): void {
	const _paq = (window._paq = window._paq ?? []);
	_paq.push(["disableCookies"]);
	_paq.push(["enableHeartBeatTimer"]);
	const u = baseUrl;
	_paq.push(["setTrackerUrl", `${u}matomo.php`]);
	_paq.push(["setSiteId", id]);
	const d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	g.async = true;
	g.src = `${u}matomo.js`;
	s?.parentNode?.insertBefore(g, s);
}

/**
 * Track urls without locale prefix, and separate custom event for locale.
 */
export function trackPageView(url: URL, locale: Locale): void {
	/** @see https://developer.matomo.org/guides/tracking-javascript-guide#custom-variables */
	window._paq?.push(["setCustomVariable", 1, "Locale", locale, "page"]);
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

export function initAnalytics(locale: Locale) {
	function onPageLoad() {
		const url = new URL(window.location.href);
		trackPageView(url, locale);
	}

	/** Track page views with `ViewTransitions`. */
	document.addEventListener("astro:page-load", onPageLoad);
}
