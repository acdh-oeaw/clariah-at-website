import { createReader } from "@keystatic/core/reader";

import config from "~/keystatic.config";

export function reader() {
	return createReader(process.cwd(), config);
}
