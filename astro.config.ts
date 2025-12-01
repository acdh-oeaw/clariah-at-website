import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import type { Writable } from "type-fest";
import { loadEnv } from "vite";

import { defaultLocale, locales } from "./src/config/i18n.config";
// import { createMdxConfig } from "./src/config/mdx.config";
import { redirects } from "./src/config/redirects.config";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

export default defineConfig({
	/**
	 * When switching to static site generation, place an empty `index.astro` file in
	 * the `src/pages` folder, so `astro` will generate a redirect to the default locale
	 * via `<meta http-equiv="refresh" content="0;url=/en/">`.
	 */
	adapter: node({
		mode: "standalone",
	}),
	base: env.PUBLIC_APP_BASE_PATH,
	i18n: {
		defaultLocale,
		locales: locales as Writable<typeof locales>,
		routing: "manual",
	},
	integrations: [
		icon({
			/** @see https://www.astroicon.dev/reference/configuration/#include */
			include: {
				lucide: [
					"chevron-down",
					"globe",
					"mail",
					"menu",
					"message-circle",
					"podcast",
					"search",
					"twitter",
					"x",
				],
				simpleIcons: [
					"bluesky",
					"facebook",
					"instagram",
					"linkedin",
					"mastodon",
					"orcid",
					"podcast",
					"x",
					"website",
					"youtube",
				],
			},
		}),
		/** Only needed to make the astro jsx runtime work correctly. */
		mdx(),
		react({
			include: ["**/content/**", "**/keystatic/**"],
		}),
		sitemap({
			i18n: {
				defaultLocale,
				locales: Object.fromEntries(
					locales.map((locale) => {
						return [locale, locale];
					}),
				),
			},
		}),
	],
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	redirects: {
		"/admin": {
			destination: env.PUBLIC_APP_BASE_PATH
				? `${env.PUBLIC_APP_BASE_PATH.replace(/\/$/, "")}/keystatic`
				: "/keystatic",
			status: 307,
		},
		...redirects,
	},
	scopedStyleStrategy: "where",
	server: {
		/** Required by keystatic. */
		host: "127.0.0.1",
		port: 3000,
	},
	site: env.PUBLIC_APP_BASE_URL,
	vite: {
		ssr: {
			noExternal: ["react-tweet"],
		},
	},
});
