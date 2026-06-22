import mdxRenderer from "@astrojs/mdx/server.js";
import reactRenderer from "@astrojs/react/server.js";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface EventItemData {
	title?: string | undefined;
	shortTitle?: string | undefined;
	createdAt?: string | undefined;
	eventDate?: string | null;
	location?: string | undefined;
	summary?: string | undefined;
	image?: string | undefined;
	description: string | null;
}

export type Event = Record<Locale, EventItemData | null>;

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();
	container.addServerRenderer({ renderer: mdxRenderer });
	container.addServerRenderer({ renderer: reactRenderer });
	const eventsEN = await createCollectionResource("events", "en").all();
	const eventsDE = await createCollectionResource("events", "de").all();

	const events: Array<Event> = [];

	for (const clariahEvent of eventsEN) {
		const translatedEvent = eventsDE.find((eventDE) => {
			return eventDE.id === clariahEvent.id;
		});
		let descriptionDE = undefined;
		let metadataDE: Partial<typeof clariahEvent.data> | null = {};

		const { content: descriptionEN, ...metadataEN } = clariahEvent.data;
		const { default: ContentEN } = await clariahEvent.compile(descriptionEN);
		const descriptionCompiledEN = await container.renderToString(ContentEN);

		const event: Event = {
			en: { ...metadataEN, description: descriptionCompiledEN },
			de: null,
		};

		if (translatedEvent) {
			({ content: descriptionDE, ...metadataDE } = translatedEvent.data);
			const ContentDE = descriptionDE
				? (await translatedEvent.compile(descriptionDE)).default
				: null;
			const descriptionCompiledDE = ContentDE ? await container.renderToString(ContentDE) : null;
			event.de = { ...metadataDE, description: descriptionCompiledDE };
		}

		events.push(event);
	}

	return new Response(JSON.stringify(events), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
