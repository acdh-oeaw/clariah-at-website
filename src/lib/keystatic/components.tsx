/* @jsxImportSource react */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block, inline, mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	DownloadIcon,
	GridIcon,
	HashIcon,
	ImageIcon,
	InfoIcon,
	LinkIcon,
	SquareIcon,
	SuperscriptIcon,
	TwitterIcon,
	VideoIcon,
} from "lucide-react";

import {
	avatarVariants,
	figureAlignments,
	gridAlignments,
	gridLayouts,
	videoProviders,
} from "@/lib/keystatic/component-options";
import { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import {
	AvatarPreview,
	DownloadButtonPreview,
	FigurePreview,
	GridItemPreview,
	GridPreview,
	HeadingIdPreview,
	ImageLinkPreview,
	LinkButtonPreview,
	TweetPreview,
	VideoPreview,
} from "@/lib/keystatic/previews";

export const createAvatar = createComponent((paths, _locale) => {
	return {
		Avatar: wrapper({
			label: "Avatar",
			description: "An avatar component.",
			icon: <InfoIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					validation: { isRequired: false },
				}),
				maxSize: fields.number({
					label: "Max image size in pixels",
					validation: { isRequired: false },
				}),
				variant: fields.select({
					label: "Variant",
					options: avatarVariants,
					defaultValue: "circle",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<AvatarPreview
						alt={value.alt}
						maxSize={value.maxSize}
						src={value.src}
						variant={value.variant}
					>
						{children}
					</AvatarPreview>
				);
			},
		}),
	};
});

export const createDownloadButton = createComponent((paths, _locale) => {
	return {
		DownloadButton: block({
			label: "Download button",
			description: "A button to download an uploaded file.",
			icon: <DownloadIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				href: fields.file({
					label: "File",
					validation: { isRequired: true },
					...createAssetOptions(paths.downloadPath),
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <DownloadButtonPreview href={value.href}>{value.label}</DownloadButtonPreview>;
			},
		}),
	};
});

export const createFigure = createComponent((paths, _locale) => {
	return {
		Figure: wrapper({
			label: "Figure",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					validation: { isRequired: false },
				}),
				alignment: fields.select({
					label: "Alignment",
					options: figureAlignments,
					defaultValue: "stretch",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<FigurePreview alignment={value.alignment} alt={value.alt} src={value.src}>
						{children}
					</FigurePreview>
				);
			},
		}),
	};
});

export const createFootnote = createComponent((_paths, _locale) => {
	return {
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			schema: {},
			className: "underline decoration-dotted align-super text-sm",
		}),
	};
});

export const createGrid = createComponent((_paths, _locale) => {
	return {
		Grid: repeating({
			label: "Grid",
			icon: <GridIcon />,
			schema: {
				layout: fields.select({
					label: "Layout",
					options: gridLayouts,
					defaultValue: "two-columns",
				}),
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			children: ["GridItem"],
			ContentView(props) {
				const { children, value } = props;

				return (
					<GridPreview alignment={value.alignment} layout={value.layout}>
						{children}
					</GridPreview>
				);
			},
		}),
		GridItem: wrapper({
			label: "Grid item",
			icon: <SquareIcon />,
			schema: {
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <GridItemPreview alignment={value.alignment}>{children}</GridItemPreview>;
			},
		}),
	};
});

export const createHeadingId = createComponent((_paths, _locale) => {
	return {
		HeadingId: inline({
			label: "HeadingId",
			icon: <HashIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <HeadingIdPreview>{value.id}</HeadingIdPreview>;
			},
		}),
	};
});

export const createImageLink = createComponent((paths, locale) => {
	return {
		ImageLink: block({
			label: "Image link",
			description: "An image-only link.",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					validation: { isRequired: false },
				}),
				text: fields.text({
					label: "Link text (invisible)",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<ImageLinkPreview alt={value.alt} link={value.link} src={value.src} text={value.text} />
				);
			},
		}),
	};
});

export const createLink = createComponent((paths, locale) => {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			tag: "a",
		}),
	};
});

export const createLinkButton = createComponent((paths, locale) => {
	return {
		LinkButton: block({
			label: "LinkButton",
			icon: <LinkIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				link: createLinkSchema(paths.downloadPath, locale),
			},
			ContentView(props) {
				const { value } = props;

				return <LinkButtonPreview link={value.link}>{value.label}</LinkButtonPreview>;
			},
		}),
	};
});

export const createTweet = createComponent((_paths, _locale) => {
	return {
		Tweet: wrapper({
			label: "Tweet",
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			icon: <TwitterIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <TweetPreview id={value.id}>{children}</TweetPreview>;
			},
		}),
	};
});

export const createVideo = createComponent((_paths, _locale) => {
	return {
		Video: wrapper({
			label: "Video",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<VideoPreview id={value.id} provider={value.provider} startTime={value.startTime}>
						{children}
					</VideoPreview>
				);
			},
		}),
	};
});
