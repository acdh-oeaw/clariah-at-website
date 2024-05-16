import sharedConfig from "@acdh-oeaw/prettier-config";

/** @type {import('prettier').Config} */
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
