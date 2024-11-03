import { env } from "@/config/env.config";

export function getUnprefixedPathname(pathname: string): string {
	const _pathname =
		env.PUBLIC_APP_BASE_PATH != null ? pathname.slice(env.PUBLIC_APP_BASE_PATH.length) : pathname;

	const [leadingSlash, _locale, ...rest] = _pathname.split("/");

	return [leadingSlash, ...rest].join("/");
}
