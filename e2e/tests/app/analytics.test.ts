import { createUrl } from "@acdh-oeaw/lib";

import { expect, test } from "~/e2e/lib/test";

if (process.env.PUBLIC_MATOMO_BASE_URL && process.env.PUBLIC_MATOMO_ID) {
	test.describe("analytics service", () => {
		const baseUrl = String(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			createUrl({ baseUrl: process.env.PUBLIC_MATOMO_BASE_URL!, pathname: "/**" }),
		);

		test("should track page views", async ({ page }) => {
			const initialResponsePromise = page.waitForResponse(baseUrl);
			await page.goto("/en/");
			const initialResponse = await initialResponsePromise;
			expect(initialResponse.status()).toBe(204);

			const responsePromise = page.waitForResponse(baseUrl);
			await page.getByRole("link", { name: "Imprint" }).click();
			const response = await responsePromise;
			expect(response.status()).toBe(204);
		});
	});
}
