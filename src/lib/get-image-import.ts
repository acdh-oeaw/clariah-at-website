import { join } from "node:path";

import { assert } from "@acdh-oeaw/lib";
import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
	"/public/assets/**/*.@(avif|bmp|gif|jpeg|jpg|png|svg|webp)",
);

export function getImageImport(path: string) {
	/** Upstream type issue. */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
	if (!path.startsWith("/")) return path as any;

	const publicPath = join("/public", path);
	const image = images[publicPath];
	assert(image, `Missing image "${publicPath}".`);

	return image();
}
