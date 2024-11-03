/** @typedef {import("typescript-eslint").Config} Config */

import baseConfig from "@acdh-oeaw/eslint-config";
import astroConfig from "@acdh-oeaw/eslint-config-astro";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import gitignore from "eslint-config-flat-gitignore";
// @ts-expect-error Missing type declaration.
import checkFilePlugin from "eslint-plugin-check-file";
import nodePlugin from "eslint-plugin-n";

const KEBAB_CASE = "+([a-z])*([a-z0-9])*(-+([a-z0-9]))";
const CAMEL_CASE = "+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))";
const DYNAMIC_SEGMENTS = `\\[${CAMEL_CASE}\\]`;
const CATCH_ALL_SEGMENTS = `\\[...${CAMEL_CASE}\\]`;
const MIDDLE_EXTENSION = "*(.+([a-z0-9]))";

const reactFiles = [
	"keystatic.config.@(ts|tsx)",
	"**/content/**/*.@(ts|tsx)",
	"**/keystatic/**/*.@(ts|tsx)",
];

/** @type {Config} */
const config = [
	gitignore({ strict: false }),
	...baseConfig,
	...astroConfig,
	...reactConfig.map((config) => {
		return {
			...config,
			files: reactFiles,
		};
	}),
	...tailwindcssConfig,
	...playwrightConfig,
	{
		plugins: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": `@(${KEBAB_CASE}${MIDDLE_EXTENSION}|${DYNAMIC_SEGMENTS}|${CATCH_ALL_SEGMENTS}|404|500)`,
				},
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": `@(${KEBAB_CASE}|${DYNAMIC_SEGMENTS}|${CATCH_ALL_SEGMENTS})`,
				},
			],
		},
	},
	{
		rules: {
			"arrow-body-style": ["error", "always"],
			// "@typescript-eslint/explicit-module-boundary-types": "error",
			// "@typescript-eslint/require-array-sort-compare": "error",
			// "@typescript-eslint/strict-boolean-expressions": "error",
		},
	},
	{
		plugins: {
			n: nodePlugin,
		},
		rules: {
			"n/prefer-node-protocol": "error",
		},
	},
	{
		files: ["!e2e/**"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
					message: "Please use `@/config/env.config` instead.",
				},
			],
		},
	},
	{
		files: reactFiles,
		rules: {
			"react/jsx-sort-props": ["error", { reservedFirst: true }],
		},
	},
	{
		files: ["**/*.astro"],
		rules: {
			"astro/sort-attributes": "error",
		},
	},
];

export default config;
