/** @typedef {import('prettier').Config} Config */

import sharedConfig from "@acdh-oeaw/prettier-config";

/** @type {Config} */
const config = {
	...sharedConfig,
	plugins: ["prettier-plugin-astro"],
	overrides: [
		...(sharedConfig.overrides ?? []),
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};

export default config;
