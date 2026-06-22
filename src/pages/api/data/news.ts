import mdxRenderer from "@astrojs/mdx/server.js";
import reactRenderer from "@astrojs/react/server.js";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

export const prerender = false;

interface NewsItemData {
	title?: string | undefined;
	shortTitle?: string | undefined;
	createdAt?: string | undefined;
	summary?: string | undefined;
	image?: string | undefined;
	description: string | null;
}

export type NewsItem = Record<Locale, NewsItemData | null>;

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();
	container.addServerRenderer({ renderer: mdxRenderer });
	container.addServerRenderer({ renderer: reactRenderer });
	const newsEN = await createCollectionResource("news", "en").all();
	const newsDE = await createCollectionResource("news", "de").all();

	const news: Array<NewsItem> = [];

	for (const clariahNewsItem of newsEN) {
		const translatedNewsItem = newsDE.find((newsItemDE) => {
			return newsItemDE.id === clariahNewsItem.id;
		});
		let descriptionDE = undefined;
		let metadataDE: Partial<typeof clariahNewsItem.data> | undefined;

		const { content: descriptionEN, ...metadataEN } = clariahNewsItem.data;
		const { default: ContentEN } = await clariahNewsItem.compile(descriptionEN);
		const descriptionCompiledEN = await container.renderToString(ContentEN);

		const newsItem: NewsItem = {
			en: { ...metadataEN, description: descriptionCompiledEN },
			de: null,
		};

		if (translatedNewsItem) {
			({ content: descriptionDE, ...metadataDE } = translatedNewsItem.data);
			const ContentDE = descriptionDE
				? (await translatedNewsItem.compile(descriptionDE)).default
				: null;
			const descriptionCompiledDE = ContentDE ? await container.renderToString(ContentDE) : null;
			newsItem.de = { ...metadataDE, description: descriptionCompiledDE };
		}

		news.push(newsItem);
	}

	return new Response(JSON.stringify(news), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
