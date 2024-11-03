import { createMdxProcessors, run, type TableOfContents } from "@acdh-oeaw/mdx-lib";
import * as runtime from "astro/jsx-runtime";
import type { MDXModule } from "mdx/types";

import type { Locale } from "@/config/i18n.config";
import { createMdxConfig } from "@/config/mdx.config";
import { useMDXComponents } from "@/lib/keystatic/mdx-components";

const createMdxProcessor = createMdxProcessors(createMdxConfig);

interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
	/** Added by `@acdh-oeaw/mdx-lib#with-table-of-contents`. */
	tableOfContents: TableOfContents;
}

export async function compileMdx<T extends Record<string, unknown>>(
	content: string,
	locale: Locale,
	baseUrl: URL,
): Promise<MdxContent<T>> {
	const processor = await createMdxProcessor(locale);
	const vfile = await processor.process({ path: baseUrl, value: content });
	return run(vfile, {
		...runtime,
		baseUrl,
		// @ts-expect-error JSX types are not compatible.
		useMDXComponents,
	}) as Promise<MdxContent<T>>;
}
