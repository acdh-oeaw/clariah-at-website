import { createUrl } from "@acdh-oeaw/lib";

import { locales } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.PUBLIC_APP_BASE_URL!;

test.describe("app", () => {
	if (process.env.PUBLIC_BOTS !== "enabled") {
		test("should serve a robots.txt which disallows search engine bots", async ({ request }) => {
			const response = await request.get("/robots.txt");
			const body = await response.body();

			// TODO: use toMatchSnapshot
			expect(body.toString()).toEqual(
				["User-Agent: *", "Disallow: /", "", `Host: ${baseUrl}`].join("\n"),
			);
		});
	} else {
		test("should serve a robots.txt", async ({ request }) => {
			const response = await request.get("/robots.txt");
			const body = await response.body();

			// TODO: use toMatchSnapshot
			expect(body.toString()).toEqual(
				[
					"User-Agent: *",
					"Allow: /",
					"",
					`Host: ${baseUrl}`,
					`Sitemap: ${String(createUrl({ baseUrl, pathname: "sitemap-index.xml" }))}`,
				].join("\n"),
			);
		});
	}

	test("should serve a sitemap.xml", async ({ request }) => {
		const sitemapIndexResponse = await request.get("/sitemap-index.xml");
		const sitemapIndex = await sitemapIndexResponse.body();

		// TODO: use toMatchSnapshot
		expect(sitemapIndex.toString()).toContain(
			[
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				"<sitemap>",
				`<loc>${String(createUrl({ baseUrl, pathname: "/sitemap-0.xml" }))}</loc>`,
				"</sitemap>",
				"</sitemapindex>",
			].join(""),
		);

		const sitemapResponse = await request.get("/sitemap-0.xml");
		const sitemap = await sitemapResponse.body();

		for (const locale of locales) {
			for (const url of ["/", "/imprint/"]) {
				const loc = String(
					createUrl({
						baseUrl,
						pathname: ["/", locale, url].join(""),
					}),
				);

				expect(sitemap.toString()).toContain(`<loc>${loc}</loc>`);
			}
		}
	});

	test("should serve a webmanifest", async ({ request }) => {
		const response = await request.get("/manifest.webmanifest");
		const body = await response.body();

		// TODO: use toMatchSnapshot
		expect(body.toString()).toEqual(
			JSON.stringify({
				name: "CLARIAH-AT",
				short_name: "CLARIAH-AT",
				description:
					"An open network facilitating the application of digital methods in the Humanities & the development of relevant research infrastructures.",
				icons: [
					{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
					{ src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
					{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
				],
				theme_color: "#28d8d8",
				background_color: "#28d8d8",
				display: "standalone",
				start_url: "/",
			}),
		);
	});

	test("should serve a favicon.ico", async ({ request }) => {
		const response = await request.get("/favicon.ico");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("should serve an svg favicon", async ({ request }) => {
		const response = await request.get("/icon.svg");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("should serve an apple favicon", async ({ request }) => {
		const response = await request.get("/apple-icon.png");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("should skip to main content with skip-link", async ({ createIndexPage }) => {
		const locale = "en";

		const { indexPage } = await createIndexPage(locale);
		await indexPage.goto();

		await indexPage.page.keyboard.press("Tab");
		await expect(indexPage.skipLink).toBeFocused();

		await indexPage.skipLink.click();
		await expect(indexPage.mainContent).toBeFocused();
	});
});
