import { env } from "@/config/env.config";
import { ensureTrailingSlash } from "@/lib/ensure-trailing-slash";

export function withBasePath(pathname: string): string {
	if (!pathname.startsWith("/")) return pathname;

	if (env.PUBLIC_APP_BASE_PATH != null) {
		return `${ensureTrailingSlash(env.PUBLIC_APP_BASE_PATH)}${pathname.slice(1)}`;
	}

	return pathname;
}
