// import { createHash } from "node:crypto";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { APIContext } from "astro";

import { defaultLocale, type Locale, locales } from "@/config/i18n.config";
import { createOpenGraphImage } from "@/lib/create-opengraph-image";
import { createCollectionResource } from "@/lib/keystatic/resources";

export const prerender = true;

export async function getStaticPaths() {
	return (
		await Promise.all(
			locales.map(async (locale) => {
				const pages = await createCollectionResource("events", locale).all();

				return pages.map((page) => {
					return { params: { id: page.id, locale }, props: { page } };
				});
			}),
		)
	).flat();
}

export async function GET(context: APIContext): Promise<Response> {
	const page = context.props.page as { data: { title: string; image?: string } };

	const locale = (context.params.locale as Locale | undefined) ?? defaultLocale;
	const { title, image } = page.data;

	if (!isNonEmptyString(title)) {
		return new Response("Missing title.", { status: 400 });
	}

	const { png } = await createOpenGraphImage({
		locale,
		title,
		image,
	});

	// const hash = createHash("md5").update(png).digest("hex");

	return new Response(png, {
		headers: {
			"content-type": "image/png",
			"content-length": String(png.length),
			// "cache-control": "public, max-age=31536000, immutable",
		},
	});
}
