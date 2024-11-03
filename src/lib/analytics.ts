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
	_paq.push(["setTrackerUrl", `${u  }matomo.php`]);
	_paq.push(["setSiteId", id]);
	const d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	g.async = true;
	g.src = `${u  }matomo.js`;
	s?.parentNode?.insertBefore(g, s);
}

/**
 * Track urls without locale prefix, and separate custom event for locale.
 */
export function trackPageView(url: URL): void {
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

export function initAnalytics() {
	function onPageLoad() {
		const url = new URL(window.location.href);
		trackPageView(url);
	}

	/** Track page views with `ViewTransitions`. */
	document.addEventListener("astro:page-load", onPageLoad);
}
