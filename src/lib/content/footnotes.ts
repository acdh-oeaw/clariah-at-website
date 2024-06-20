import { assert } from "@acdh-oeaw/lib";
import type { Root } from "hast";
import type {
	MdxJsxAttribute,
	MdxJsxFlowElementHast,
	MdxJsxTextElementHast,
} from "mdast-util-mdx-jsx";
import { SKIP, visit } from "unist-util-visit";

export function withMdxFootnotes() {
	return function transformer(tree: Root) {
		let count = 1;

		const footnotes: Array<MdxJsxTextElementHast> = [];

		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (node.name !== "Footnote") return undefined;

			assert(parent);
			assert(index);

			const countAttribute: MdxJsxAttribute = {
				type: "mdxJsxAttribute",
				name: "count",
				value: String(count),
			};

			const reference: MdxJsxTextElementHast = {
				type: "mdxJsxTextElement",
				name: "FootnoteReference",
				attributes: [countAttribute],
				children: [],
			};

			const content: MdxJsxTextElementHast = {
				type: "mdxJsxTextElement",
				name: "FootnoteContent",
				attributes: [countAttribute],
				children: node.children,
			};

			parent.children.splice(index, 1, reference);
			footnotes.push(content);

			count++;

			return SKIP;
		});

		if (footnotes.length > 0) {
			const section: MdxJsxFlowElementHast = {
				type: "mdxJsxFlowElement",
				name: "FootnotesSection",
				attributes: [],
				children: footnotes,
			};

			tree.children.push(section);
		}
	};
}
