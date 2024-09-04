import { createUrl, pick } from "@acdh-oeaw/lib";
import {
	type Collection,
	collection,
	type ComponentSchema,
	config,
	fields,
	NotEditable,
	type Singleton,
	singleton,
} from "@keystatic/core";
import { block, inline, mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	BookTextIcon,
	DownloadIcon,
	GridIcon,
	HeadingIcon,
	ImageIcon,
	InfoIcon,
	LinkIcon,
	TwitterIcon,
	VideoIcon,
} from "lucide-react";
import { Tweet } from "react-tweet";

import { Logo } from "@/components/logo";
import { createAssetPaths, createPreviewUrl } from "@/config/content.config";
import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { getCollectionName } from "@/lib/content/get-collection-name";
import { useObjectUrl } from "@/lib/content/use-object-url";
import { cn } from "@/lib/styles";

const headingLevels = [2, 3, 4, 5] as const;

function createCollection<T extends Record<string, ComponentSchema>, U extends string>(
	path: `/${string}/`,
	create: (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		path: Collection<any, any>["path"],
		assetPath: `/${string}/`,
		locale: Locale,
	) => Collection<T, U>,
) {
	return function createI18nCollection(locale: Locale): Collection<T, U> {
		const collection = create(`./content/${locale}${path}**`, `/content/${locale}${path}`, locale);

		return collection;
	};
}

function createSingleton<T extends Record<string, ComponentSchema>>(
	path: `/${string}/`,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	create: (path: Singleton<any>["path"], assetPath: `/${string}/`, locale: Locale) => Singleton<T>,
) {
	return function createI18nCollection(locale: Locale): Singleton<T> {
		const collection = create(`./content/${locale}${path}`, `/content/${locale}${path}`, locale);

		return collection;
	};
}

