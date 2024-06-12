const hasFileExtension = /\.\w+?$/;

export function ensureTrailingSlash(path: string): string {
	if (hasFileExtension.test(path)) return path;

	return path.endsWith("/") ? path : path + "/";
}
