export const avatarVariants = [
	{ label: "Circle", value: "circle" },
	{ label: "Square", value: "square" },
] as const;

export type AvatarVariant = (typeof avatarVariants)[number]["value"];

export const cardsSectionVariants = [
	{ label: "Fluid", value: "fluid" },
	{ label: "Two columns", value: "two-columns" },
	{ label: "Three columns", value: "three-columns" },
] as const;

export type CardsSectionVariant = (typeof cardsSectionVariants)[number]["value"];

export const figureAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type FigureAlignment = (typeof figureAlignments)[number]["value"];

export const gridAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type GridAlignments = (typeof gridAlignments)[number]["value"];

export const gridLayouts = [
	{ label: "Two columns", value: "two-columns" },
	{ label: "Three columns", value: "three-columns" },
	{ label: "Four columns", value: "four-columns" },
	{ label: "Two columns, right is 2x as wide", value: "one-two-columns" },
	{ label: "Two columns, right is 3x as wide", value: "one-three-columns" },
	{ label: "Two columns, right is 4x as wide", value: "one-four-columns" },
] as const;

export type GridLayout = (typeof gridLayouts)[number]["value"];

export const linkKinds = [
	{ label: "Download", value: "download" },
	{ label: "External", value: "external" },
	{ label: "Home page", value: "index-page" },
	{ label: "Consortium", value: "consortium" },
	{ label: "Events", value: "events" },
	{ label: "News", value: "news" },
	{ label: "Pages", value: "pages" },
	{ label: "Projects", value: "projects" },
] as const;

export type LinkKind = (typeof linkKinds)[number]["value"];

export const videoProviders = [{ label: "YouTube", value: "youtube" }] as const;

export type VideoProvider = (typeof videoProviders)[number]["value"];
