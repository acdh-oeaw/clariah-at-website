import type { Locale } from "@/config/i18n.config";
import type { Navigation } from "@/lib/content/types";

export function getNavigation(locale: Locale): Promise<Navigation> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return import(`../../content/${locale}/navigation/index.json`);
}
