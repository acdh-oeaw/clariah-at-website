import { createUrl } from "@acdh-oeaw/lib";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";

import { type Locale, locales } from "@/config/i18n.config";
import { getCollectionName } from "@/lib/content/get-collection-name";
import { reader } from "@/lib/content/reader";
import { createI18n } from "@/lib/i18n";

export function getStaticPaths() {
	return locales.map((locale) => {
		return { params: { locale } };
	});
}

export async function GET(context: APIContext) {
	const locale = context.params.locale as Locale;

	const { t } = await createI18n(locale);

	const metadata = t("metadata");

	const events = await reader().collections[getCollectionName("events", locale)].all();
	const news = await reader().collections[getCollectionName("news", locale)].all();

	return rss({
		title: metadata.title,
		description: metadata.description,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		site: context.site!,
		/** @see https://docs.astro.build/en/guides/rss/#generating-items */
		items: [
			...events.map(({ entry, slug }) => {
				const item: RSSFeedItem = {
					link: String(
						createUrl({
							baseUrl: import.meta.env.SITE,
							pathname: `/${locale}/events/${slug}`,
						}),
					),
					title: entry.title,
					pubDate: new Date(entry.date),
					description: entry.summary,
				};

				return item;
			}),
			...news.map(({ entry, slug }) => {
				const item: RSSFeedItem = {
					link: String(
						createUrl({
							baseUrl: import.meta.env.SITE,
							pathname: `/${locale}/news/${slug}`,
						}),
					),
					title: entry.title,
					pubDate: new Date(entry.date),
					description: entry.summary,
				};

				return item;
			}),
		],
		customData: `<language>${locale}</language>`,
	});
}
