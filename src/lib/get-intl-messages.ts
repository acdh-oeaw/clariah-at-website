/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { IntlMessages, Locale } from "@/config/i18n.config";

export async function getIntlMessages(locale: Locale): Promise<IntlMessages> {
	const messages = await import(`../messages/${locale}.json`);
	const metadata = await import(`../../content/${locale}/metadata/index.json`);
	return { metadata, ...messages };
}
