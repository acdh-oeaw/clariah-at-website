/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { MDXComponents } from "mdx/types";

import Avatar from "@/components/content/avatar.astro";
import Callout from "@/components/content/callout.astro";
import DownloadButton from "@/components/content/download-button.astro";
import DownloadLink from "@/components/content/download-link.astro";
import Figure from "@/components/content/figure.astro";
import Grid from "@/components/content/grid.astro";
import GridItem from "@/components/content/grid-item.astro";
import ImageLink from "@/components/content/image-link.astro";
import Img from "@/components/content/img.astro";
import InternalLink from "@/components/content/internal-link.astro";
import LinkButton from "@/components/content/link-button.astro";
import Tweet from "@/components/content/tweet.astro";
import Video from "@/components/content/video.astro";
import Link from "@/components/link.astro";

export function useMDXComponents(): MDXComponents {
	return {
		// @ts-expect-error It's fine.
		a: Link,
		Avatar,
		Callout,
		DownloadLink,
		DownloadButton,
		Figure,
		Grid,
		GridItem,
		// @ts-expect-error It's fine.
		img: Img,
		ImageLink,
		InternalLink,
		LinkButton,
		Tweet,
		Video,
	};
}
