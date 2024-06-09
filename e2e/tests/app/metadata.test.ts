import { createUrl } from "@acdh-oeaw/lib";

import { defaultLocale, locales } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.PUBLIC_APP_BASE_URL!;

test("should set a canonical url", async ({ createIndexPage }) => {
	for (const locale of locales) {
		const { indexPage } = await createIndexPage(locale);
		await indexPage.goto();

		const canonicalUrl = indexPage.page.locator('link[rel="canonical"]');
		await expect(canonicalUrl).toHaveAttribute(
			"href",
			String(createUrl({ baseUrl, pathname: `/${locale}/` })),
		);
	}
});

test("should set document title on not-found page", async ({ createI18n, page }) => {
	const i18n = await createI18n(defaultLocale);

	await page.goto("/unknown/");
	await expect(page).toHaveTitle(
		[i18n.t("NotFoundPage.meta.title"), i18n.t("metadata.title")].join(" | "),
	);

	// TODO:
	// const i18nDe = await createI18n("de");
	// await page.goto("/de/unknown/");
	// await expect(page).toHaveTitle(
	// 	[i18nDe.t("NotFoundPage.meta.title"), i18nDe.t("metadata.title")].join(" | "),
	// );
});

test("should disallow indexing of not-found page", async ({ page }) => {
	for (const pathname of ["/unknown/", "/de/unknown/"]) {
		await page.goto(pathname);

		const ogTitle = page.locator('meta[name="robots"]');
		await expect(ogTitle).toHaveAttribute("content", "noindex");
	}
});

test("should set page metadata", async ({ createIndexPage }) => {
	for (const locale of locales) {
		const { indexPage, i18n } = await createIndexPage(locale);
		await indexPage.goto();

		expect(i18n.t("metadata.title")).toBeTruthy();
		expect(i18n.t("metadata.shortTitle")).toBeTruthy();
		expect(i18n.t("metadata.description")).toBeTruthy();

		const ogType = indexPage.page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute("content", "website");

		const twCard = indexPage.page.locator('meta[name="twitter:card"]');
		await expect(twCard).toHaveAttribute("content", "summary_large_image");

		const twCreator = indexPage.page.locator('meta[name="twitter:creator"]');
		await expect(twCreator).toHaveAttribute("content", i18n.t("metadata.twitter"));

		const twSite = indexPage.page.locator('meta[name="twitter:site"]');
		await expect(twSite).toHaveAttribute("content", i18n.t("metadata.twitter"));

		// const googleSiteVerification = indexPage.page.locator('meta[name="google-site-verification"]');
		// await expect(googleSiteVerification).toHaveAttribute("content", "");

		await expect(indexPage.page).toHaveTitle(
			[i18n.t("IndexPage.meta.title"), i18n.t("metadata.title")].join(" | "),
		);

		const metaDescription = indexPage.page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", i18n.t("metadata.description"));

		const ogTitle = indexPage.page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", i18n.t("IndexPage.meta.title"));

		const ogDescription = indexPage.page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", i18n.t("metadata.description"));

		const ogSiteName = indexPage.page.locator('meta[property="og:site_name"]');
		await expect(ogSiteName).toHaveAttribute("content", i18n.t("metadata.title"));

		const ogUrl = indexPage.page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl, pathname: `/${locale}/` })),
		);

		const ogLocale = indexPage.page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", locale);
	}
});

test("should add json+ld metadata", async ({ createIndexPage }) => {
	for (const locale of locales) {
		const { indexPage, i18n } = await createIndexPage(locale);
		await indexPage.goto();

		const metadata = await indexPage.page
			.locator('script[type="application/ld+json"]')
			.textContent();
		// eslint-disable-next-line playwright/prefer-web-first-assertions
		expect(metadata).toBe(
			JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: i18n.t("metadata.shortTitle"),
				description: i18n.t("metadata.description").replace(/&/g, "&amp;"),
			}),
		);
	}
});

test("should serve an open-graph image", async ({ page, request }) => {
	for (const locale of locales) {
		// TODO: support per-locale opengraph images
		// const imagePath = `/${locale}/opengraph-image.png`;
		const imagePath = "/opengraph-image.png";

		await page.goto(`/${locale}`);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			"content",
			expect.stringContaining(String(createUrl({ baseUrl, pathname: imagePath }))),
		);

		const response = await request.get(imagePath);
		const status = response.status();
		const contentType = response.headers()["content-type"];

		expect(status).toBe(200);
		expect(contentType).toBe("image/png");
	}
});
