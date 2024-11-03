/* @jsxImportSource react */

import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import {
	createConsortium,
	createEvents,
	createNews,
	createPages,
	createProjects,
} from "@/lib/keystatic/collections";
import { Logo } from "@/lib/keystatic/logo";
import { createIndexPage, createMetadata, createNavigation } from "@/lib/keystatic/singletons";

export default config({
	collections: {
		[withI18nPrefix("consortium", "de")]: createConsortium("de"),
		[withI18nPrefix("consortium", "en")]: createConsortium("en"),

		[withI18nPrefix("events", "de")]: createEvents("de"),
		[withI18nPrefix("events", "en")]: createEvents("en"),

		[withI18nPrefix("news", "de")]: createNews("de"),
		[withI18nPrefix("news", "en")]: createNews("en"),

		[withI18nPrefix("pages", "de")]: createPages("de"),
		[withI18nPrefix("pages", "en")]: createPages("en"),

		[withI18nPrefix("projects", "de")]: createProjects("de"),
		[withI18nPrefix("projects", "en")]: createProjects("en"),
	},
	singletons: {
		[withI18nPrefix("index-page", "de")]: createIndexPage("de"),
		[withI18nPrefix("index-page", "en")]: createIndexPage("en"),

		[withI18nPrefix("metadata", "de")]: createMetadata("de"),
		[withI18nPrefix("metadata", "en")]: createMetadata("en"),

		[withI18nPrefix("navigation", "de")]: createNavigation("de"),
		[withI18nPrefix("navigation", "en")]: createNavigation("en"),
	},
	storage:
		env.PUBLIC_KEYSTATIC_MODE === "github" &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "CLARIAH",
		},
		navigation: {
			HomePage: locales.map((locale) => {
				return withI18nPrefix("index-page", locale);
			}),
			Pages: locales.map((locale) => {
				return withI18nPrefix("pages", locale);
			}),
			Events: locales.map((locale) => {
				return withI18nPrefix("events", locale);
			}),
			News: locales.map((locale) => {
				return withI18nPrefix("news", locale);
			}),
			Projects: locales.map((locale) => {
				return withI18nPrefix("projects", locale);
			}),
			Consortium: locales.map((locale) => {
				return withI18nPrefix("consortium", locale);
			}),
			Navigation: locales.map((locale) => {
				return withI18nPrefix("navigation", locale);
			}),
			Metadata: locales.map((locale) => {
				return withI18nPrefix("metadata", locale);
			}),
		},
	},
});
