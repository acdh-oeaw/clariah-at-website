import type { Locale } from "@/config/i18n.config";

export function getFormatter(locale: Locale) {
	const formatter = {
		date: new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
		list: new Intl.ListFormat(locale),
	};

	return formatter;
}
