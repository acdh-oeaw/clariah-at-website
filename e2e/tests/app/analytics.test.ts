import { createUrl } from "@acdh-oeaw/lib";

import { defaultLocale } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

if (process.env.PUBLIC_MATOMO_BASE_URL && process.env.PUBLIC_MATOMO_ID) {
	test.describe("analytics service", () => {
		const baseUrl = String(
			createUrl({ baseUrl: process.env.PUBLIC_MATOMO_BASE_URL!, pathname: "/**" }),
		);

		test("should track page views", async ({ createIndexPage }) => {
			const { indexPage } = await createIndexPage(defaultLocale);
			const { page } = indexPage;
			const initialResponsePromise = page.waitForResponse(baseUrl);
			await indexPage.goto();
			const initialResponse = await initialResponsePromise;
			expect(initialResponse.status()).toBe(204);

			const responsePromise = page.waitForResponse(baseUrl);
			await page.getByRole("link", { name: "Imprint" }).click();
			const response = await responsePromise;
			expect(response.status()).toBe(204);
		});
	});
}
