export function getUnprefixedPathname(pathname: string): string {
	const [leadingSlash, _locale, ...rest] = pathname.split("/");
	return [leadingSlash, ...rest].join("/");
}
