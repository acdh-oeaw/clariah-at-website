import type * as runtime from "astro/jsx-runtime";

import type { Locale } from "@/config/i18n.config";

declare module "@acdh-oeaw/mdx-lib" {
	export interface MdxConfig {
		locales: Locale;
	}
}

declare module "mdx/types" {
	namespace JSX {
		type Element = runtime.JSX.Element;
		type ElementClass = runtime.JSX.ElementClass;
		type IntrinsicElements = runtime.JSX.IntrinsicElements;
	}
}
