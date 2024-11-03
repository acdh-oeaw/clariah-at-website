import { defaultLocale } from "@/config/i18n.config";
import { createI18n } from "@/lib/i18n";

export async function GET() {
	const locale = defaultLocale;

	const { t } = await createI18n(locale);

	const metadata = t("metadata");

	const manifest = {
		name: metadata.manifest.name,
		short_name: metadata.manifest["short-name"],
		description: metadata.manifest.description,
		icons: [
			{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
			{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
		],
		theme_color: "#28d8d8",
		background_color: "#28d8d8",
		display: "standalone",
		start_url: "/",
	};

	return Response.json(manifest);
}
