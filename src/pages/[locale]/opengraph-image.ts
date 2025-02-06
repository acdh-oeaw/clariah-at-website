import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { APIContext } from "astro";
import satori from "satori";
import sharp from "sharp";

import { defaultLocale } from "@/config/i18n.config";
import { withBasePath } from "@/lib/with-base-path";

export const prerender = false;

const width = 1200;
const height = 630;

export async function GET(context: APIContext): Promise<Response> {
	const url = new URL(context.request.url);

	const locale = context.params.locale ?? defaultLocale;
	const title = url.searchParams.get("title");
	const image = url.searchParams.get("image");

	if (!isNonEmptyString(title)) {
		return new Response("Missing title.", { status: 400 });
	}

	const interFont = await readFile(
		join(process.cwd(), "public", "assets", "fonts", "inter-semibold.ttf"),
	);

	const svg = await satori(
		{
			type: "div",
			key: null,
			props: {
				lang: locale,
				style: {
					backgroundColor: "#e6e6e6",
					color: "#262626",
					display: "flex",
					fontSize: 32,
					fontWeight: 600,
					fontFamily: "Inter",
					height: "100%",
					width: "100%",
				},
				children: [
					{
						type: "div",
						props: {
							children: title,
							style: {
								alignItems: "center",
								backgroundColor: "#404878",
								color: "#e6e6e6",
								display: "flex",
								flex: 1,
								padding: 16,
							},
						},
					},
					{
						type: "div",
						props: {
							children: {
								type: "img",
								props: {
									src: String(new URL(withBasePath(image ?? "/opengraph-image.png"), context.site)),
								},
							},
							style: {
								alignItems: "center",
								display: "flex",
								flex: 1,
								justifyContent: "center",
								padding: 16,
							},
						},
					},
				],
			},
		},
		{
			width,
			height,
			fonts: [
				{
					name: "Inter",
					data: interFont,
					weight: 600,
					style: "normal",
				},
			],
		},
	);

	const png = await sharp(Buffer.from(svg), {}).resize(width, height).png().toBuffer();

	return new Response(png, {
		headers: {
			"content-type": "image/png",
			"content-length": String(png.length),
			// "cache-control": "public, max-age=31536000, immutable",
		},
	});
}
