/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Avatar from "@/components/content/avatar.astro";
import DownloadButton from "@/components/content/download-button.astro";
import Figure from "@/components/content/figure.astro";
import Grid from "@/components/content/grid.astro";
import GridItem from "@/components/content/grid-item.astro";
import ImageGrid from "@/components/content/image-grid.astro";
import ImageLink from "@/components/content/image-link.astro";
import Img from "@/components/content/img.astro";
import Link from "@/components/content/link.astro";
import LinkButton from "@/components/content/link-button.astro";
import Tweet from "@/components/content/tweet.astro";
import Video from "@/components/content/video.astro";
import Anchor from "@/components/link.astro";

const components = {
	a: Anchor,
	Avatar,
	DownloadButton,
	Figure,
	Grid,
	GridItem,
	img: Img,
	ImageGrid,
	ImageLink,
	Link,
	LinkButton,
	Tweet,
	Video,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
