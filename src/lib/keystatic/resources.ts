import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";

import { compileMdx } from "@/lib/keystatic/compile-mdx";
import config from "~/keystatic.config";

export const { createCollectionResource, createSingletonResource } = createReaders(
	config,
	compileMdx,
);
