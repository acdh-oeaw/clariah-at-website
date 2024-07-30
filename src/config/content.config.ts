import slugify from "@sindresorhus/slugify";

import { env } from "@/config/env.config";

export function createAssetPaths(segment: `/${string}/`) {
	return {
		directory: `./public/assets${segment}`,
		publicPath: `/assets${segment}`,
		transformFilename(originalFilename: string) {
			return slugify(originalFilename);
		},
	};
}

export function createPreviewUrl(previewUrl: string) {
	if (env.PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
