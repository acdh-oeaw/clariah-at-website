import {
	type MdxProcessorOptions,
	typographyConfig,
	withCustomHeadingIds,
	withFootnotes,
	withIframeTitles,
	// withImageSizes,
	withTableOfContents,
} from "@acdh-oeaw/mdx-lib";
import withSyntaxHighlighter from "@shikijs/rehype";
import type { ElementContent } from "hast";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withTypographicQuotes from "remark-smartypants";

import type { Locale } from "@/config/i18n.config";
import { config as syntaxHighlighterConfig } from "@/config/syntax-highlighter.config";
import { createI18n } from "@/lib/i18n";

export async function createMdxConfig(locale: Locale): Promise<MdxProcessorOptions> {
	const { t } = await createI18n(locale);

	const config: MdxProcessorOptions = {
		elementAttributeNameCase: "html",
		jsxImportSource: "astro",
		remarkPlugins: [
			withFrontmatter,
			withMdxFrontmatter,
			withGfm,
			withFootnotes,
			[withTypographicQuotes, typographyConfig[locale]],
		],
		remarkRehypeOptions: {
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L81 */
			footnoteBackContent(_, rereferenceIndex) {
				const result: Array<ElementContent> = [{ type: "text", value: "↩" }];

				if (rereferenceIndex > 1) {
					result.push({
						type: "element",
						tagName: "sup",
						properties: {},
						children: [{ type: "text", value: String(rereferenceIndex) }],
					});
				}

				return result;
			},
			/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L108 */
			footnoteBackLabel(referenceIndex, rereferenceIndex) {
				return t("mdx.footnote-back-label", {
					reference:
						String(referenceIndex + 1) +
						(rereferenceIndex > 1 ? `-${String(rereferenceIndex)}` : ""),
				});
			},
			footnoteLabel: t("mdx.footnotes"),
			footnoteLabelProperties: { className: ["sr-only"] },
			footnoteLabelTagName: "h2",
		},
		rehypePlugins: [
			withCustomHeadingIds,
			withHeadingIds,
			[withIframeTitles, { components: ["Embed", "Video"] }],
			// [withImageSizes, { components: ["Figure"] }],
			[withSyntaxHighlighter, syntaxHighlighterConfig],
			withTableOfContents,
		],
	};

	return Promise.resolve(config);
}
