/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { MDXComponents } from "mdx/types";

import Callout from "@/components/content/callout.astro";
import Download from "@/components/content/download.astro";
import DownloadButton from "@/components/content/download-button.astro";
import Figure from "@/components/content/figure.astro";
import Img from "@/components/content/img.astro";
import LinkButton from "@/components/content/link-button.astro";
import Video from "@/components/content/video.astro";

export function useMDXComponents(): MDXComponents {
	return {
		Callout,
		Download,
		DownloadButton,
		Figure,
		// @ts-expect-error It's fine.
		img: Img,
		LinkButton,
		Video,
	};
}
