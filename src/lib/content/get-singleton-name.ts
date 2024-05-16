import type { Locale } from "@/config/i18n.config";

export function getSingletonName<T extends "indexPage" | "metadata" | "navigation">(
	singleton: T,
	locale: Locale,
) {
	return `${locale}_${singleton}` as const;
}
