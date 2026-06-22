import mdxRenderer from "@astrojs/mdx/server.js";
import reactRenderer from "@astrojs/react/server.js";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface ProjectItemData {
	title?: string | undefined;
	shortTitle?: string | undefined;
	startDate?: string | null;
	endDate?: string | null;
	summary?: string | undefined;
	image?: string | null;
	description: string | null;
	additionalImages?: ReadonlyArray<
		| {
				image: string;
				alt: string | null;
				license: string | null;
		  }
		| undefined
	>;
	attachments?: ReadonlyArray<{ file: string; label: string }>;
	responsiblePersons?: ReadonlyArray<string>;
	hostingOrganizations?: ReadonlyArray<string>;
	links?: ReadonlyArray<{ label: string; url: string }>;
	tags?: ReadonlyArray<{ name: string; tid: number }>;
}

export type Project = Record<Locale, ProjectItemData | null>;

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();
	container.addServerRenderer({ renderer: mdxRenderer });
	container.addServerRenderer({ renderer: reactRenderer });
	const projectEN = await createCollectionResource("projects", "en").all();
	const projectDE = await createCollectionResource("projects", "de").all();

	const projects: Array<Project> = [];

	for (const clariahProject of projectEN) {
		const translatedProject = projectDE.find((projectDE) => {
			return projectDE.id === clariahProject.id;
		});
		let descriptionDE = undefined;
		let metadataDE: Partial<typeof clariahProject.data> | undefined;

		const { content: descriptionEN, ...metadataEN } = clariahProject.data;
		const { default: ContentEN } = await clariahProject.compile(descriptionEN);
		const descriptionCompiledEN = await container.renderToString(ContentEN);
		const project: Project = {
			en: { ...metadataEN, description: descriptionCompiledEN },
			de: null,
		};

		if (translatedProject) {
			({ content: descriptionDE, ...metadataDE } = translatedProject.data);
			const ContentDE = descriptionDE
				? (await translatedProject.compile(descriptionDE)).default
				: null;
			const descriptionCompiledDE = ContentDE ? await container.renderToString(ContentDE) : null;
			project.de = { ...metadataDE, description: descriptionCompiledDE };
		}
		projects.push(project);
	}

	return new Response(JSON.stringify(projects), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
