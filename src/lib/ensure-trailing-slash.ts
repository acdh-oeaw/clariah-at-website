export function ensureTrailingSlash(path: string): string {
	if (path.split("/").at(-1)?.includes(".")) return path;

	return path.endsWith("/") ? path : `${path}/`;
}
