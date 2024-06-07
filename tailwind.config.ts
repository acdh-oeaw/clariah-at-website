import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";

const preset = createPreset();

const config: Config = {
	content: [
		"./keystatic.config.tsx",
		"./content/**/*.@(md|mdx)",
		"./src/@(components|layouts|pages)/**/*.@(astro|css|ts|tsx)",
		"./src/styles/**/*.css",
	],
	presets: [preset],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "var(--color-brand)",
					intent: "var(--color-brand-intent)",
				},
			},
			fontSize: {
				"2.5xl": "1.625rem",
			},
			screens: {
				lg: "70rem",
			},
		},
	},
};

export default config;
