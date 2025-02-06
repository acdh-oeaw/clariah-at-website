import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import satori from "satori";
import sharp from "sharp";

import type { Locale } from "@/config/i18n.config";

const width = 1200;
const height = 630;

interface CreateOpenGraphImageParams {
	image?: string | null;
	locale: Locale;
	title: string;
}

export async function createOpenGraphImage(params: CreateOpenGraphImageParams) {
	const { image, locale, title } = params;

	const interFont = await readFile(
		join(process.cwd(), "public", "assets", "fonts", "inter-semibold.ttf"),
	);

	const stream = createReadStream(join(process.cwd(), "public", image ?? "opengraph-image.png"));
	const src = await new Response(
		/**
		 * Sharp ensures that we don't pass huge images to satori, which inlines them as
		 * base64 data uri.
		 */
		// @ts-expect-error It's fine.
		stream.pipe(sharp().resize({ width: (width * 2) / 3, height })),
	).arrayBuffer();

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
									src,
								},
							},
							style: {
								alignItems: "center",
								display: "flex",
								flex: 2,
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

	const png = await sharp(Buffer.from(svg), {}).resize({ width, height }).png().toBuffer();

	return {
		png,
	};
}
