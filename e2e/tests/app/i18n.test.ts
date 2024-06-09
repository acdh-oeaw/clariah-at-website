import { createUrl } from "@acdh-oeaw/lib";

import { defaultLocale, locales } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.PUBLIC_APP_BASE_URL!;

test.describe("i18n", () => {
	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "en" });

		test("with default locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en/");
		});
	});

	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "de" });

		/** FIXME: Astro currently does not provide `preferredLocale` in hybrid output mode. */
		test.fixme("with supported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/de/");
		});
	});

	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "fr" });

		test("with unsupported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en/");
		});
	});

	test("should display not-found page for unknown locale", async ({ createI18n, page }) => {
		const i18n = await createI18n(defaultLocale);
		const response = await page.goto("/unknown/");
		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: i18n.t("NotFoundPage.title") })).toBeVisible();
	});

	test("should display localised not-found page for unknown pathname", async ({
		createI18n,
		page,
	}) => {
		const i18n = await createI18n("de");
		const response = await page.goto("/de/unknown/");
		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: i18n.t("NotFoundPage.title") })).toBeVisible();
	});

	test("should support switching locale", async ({ createImprintPage, createI18n, page }) => {
		// @ts-expect-error Single locale could be configured.
		// eslint-disable-next-line playwright/no-skipped-test, @typescript-eslint/no-unnecessary-condition
		test.skip(locales.length === 1, "Only single locale configured.");

		const { imprintPage, i18n: i18nDe } = await createImprintPage("de");
		await imprintPage.goto();

		await expect(page).toHaveURL("/de/imprint/");
		await expect(page.getByRole("heading", { name: i18nDe.t("ImprintPage.title") })).toBeVisible();
		await expect(page).toHaveTitle(
			[i18nDe.t("ImprintPage.meta.title"), i18nDe.t("metadata.title")].join(" | "),
		);

		await page
			.getByRole("link", {
				name: i18nDe.t("LocaleSwitcher.switch-locale-to", { locale: "Englisch" }),
			})
			.click();

		const i18nEn = await createI18n("en");

		await expect(page).toHaveURL("/en/imprint/");
		await expect(page.getByRole("heading", { name: i18nEn.t("ImprintPage.title") })).toBeVisible();
		await expect(page).toHaveTitle(
			[i18nEn.t("ImprintPage.meta.title"), i18nEn.t("metadata.title")].join(" | "),
		);
	});

	test("should set `lang` attribute on `html` element", async ({ page }) => {
		for (const locale of locales) {
			await page.goto(`/${locale}/`);
			await expect(page.locator("html")).toHaveAttribute("lang", locale);
		}
	});

	test("should set alternate links in link tags", async ({ page }) => {
		function createAbsoluteUrl(pathname: string) {
			return String(createUrl({ baseUrl, pathname }));
		}

		const pathnames = ["/", "/imprint/"];

		for (const pathname of pathnames) {
			for (const locale of locales) {
				await page.goto(`/${locale}${pathname}`);

				const links = await page
					.locator('link[rel="alternate"][hreflang]')
					.evaluateAll((elements) => {
						return elements.map((element) => element.outerHTML);
					});

				expect(links).toEqual(
					expect.arrayContaining([
						`<link rel="alternate" href="${createAbsoluteUrl(`/de${pathname}`)}" hreflang="de">`,
						`<link rel="alternate" href="${createAbsoluteUrl(`/en${pathname}`)}" hreflang="en">`,
						`<link rel="alternate" href="${createAbsoluteUrl(`/en${pathname}`)}" hreflang="x-default">`,
					]),
				);
			}
		}
	});
});
