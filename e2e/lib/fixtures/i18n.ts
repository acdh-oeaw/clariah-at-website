import { assert, get, template } from "@acdh-oeaw/lib";
import type { Page } from "@playwright/test";
import type { Get, Paths } from "type-fest";

import { defaultLocale, type IntlMessages } from "@/config/i18n.config";
import type { createI18n as createIntl } from "@/lib/i18n";

export interface I18n extends Awaited<ReturnType<typeof createIntl>> {}

export async function createI18n(_page: Page, locale = defaultLocale): Promise<I18n> {
	/**
	 * FIXME: Copying `@/lib/i18n.ts` because `playwright` does not handle json imports without
	 * import attribute, but `vite` fails to compile when they are added.
	 *
	 * @see https://github.com/microsoft/playwright/issues/23662
	 */
	// return createIntl(locale);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const _messages = await import(`@/messages/${locale}.json`, { with: { type: "json" } });
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const metadata = await import(`~/content/${locale}/metadata/index.json`, {
		with: { type: "json" },
	});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	const messages = { metadata: metadata.default, ..._messages.default } as IntlMessages;

	return {
		/** @see https://github.com/lukeed/rosetta/blob/master/src/index.js */
		t<T extends Paths<IntlMessages>>(
			// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
			this: void,
			key: T,
			params: Record<string, unknown> = {},
		): Get<IntlMessages, T> {
			const value = get(messages, key);

			assert(value != null, `Missing translation for ${key}.`);

			if (typeof value === "string") {
				return template(value, params) as Get<IntlMessages, T>;
			}

			return value as Get<IntlMessages, T>;
		},
	};
}

export type WithI18n<T> = T & { i18n: I18n };
