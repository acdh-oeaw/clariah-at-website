import { run } from "@mdx-js/mdx";
import {
	createFormatAwareProcessors,
	type FormatAwareProcessors,
} from "@mdx-js/mdx/internal-create-format-aware-processors";
import * as runtime from "astro/jsx-runtime";
import type { MDXModule } from "mdx/types";

import type { Locale } from "@/config/i18n.config";
import { createConfig as createMdxConfig } from "@/config/mdx.config";
import { useMDXComponents } from "@/lib/content/components";
import type { Toc } from "@/lib/content/table-of-contents";

const cache = new Map<Locale, FormatAwareProcessors>();

interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
	/** Added by `@/lib/content/table-of-contents.ts`. */
	tableOfContents?: Toc;
}

export async function processMdx<T extends Record<string, unknown>>(
	code: string,
	locale: Locale,
): Promise<MdxContent<T>> {
	const config = await createMdxConfig(locale);

	if (!cache.has(locale)) {
		cache.set(
			locale,
			createFormatAwareProcessors({
				...config,
				elementAttributeNameCase: "html",
				format: "mdx",
				outputFormat: "function-body",
				providerImportSource: "#",
			}),
		);
	}

	const processor = cache.get(locale)!;

	const file = await processor.process(code);

	// @ts-expect-error Upstream type issue.
	return run(file, { ...runtime, useMDXComponents });
}
