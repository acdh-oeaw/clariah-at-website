/* @jsxImportSource react */

import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { cn, styles } from "@acdh-oeaw/style-variants";
import { NotEditable, type ParsedValueForComponentSchema } from "@keystatic/core";
import type { ReactNode } from "react";
import { Tweet as StaticTweet } from "react-tweet";

import type { AvatarVariant, GridLayout, VideoProvider } from "@/lib/keystatic/component-options";
import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";

type LinkSchema = ParsedValueForComponentSchema<ReturnType<typeof createLinkSchema>>;

interface AvatarPreviewProps {
	alt?: string;
	children?: ReactNode;
	maxSize?: number | null;
	src: UseObjectUrlParams | null;
	/** @default "circle" */
	variant?: AvatarVariant;
}

export function AvatarPreview(props: AvatarPreviewProps): ReactNode {
	const { alt = "", children, maxSize, src, variant = "circle" } = props;

	const url = useObjectUrl(src);

	if (url == null) return null;

	const variants = {
		circle: "rounded-full",
		square: "rounded-md",
	};

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
				<img
					alt={alt}
					className={cn("aspect-square w-full overflow-hidden", variants[variant])}
					src={url}
					style={{
						margin: 0,
						maxWidth: maxSize != null ? `${String(maxSize)}px` : undefined,
					}}
				/>
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}

interface DownloadButtonPreviewProps {
	children: ReactNode;
	href: UseObjectUrlParams | null;
}

export function DownloadButtonPreview(props: DownloadButtonPreviewProps): ReactNode {
	const { children, href: _href } = props;

	return (
		<NotEditable>
			<div className="my-2 inline-flex rounded-full bg-brand px-6 py-2 text-white no-underline transition hover:bg-brand-intent">
				{children}
			</div>
		</NotEditable>
	);
}

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: "center" | "stretch";
	alt?: string;
	children?: ReactNode;
	src: UseObjectUrlParams | null;
}

export function FigurePreview(props: FigurePreviewProps): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	const url = useObjectUrl(src);

	if (url == null) return null;

	return (
		<figure className={cn("grid gap-y-2", alignment === "center" ? "justify-center" : undefined)}>
			<NotEditable>
				<img alt={alt} className="overflow-hidden rounded-md" src={url} />
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}

interface GridPreviewProps {
	/** @default "stretch" */
	alignment?: "center" | "stretch";
	children: ReactNode;
	/** @default "two-columns" */
	layout: GridLayout;
}

export function GridPreview(props: GridPreviewProps): ReactNode {
	const { alignment, children, layout } = props;

	const gridStyles = styles({
		base: "grid content-start gap-x-8",
		variants: {
			alignment: {
				center: "items-center",
				stretch: "",
			},
			layout: {
				"two-columns": "sm:grid-cols-2",
				"three-columns": "sm:grid-cols-3",
				"four-columns": "sm:grid-cols-4",
				"one-two-columns": "sm:grid-cols-[1fr_2fr]",
				"one-three-columns": "sm:grid-cols-[1fr_3fr]",
				"one-four-columns": "sm:grid-cols-[1fr_4fr]",
			},
		},
		defaults: {
			alignment: "stretch",
			layout: "two-columns",
		},
	});

	return <div className={gridStyles({ alignment, layout })}>{children}</div>;
}

interface GridItemPreviewProps {
	/** @default "stretch" */
	alignment?: "center" | "stretch";
	children: ReactNode;
}

export function GridItemPreview(props: GridItemPreviewProps): ReactNode {
	const { alignment = "stretch", children } = props;

	return <div className={alignment === "center" ? "self-center" : undefined}>{children}</div>;
}

interface HeadingIdPreviewProps {
	children: ReactNode;
}

export function HeadingIdPreview(props: HeadingIdPreviewProps): ReactNode {
	const { children } = props;

	return (
		<NotEditable>
			<span className="opacity-50">#{children}</span>
		</NotEditable>
	);
}

interface ImageLinkPreviewProps {
	alt?: string;
	link: LinkSchema;
	src: UseObjectUrlParams | null;
	text: string;
}

export function ImageLinkPreview(props: ImageLinkPreviewProps): ReactNode {
	const { alt = "", link: _link, src, text: _text } = props;

	const url = useObjectUrl(src);

	if (url == null) return null;

	return (
		<NotEditable>
			<img alt={alt} className="overflow-hidden rounded-md" src={url} />
		</NotEditable>
	);
}

interface LinkButtonPreviewProps {
	children: ReactNode;
	link: LinkSchema;
}

export function LinkButtonPreview(props: LinkButtonPreviewProps): ReactNode {
	const { children, link: _link } = props;

	if (children == null || children === "") return null;

	return (
		<div className="my-2 inline-flex rounded-full bg-brand px-6 py-2 font-medium text-white no-underline transition hover:bg-brand-intent">
			{children}
		</div>
	);
}

interface TweetPreviewProps {
	children?: ReactNode;
	id: string;
}

export function TweetPreview(props: TweetPreviewProps): ReactNode {
	const { children, id } = props;

	return (
		<figure className="grid justify-center gap-y-2">
			<NotEditable>
				<StaticTweet id={id} />
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}

interface VideoPreviewProps {
	children?: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
}

export function VideoPreview(props: VideoPreviewProps): ReactNode {
	const { children, id, provider, startTime } = props;

	const href = String(createVideoUrl(provider, id, startTime));

	return (
		<figure>
			<NotEditable className="grid gap-y-2">
				{/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
				<iframe
					allowFullScreen={true}
					className="aspect-video w-full overflow-hidden rounded-md"
					src={href}
				/>
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
