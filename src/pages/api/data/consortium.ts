import mdxRenderer from "@astrojs/mdx/server.js";
import reactRenderer from "@astrojs/react/server.js";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface InstitutionItemData {
	name?: string | undefined;
	href?: string | undefined;
	logo?: string | undefined;
	description: string | null;
	institutions: Array<{
		name: string;
		href: string;
		logo: string;
	}>;
	people: Array<{
		name: string;
		image: string;
		description: string | null;
		links: Array<{
			kind:
				| "youtube"
				| "bluesky"
				| "facebook"
				| "instagram"
				| "linkedin"
				| "mastodon"
				| "orcid"
				| "podcast"
				| "twitter"
				| "website";
			href: string;
		}>;
	}>;
}

export type Institution = Record<Locale, InstitutionItemData | null>;

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();
	container.addServerRenderer({ renderer: mdxRenderer });
	container.addServerRenderer({ renderer: reactRenderer });
	const institutionsEN = await createCollectionResource("consortium", "en").all();
	const institutionsDE = await createCollectionResource("consortium", "de").all();

	const institutions: Array<Institution> = [];

	for (const clariahInstitution of institutionsEN) {
		const translatedInstitution = institutionsDE.find((institutionDE) => {
			return institutionDE.id === clariahInstitution.id;
		});
		let descriptionDE = undefined;
		let metadataDE: Partial<typeof clariahInstitution.data> | null = {};

		const { description: descriptionEN, ...metadataEN } = clariahInstitution.data;
		const { default: ContentEN } = await clariahInstitution.compile(descriptionEN);
		const descriptionCompiledEN = await container.renderToString(ContentEN);

		const institution: Institution = {
			en: { ...metadataEN, description: descriptionCompiledEN, people: [], institutions: [] },
			de: null,
		};

		if (translatedInstitution) {
			({ description: descriptionDE, ...metadataDE } = translatedInstitution.data);
			const ContentDE = descriptionDE
				? (await translatedInstitution.compile(descriptionDE)).default
				: null;
			const descriptionCompiledDE = ContentDE ? await container.renderToString(ContentDE) : null;
			institution.de = {
				...metadataDE,
				description: descriptionCompiledDE,
				people: [],
				institutions: [],
			};
		}

		for (const person of metadataEN.people) {
			const { default: DescriptionEN } = await clariahInstitution.compile(person.description);
			let DescriptionDE = undefined;
			if (translatedInstitution) {
				const personDE = translatedInstitution.data.people.find((p) => {
					return p.name === person.name;
				});
				DescriptionDE = personDE
					? (await translatedInstitution.compile(personDE.description)).default
					: null;
			}
			const { image, name, links } = person;
			const personDescriptionEN = await container.renderToString(DescriptionEN);
			const personDescriptionDE = DescriptionDE
				? await container.renderToString(DescriptionDE)
				: null;
			institution.en?.people.push({
				image,
				name,
				links: [...links],
				description: personDescriptionEN,
			});
			institution.de?.people.push({
				image,
				name,
				links: [...links],
				description: personDescriptionDE,
			});
		}

		for (const clariahInstitution of metadataEN.institutions) {
			const { name, href, logo } = clariahInstitution;

			institution.en?.institutions.push({
				name,
				href,
				logo,
			});
		}
		institutions.push(institution);
	}

	return new Response(JSON.stringify(institutions), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
