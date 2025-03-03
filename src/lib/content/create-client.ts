import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";

import type { Locale } from "@/config/i18n.config";
import { compileMdx } from "@/lib/content/compile-mdx";
import config from "~/keystatic.config";

const { createCollectionResource, createSingletonResource } = createReaders(config, compileMdx);

// eslint-disable-next-line @typescript-eslint/require-await
export async function createClient(locale: Locale) {
	async function getConsortiumMembers() {
		const members = await createCollectionResource("consortium", locale).all();
		return members;
	}

	async function getConsortiumMember(id: string) {
		const member = await createCollectionResource("consortium", locale).read(id);
		return member;
	}

	async function getEvents() {
		const events = await createCollectionResource("events", locale).all();
		return events;
	}

	async function getEvent(id: string) {
		const event = await createCollectionResource("events", locale).read(id);
		return event;
	}

	async function getNews() {
		const news = await createCollectionResource("news", locale).all();
		return news;
	}

	async function getNewsItem(id: string) {
		const news = await createCollectionResource("news", locale).read(id);
		return news;
	}

	async function getProjects() {
		const projects = await createCollectionResource("projects", locale).all();
		return projects;
	}

	async function getProject(id: string) {
		const project = await createCollectionResource("projects", locale).read(id);
		return project;
	}

	async function getPages() {
		const pages = await createCollectionResource("pages", locale).all();
		return pages;
	}

	async function getPage(id: string) {
		const page = await createCollectionResource("pages", locale).read(id);
		return page;
	}

	async function getIndexPage() {
		const page = await createSingletonResource("index-page", locale).read();
		return page;
	}

	async function getMetadata() {
		const metadata = await createSingletonResource("metadata", locale).read();
		return metadata;
	}

	async function getNavigation() {
		const navigation = await createSingletonResource("navigation", locale).read();
		return navigation;
	}

	return {
		getConsortiumMembers,
		getConsortiumMember,
		getEvents,
		getEvent,
		getNews,
		getNewsItem,
		getProjects,
		getProject,
		getPages,
		getPage,
		getIndexPage,
		getMetadata,
		getNavigation,
	};
}
