import { createUrl } from "@acdh-oeaw/lib";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";

import { type Locale, locales } from "@/config/i18n.config";
import { createClient } from "@/lib/content/create-client";
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

	const client = await createClient(locale);
	const events = await client.getEvents();
	const news = await client.getNews();

	return rss({
		title: metadata.title,
		description: metadata.description,
		site: context.site!,
		/** @see https://docs.astro.build/en/guides/rss/#generating-items */
		items: [
			...events.map(({ data, id }) => {
				const item: RSSFeedItem = {
					link: String(
						createUrl({
							baseUrl: import.meta.env.SITE,
							pathname: `/${locale}/events/${id}`,
						}),
					),
					title: data.title,
					pubDate: new Date(data.date),
					description: data.summary,
				};

				return item;
			}),
			...news.map(({ data, id }) => {
				const item: RSSFeedItem = {
					link: String(
						createUrl({
							baseUrl: import.meta.env.SITE,
							pathname: `/${locale}/news/${id}`,
						}),
					),
					title: data.title,
					pubDate: new Date(data.date),
					description: data.summary,
				};

				return item;
			}),
		],
		customData: `<language>${locale}</language>`,
	});
}
