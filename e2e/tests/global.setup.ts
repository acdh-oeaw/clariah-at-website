import { createUrl } from "@acdh-oeaw/lib";
import { test as setup } from "@playwright/test";

if (process.env.PUBLIC_MATOMO_BASE_URL != null) {
	const baseUrl = String(
		createUrl({ baseUrl: process.env.PUBLIC_MATOMO_BASE_URL, pathname: "/**" }),
	);

	setup.beforeEach("should block requests to analytics service", async ({ context }) => {
		await context.route(baseUrl, (route) => {
			return route.fulfill({ status: 204, body: "" });
		});
	});
}
