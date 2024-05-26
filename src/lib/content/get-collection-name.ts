import type { Locale } from "@/config/i18n.config";

export function getCollectionName<
	T extends "consortium" | "events" | "news" | "pages" | "projects",
>(collection: T, locale: Locale) {
	return `${locale}_${collection}` as const;
}
