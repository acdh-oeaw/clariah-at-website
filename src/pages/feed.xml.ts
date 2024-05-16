import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { defaultLocale } from "@/config/i18n.config";
import { createI18n } from "@/lib/i18n";

export async function GET(context: APIContext) {
	const locale = defaultLocale;

	const { t } = await createI18n(locale);

	const metadata = t("metadata");

	return rss({
		title: metadata.title,
		description: metadata.description,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		site: context.site!,
		/** @see https://docs.astro.build/en/guides/rss/#generating-items */
		items: [],
		customData: `<language>${locale}</language>`,
	});
}
