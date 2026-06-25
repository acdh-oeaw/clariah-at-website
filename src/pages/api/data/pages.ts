import mdxRenderer from "@astrojs/mdx/server.js";
import reactRenderer from "@astrojs/react/server.js";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface PageItemData {
	title?: string | undefined;
	summary?: string | undefined;
	image?: string | null;
	content: string | null;
}

export type Page = Record<Locale, PageItemData | null>;

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();
	container.addServerRenderer({ renderer: mdxRenderer });
	container.addServerRenderer({ renderer: reactRenderer });
	const pagesEN = await createCollectionResource("pages", "en").all();
	const pagesDE = await createCollectionResource("pages", "de").all();

	const pages: Array<Page> = [];

	for (const clariahPage of pagesEN) {
		const translatedPage = pagesDE.find((pageDE) => {
			return pageDE.id === clariahPage.id;
		});
		let contentDE = undefined;
		let metadataDE: Partial<typeof clariahPage.data> | null = {};

		const { content: contentEN, ...metadataEN } = clariahPage.data;
		const { default: ContentEN } = await clariahPage.compile(contentEN);
		const contentCompiledEN = await container.renderToString(ContentEN);
		const page: Page = {
			en: { ...metadataEN, content: contentCompiledEN },
			de: null,
		};

		if (translatedPage) {
			({ content: contentDE, ...metadataDE } = translatedPage.data);
			const ContentDE = contentDE ? (await translatedPage.compile(contentDE)).default : null;
			const contentCompiledDE = ContentDE ? await container.renderToString(ContentDE) : null;
			page.de = { ...metadataDE, content: contentCompiledDE };
		}

		pages.push(page);
	}

	return new Response(JSON.stringify(pages), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
