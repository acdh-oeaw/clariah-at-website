import { valueToEstree } from "estree-util-value-to-estree";
import type { Root } from "hast";
import { headingRank as rank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

interface Heading {
	value: string;
	depth: number;
	id?: string;
}

interface TocEntry extends Heading {
	children?: Array<TocEntry>;
}

export type Toc = Array<TocEntry>;

declare module "vfile" {
	interface DataMap {
		toc: Toc;
	}
}

export const withTableOfContents = function withTableOfContents() {
	return function transformer(tree: Root, vfile: VFile) {
		const headings: Array<Heading> = [];

		visit(tree, "element", (element) => {
			const level = rank(element);

			if (level != null) {
				const heading: Heading = {
					depth: level,
					value: toString(element),
				};

				if (element.properties.id != null) {
					heading.id = element.properties.id as string;
				}

				headings.push(heading);
			}
		});

		vfile.data.toc = createTree(headings);

		function createTree(headings: Array<Heading>) {
			const root: TocEntry = { depth: 0, children: [], value: "" };
			const parents: Array<TocEntry> = [];
			let previous: TocEntry = root;

			headings.forEach((heading) => {
				if (heading.depth > previous.depth) {
					previous.children ??= [];
					parents.push(previous);
				} else if (heading.depth < previous.depth) {
					while (parents[parents.length - 1]!.depth >= heading.depth) {
						parents.pop();
					}
				}

				parents[parents.length - 1]!.children!.push(heading);
				previous = heading;
			});

			return root.children;
		}
	};
};

export const withMdxTableOfContents = function withMdxTableOfContents() {
	const name = "tableOfContents";

	return function transformer(tree: Root, vfile: VFile) {
		if (vfile.data.toc == null) return;

		tree.children.unshift({
			type: "mdxjsEsm",
			value: `export const tableOfContents = ${JSON.stringify(vfile.data.toc)};`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExportNamedDeclaration",
							source: null,
							specifiers: [],
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name },
										init: valueToEstree(vfile.data.toc),
									},
								],
							},
						},
					],
				},
			},
		});

		visit(tree, "mdxJsxFlowElement", (element) => {
			if (element.name !== "TableOfContents") return;

			element.attributes.push({
				type: "mdxJsxAttribute",
				name: "tableOfContents",
				value: {
					type: "mdxJsxAttributeValueExpression",
					value: "tableOfContents",
					data: {
						estree: {
							type: "Program",
							sourceType: "module",
							body: [
								{
									type: "ExpressionStatement",
									expression: {
										type: "Identifier",
										name,
									},
								},
							],
						},
					},
				},
			});
		});
	};
};