function createComponents(
	assetPath: `/${string}/`,
	locale: Locale,
	components?: Array<
		| "Avatar"
		| "Callout"
		| "DownloadButton"
		| "DownloadLink"
		| "Figure"
		| "Grid"
		| "GridItem"
		| "HeadingId"
		| "ImageLink"
		| "InternalLink"
		| "LinkButton"
		| "Tweet"
		| "Video"
	>,
) {
	const allComponents = {
		Avatar: wrapper({
			label: "Avatar",
			description: "An avatar component.",
			icon: <InfoIcon />,
			schema: {
				href: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					// validation: { isRequired: false },
				}),
				maxSize: fields.number({
					label: "Max image size in pixels",
					// validation: { isRequired: false },
				}),
				variant: fields.select({
					label: "Variant",
					options: [
						{ label: "Rounded", value: "rounded" },
						{ label: "Square", value: "square" },
					],
					defaultValue: "rounded",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const contentType = value.href?.extension === "svg" ? "image/svg+xml" : undefined;
				const url = useObjectUrl(value.href?.data ?? null, contentType);

				return (
					<figure>
						<NotEditable>
							<img
								alt=""
								className="aspect-square w-full"
								src={url ?? undefined}
								style={{
									margin: 0,
									maxWidth: `${String(value.maxSize)}px`,
								}}
							/>
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		Callout: wrapper({
			label: "Callout",
			description: "Additional information.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					/** @see https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts */
					options: [
						{ label: "Caution", value: "caution" },
						{ label: "Important", value: "important" },
						{ label: "Note", value: "note" },
						{ label: "Tip", value: "tip" },
						{ label: "Warning", value: "warning" },
					],
					defaultValue: "note",
				}),
			},
		}),
		DownloadLink: mark({
			label: "Download link",
			// description: "A link to an uploaded file.",
			icon: <DownloadIcon />,
			tag: "a",
			className: "underline decoration-dotted",
			schema: {
				href: fields.file({
					label: "File",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
			},
		}),
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
					...createAssetPaths(assetPath),
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<NotEditable>
						<div className="my-2 inline-flex rounded-full bg-brand px-6 py-2 text-white no-underline transition hover:bg-brand-intent">
							{value.label}
						</div>
					</NotEditable>
				);
			},
		}),
		Figure: wrapper({
			label: "Figure",
			description: "An image with caption.",
			icon: <ImageIcon />,
			schema: {
				href: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					// validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const contentType = value.href?.extension === "svg" ? "image/svg+xml" : undefined;
				const url = useObjectUrl(value.href?.data ?? null, contentType);

				return (
					<figure>
						<NotEditable>
							<img alt={value.alt} src={url ?? undefined} />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		Grid: repeating({
			label: "Grid",
			description: "A grid layout.",
			icon: <GridIcon />,
			children: ["GridItem"],
			schema: {
				variant: fields.select({
					label: "Variant",
					options: [
						{
							label: "Two columns",
							value: "two-columns",
						},
						{
							label: "Three columns",
							value: "three-columns",
						},
						{
							label: "Four columns",
							value: "four-columns",
						},
						{
							label: "Two columns, right is 2x as wide",
							value: "one-two-columns",
						},
						{
							label: "Two columns, right is 3x as wide",
							value: "one-three-columns",
						},
						{
							label: "Two columns, right is 4x as wide",
							value: "one-four-columns",
						},
					],
					defaultValue: "two-columns",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const variants = {
					"two-columns": "sm:grid-cols-2",
					"three-columns": "sm:grid-cols-3",
					"four-columns": "sm:grid-cols-4",
					"one-two-columns": "sm:grid-cols-[1fr_2fr]",
					"one-three-columns": "sm:grid-cols-[1fr_3fr]",
					"one-four-columns": "sm:grid-cols-[1fr_4fr]",
				};

				return (
					<div className={cn("grid content-start gap-8", variants[value.variant])}>{children}</div>
				);
			},
		}),
		GridItem: wrapper({
			label: "Grid item",
			description: "A grid cell.",
			icon: <GridIcon />,
			forSpecificLocations: true,
			schema: {},
		}),
		HeadingId: inline({
			label: "Heading ID",
			description: "A custom heading id as a link target.",
			icon: <HeadingIcon />,
			schema: {
				id: fields.text({
					label: "Identifier",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <span className="opacity-50">#{value.id}</span>;
			},
		}),
		ImageLink: wrapper({
			label: "Image link",
			description: "An image-only link.",
			icon: <LinkIcon />,
			schema: {
				link: fields.conditional(
					fields.select({
						label: "Type",
						options: [
							{ label: "Consortium", value: "consortium" },
							{ label: "Custom", value: "custom" },
							{ label: "Events", value: "events" },
							{ label: "News", value: "news" },
							{ label: "Page", value: "pages" },
							{ label: "Projects", value: "projects" },
						],
						defaultValue: "pages",
					}),
					{
						consortium: fields.relationship({
							label: "Consortium member",
							validation: { isRequired: true },
							collection: getCollectionName("consortium", locale),
						}),
						custom: fields.text({
							label: "URL",
							validation: { isRequired: true },
						}),
						events: fields.relationship({
							label: "Event",
							validation: { isRequired: true },
							collection: getCollectionName("events", locale),
						}),
						news: fields.relationship({
							label: "News",
							validation: { isRequired: true },
							collection: getCollectionName("news", locale),
						}),
						pages: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: getCollectionName("pages", locale),
						}),
						projects: fields.relationship({
							label: "Project",
							validation: { isRequired: true },
							collection: getCollectionName("projects", locale),
						}),
					},
				),
				src: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					// validation: { isRequired: false },
				}),
				text: fields.text({
					label: "Link text (invisible)",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const contentType = value.src?.extension === "svg" ? "image/svg+xml" : undefined;
				const url = useObjectUrl(value.src?.data ?? null, contentType);

				return (
					<figure>
						<NotEditable>
							<img alt={value.alt} src={url ?? undefined} />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		InternalLink: mark({
			label: "Internal link",
			icon: <BookTextIcon />,
			tag: "a",
			schema: {
				resource: fields.conditional(
					fields.select({
						label: "Collection",
						options: [
							{ label: "Consortium", value: "consortium" },
							{ label: "Events", value: "events" },
							{ label: "News", value: "news" },
							{ label: "Pages", value: "pages" },
							{ label: "Projects", value: "projects" },
						],
						defaultValue: "pages",
					}),
					{
						consortium: fields.relationship({
							label: "Consortium member",
							validation: { isRequired: true },
							collection: getCollectionName("consortium", locale),
						}),
						events: fields.relationship({
							label: "Event",
							validation: { isRequired: true },
							collection: getCollectionName("events", locale),
						}),
						news: fields.relationship({
							label: "News",
							validation: { isRequired: true },
							collection: getCollectionName("news", locale),
						}),
						pages: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: getCollectionName("pages", locale),
						}),
						projects: fields.relationship({
							label: "Project",
							validation: { isRequired: true },
							collection: getCollectionName("projects", locale),
						}),
					},
				),
			},
		}),
		LinkButton: block({
			label: "Link button",
			description: "A link which looks like a button.",
			icon: <LinkIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				link: fields.conditional(
					fields.select({
						label: "Type",
						options: [
							{ label: "Consortium", value: "consortium" },
							{ label: "Custom", value: "custom" },
							{ label: "Events", value: "events" },
							{ label: "News", value: "news" },
							{ label: "Page", value: "pages" },
							{ label: "Projects", value: "projects" },
						],
						defaultValue: "pages",
					}),
					{
						consortium: fields.relationship({
							label: "Consortium member",
							validation: { isRequired: true },
							collection: getCollectionName("consortium", locale),
						}),
						custom: fields.text({
							label: "URL",
							validation: { isRequired: true },
						}),
						events: fields.relationship({
							label: "Event",
							validation: { isRequired: true },
							collection: getCollectionName("events", locale),
						}),
						news: fields.relationship({
							label: "News",
							validation: { isRequired: true },
							collection: getCollectionName("news", locale),
						}),
						pages: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: getCollectionName("pages", locale),
						}),
						projects: fields.relationship({
							label: "Projects",
							validation: { isRequired: true },
							collection: getCollectionName("projects", locale),
						}),
					},
				),
			},
			ContentView(props) {
				const { value } = props;

				if (value.label.length === 0) {
					return null;
				}

				return (
					<NotEditable>
						<div className="my-2 inline-flex rounded-full bg-brand px-6 py-2 text-white no-underline transition hover:bg-brand-intent">
							{value.label}
						</div>
					</NotEditable>
				);
			},
		}),
		Tweet: wrapper({
			label: "Tweet",
			description: "A tweet.",
			icon: <TwitterIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<figure>
						<NotEditable>
							<Tweet id={value.id} />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		Video: wrapper({
			label: "Video",
			description: "An embedded video.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Video provider",
					options: [{ label: "YouTube", value: "youtube" }],
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const href = String(
					createUrl({
						baseUrl: "https://www.youtube-nocookie.com",
						pathname: `/embed/${value.id}`,
					}),
				);

				return (
					<figure>
						<NotEditable>
							<iframe allowFullScreen={true} src={href} title="Video" />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
	};

	if (components == null) return allComponents;

	return pick(allComponents, components);
}

const collections = {
	consortium: createCollection("/consortium/", (path, assetPath, locale) => {
		return collection({
			label: `Consortium (${locale})`,
			path,
			slugField: "name",
			format: { data: "json" },
			previewUrl: createPreviewUrl("/partners/{slug}"),
			entryLayout: "form",
			columns: ["name"],
			schema: {
				name: fields.slug({
					name: {
						label: "Name",
						validation: { isRequired: true },
					},
				}),
				href: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
				logo: fields.image({
					label: "Logo",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				description: fields.mdx({
					label: "Description",
					options: {
						heading: false,
						image: createAssetPaths(assetPath),
					},
					components: {},
				}),
				institutions: fields.array(
					fields.object(
						{
							name: fields.text({
								label: "Name",
								validation: { isRequired: true },
							}),
							href: fields.url({
								label: "URL",
								validation: { isRequired: true },
							}),
							logo: fields.image({
								label: "Logo",
								...createAssetPaths(assetPath),
								validation: { isRequired: true },
							}),
						},
						{
							label: "Institution",
						},
					),
					{
						label: "Institutions",
						itemLabel(props) {
							return props.fields.name.value;
						},
						// validation: { length: { min: 1 } },
					},
				),
				people: fields.array(
					fields.object(
						{
							name: fields.text({
								label: "Name",
								validation: { isRequired: true },
							}),
							image: fields.image({
								label: "Image",
								...createAssetPaths(assetPath),
								validation: { isRequired: true },
							}),
							links: fields.array(
								fields.object({
									kind: fields.select({
										label: "Type",
										options: [
											{ label: "Bluesky", value: "bluesky" },
											{ label: "Facebook", value: "facebook" },
											{ label: "Instagram", value: "instagram" },
											{ label: "Linkedin", value: "linkedin" },
											{ label: "Mastodon", value: "mastodon" },
											{ label: "ORCID", value: "orcid" },
											{ label: "Podcast", value: "podcast" },
											{ label: "Twitter", value: "twitter" },
											{ label: "Website", value: "website" },
											{ label: "YouTube", value: "youtube" },
										],
										defaultValue: "website",
									}),
									href: fields.url({
										label: "URL",
										validation: { isRequired: true },
									}),
								}),
								{
									label: "Links (social media)",
									itemLabel(props) {
										return props.fields.kind.value;
									},
								},
							),
							description: fields.mdx({
								label: "Description",
								options: {
									heading: false,
									image: createAssetPaths(assetPath),
								},
								components: {},
							}),
						},
						{
							label: "Person",
						},
					),
					{
						label: "People",
						itemLabel(props) {
							return props.fields.name.value;
						},
						// validation: { length: { min: 1 } },
					},
				),
			},
		});
	}),
	events: createCollection("/events/", (path, assetPath, locale) => {
		return collection({
			label: `Events (${locale})`,
			path,
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/events/{slug}"),
			entryLayout: "content",
			columns: ["title", "date"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				date: fields.date({
					label: "Publication date",
					validation: { isRequired: true },
					defaultValue: { kind: "today" },
				}),
				image: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				eventDate: fields.date({
					label: "Event date",
					// validation: { isRequired: true },
				}),
				eventLocation: fields.text({
					label: "Event location",
					// validation: { isRequired: true },
				}),
				shortTitle: fields.text({
					label: "Summary title",
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: headingLevels,
						image: createAssetPaths(assetPath),
					},
					components: createComponents(assetPath, locale),
				}),
			},
		});
	}),
	news: createCollection("/news/", (path, assetPath, locale) => {
		return collection({
			label: `News (${locale})`,
			path,
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/news/{slug}"),
			entryLayout: "content",
			columns: ["title", "date"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				date: fields.date({
					label: "Publication date",
					validation: { isRequired: true },
					defaultValue: { kind: "today" },
				}),
				image: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				shortTitle: fields.text({
					label: "Summary title",
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: headingLevels,
						image: createAssetPaths(assetPath),
					},
					components: createComponents(assetPath, locale),
				}),
			},
		});
	}),
	projects: createCollection("/projects/", (path, assetPath, locale) => {
		return collection({
			label: `Projects (${locale})`,
			path,
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/projects/{slug}"),
			entryLayout: "content",
			columns: ["title", "startDate"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				shortTitle: fields.text({
					label: "Summary title",
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				startDate: fields.date({
					label: "Start date",
					// validation: { isRequired: true },
				}),
				endDate: fields.date({
					label: "End date",
					// validation: { isRequired: false },
				}),
				image: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					// validation: { isRequired: false },
				}),
				additionalImages: fields.array(
					fields.object(
						{
							image: fields.image({
								label: "Image",
								...createAssetPaths(assetPath),
								validation: { isRequired: true },
							}),
							alt: fields.text({
								label: "Alternative text",
								// validation: { isRequired: false },
							}),
							license: fields.text({
								label: "License",
								// validation: { isRequired: false },
							}),
						},
						{
							label: "Image",
						},
					),
					{
						label: "Additional images",
						itemLabel(props) {
							return props.fields.alt.value;
						},
					},
				),
				attachments: fields.array(
					fields.object(
						{
							file: fields.file({
								label: "File",
								...createAssetPaths(assetPath),
								validation: { isRequired: true },
							}),
							label: fields.text({
								label: "Label",
								validation: { isRequired: true },
							}),
						},
						{
							label: "Attachment",
						},
					),
					{
						label: "Attachments",
						itemLabel(props) {
							return props.fields.label.value;
						},
					},
				),
				links: fields.array(
					fields.object(
						{
							label: fields.text({
								label: "Label",
								validation: { isRequired: true },
							}),
							url: fields.url({
								label: "URL",
								validation: { isRequired: true },
							}),
						},
						{
							label: "Link",
						},
					),
					{
						label: "Links",
						itemLabel(props) {
							return props.fields.label.value;
						},
					},
				),
				responsiblePersons: fields.array(
					fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					{
						label: "Responsible Person(s)",
						itemLabel(props) {
							return props.value;
						},
					},
				),
				hostingOrganizations: fields.array(
					fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					{
						label: "Hosting Organization(s)",
						itemLabel(props) {
							return props.value;
						},
					},
				),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: headingLevels,
						image: createAssetPaths(assetPath),
					},
					components: createComponents(assetPath, locale),
				}),
			},
		});
	}),
	pages: createCollection("/pages/", (path, assetPath, locale) => {
		return collection({
			label: `Pages (${locale})`,
			path,
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/{slug}"),
			entryLayout: "content",
			columns: ["title"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				image: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					// validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: headingLevels,
						image: createAssetPaths(assetPath),
					},
					components: createComponents(assetPath, locale),
				}),
			},
		});
	}),
};

const singletons = {
	indexPage: createSingleton("/index-page/", (path, assetPath, locale) => {
		return singleton({
			label: `Home page (${locale})`,
			path,
			format: { data: "json" },
			entryLayout: "form",
			previewUrl: createPreviewUrl("/"),
			schema: {
				hero: fields.object(
					{
						title: fields.text({
							label: "Title",
							validation: { isRequired: true },
						}),
						subtitle: fields.text({
							label: "Subtitle",
							validation: { isRequired: true },
						}),
						image: fields.image({
							label: "Image",
							...createAssetPaths(assetPath),
							validation: { isRequired: true },
						}),
					},
					{
						label: "Hero section",
					},
				),
				main: fields.object(
					{
						sections: fields.blocks(
							{
								cardsSection: {
									label: "Cards section",
									itemLabel(props) {
										return props.fields.title.value + " (Cards)";
									},
									schema: fields.object(
										{
											title: fields.text({
												label: "Title",
												validation: { isRequired: true },
											}),
											variant: fields.select({
												label: "Variant",
												options: [
													{
														label: "Fluid",
														value: "fluid",
													},
													{
														label: "Two columns",
														value: "two-columns",
													},
													{
														label: "Three columns",
														value: "three-columns",
													},
													{
														label: "Four columns",
														value: "four-columns",
													},
												],
												defaultValue: "fluid",
											}),
											cards: fields.blocks(
												{
													custom: {
														label: "Custom card",
														itemLabel(props) {
															return props.fields.title.value;
														},
														schema: fields.object(
															{
																title: fields.text({
																	label: "Title",
																	validation: { isRequired: true },
																}),
																image: fields.image({
																	label: "Image",
																	...createAssetPaths(assetPath),
																	// validation: { isRequired: false },
																}),
																summary: fields.text({
																	label: "Summary",
																	multiline: true,
																	validation: { isRequired: true },
																}),
																link: fields.object(
																	{
																		label: fields.text({
																			label: "Label",
																			validation: { isRequired: true },
																		}),
																		href: fields.url({
																			label: "URL",
																			validation: { isRequired: true },
																		}),
																	},
																	{
																		label: "Link",
																	},
																),
															},
															{
																label: "Custom card",
															},
														),
													},
													event: {
														label: "Event card",
														itemLabel(props) {
															return props.fields.title.value;
														},
														schema: fields.object(
															{
																title: fields.text({
																	label: "Title",
																	validation: { isRequired: true },
																}),
																reference: fields.relationship({
																	label: "Event",
																	collection: getCollectionName("events", locale),
																	validation: { isRequired: true },
																}),
															},
															{
																label: "Event card",
															},
														),
													},
													news: {
														label: "News card",
														itemLabel(props) {
															return props.fields.title.value;
														},
														schema: fields.object(
															{
																title: fields.text({
																	label: "Title",
																	validation: { isRequired: true },
																}),
																reference: fields.relationship({
																	label: "News",
																	collection: getCollectionName("news", locale),
																	validation: { isRequired: true },
																}),
															},
															{
																label: "News card",
															},
														),
													},
													page: {
														label: "Page card",
														itemLabel(props) {
															return props.fields.title.value;
														},
														schema: fields.object(
															{
																title: fields.text({
																	label: "Title",
																	validation: { isRequired: true },
																}),
																reference: fields.relationship({
																	label: "Page",
																	collection: getCollectionName("pages", locale),
																	validation: { isRequired: true },
																}),
															},
															{
																label: "Page card",
															},
														),
													},
												},
												{
													label: "Cards",
													validation: { length: { min: 1 } },
												},
											),
										},
										{
											label: "Cards section",
										},
									),
								},
							},
							{
								label: "Sections",
								validation: { length: { min: 1 } },
							},
						),
					},
					{ label: "Main content" },
				),
			},
		});
	}),
	metadata: createSingleton("/metadata/", (path, _assetPath, locale) => {
		return singleton({
			label: `Metadata (${locale})`,
			path,
			format: { data: "json" },
			entryLayout: "form",
			schema: {
				title: fields.text({
					label: "Site title",
					validation: { isRequired: true },
				}),
				shortTitle: fields.text({
					label: "Short site title",
					validation: { isRequired: true },
				}),
				description: fields.text({
					label: "Site description",
					validation: { isRequired: true },
				}),
				twitter: fields.text({
					label: "Twitter handle",
					// validation: { isRequired: false },
				}),
			},
		});
	}),
	navigation: createSingleton("/navigation/", (path, _assetPath, locale) => {
		return singleton({
			label: `Navigation (${locale})`,
			path,
			format: { data: "json" },
			entryLayout: "form",
			schema: {
				links: fields.blocks(
					{
						link: {
							label: "Link",
							itemLabel(props) {
								return props.fields.label.value;
							},
							schema: fields.object({
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								href: fields.url({
									label: "URL",
									validation: { isRequired: true },
								}),
							}),
						},
						page: {
							label: "Page",
							itemLabel(props) {
								return props.fields.label.value;
							},
							schema: fields.object({
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								reference: fields.relationship({
									label: "Page",
									collection: getCollectionName("pages", locale),
									validation: { isRequired: true },
								}),
							}),
						},
						menu: {
							label: "Menu",
							itemLabel(props) {
								return props.fields.label.value + " (Menu)";
							},
							schema: fields.object({
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								links: fields.blocks(
									{
										link: {
											label: "Link",
											itemLabel(props) {
												return props.fields.label.value;
											},
											schema: fields.object(
												{
													label: fields.text({
														label: "Label",
														validation: { isRequired: true },
													}),
													href: fields.url({
														label: "URL",
														validation: { isRequired: true },
													}),
												},
												{
													label: "Link",
												},
											),
										},
										page: {
											label: "Page",
											itemLabel(props) {
												return props.fields.label.value;
											},
											schema: fields.object(
												{
													label: fields.text({
														label: "Label",
														validation: { isRequired: true },
													}),
													reference: fields.relationship({
														label: "Page",
														collection: getCollectionName("pages", locale),
														validation: { isRequired: true },
													}),
												},
												{
													label: "Page",
												},
											),
										},
									},
									{
										label: "Links",
										validation: { length: { min: 1 } },
									},
								),
							}),
						},
					},
					{
						label: "Links",
						validation: { length: { min: 1 } },
					},
				),
			},
		});
	}),
};

export default config({
	ui: {
		brand: {
			name: "CLARIAH-AT",
			// @ts-expect-error `ReactNode` is a valid return type.
			mark: Logo,
		},
		navigation: {
			Pages: ["de_indexPage", "en_indexPage", "---", "de_pages", "en_pages"],
			Data: [
				"de_consortium",
				"en_consortium",
				"---",
				"de_events",
				"en_events",
				"---",
				"de_news",
				"en_news",
				"---",
				"de_projects",
				"en_projects",
			],
			Navigation: ["de_navigation", "en_navigation"],
			Settings: ["de_metadata", "en_metadata"],
		},
	},
	storage:
		/**
		 * @see https://keystatic.com/docs/github-mode
		 */
		env.PUBLIC_KEYSTATIC_MODE === "github" &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	collections: {
		de_pages: collections.pages("de"),
		en_pages: collections.pages("en"),

		de_consortium: collections.consortium("de"),
		en_consortium: collections.consortium("en"),

		de_events: collections.events("de"),
		en_events: collections.events("en"),

		de_news: collections.news("de"),
		en_news: collections.news("en"),

		de_projects: collections.projects("de"),
		en_projects: collections.projects("en"),
	},
	singletons: {
		de_indexPage: singletons.indexPage("de"),
		en_indexPage: singletons.indexPage("en"),

		de_metadata: singletons.metadata("de"),
		en_metadata: singletons.metadata("en"),

		de_navigation: singletons.navigation("de"),
		en_navigation: singletons.navigation("en"),
	},
});
