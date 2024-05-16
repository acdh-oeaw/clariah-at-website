import { env } from "@/config/env.config";

const allow = `
User-Agent: *
Allow: /

Host: ${import.meta.env.SITE}
Sitemap: ${String(new URL("/sitemap-index.xml", import.meta.env.SITE))}
`.trim();

const disallow = `
User-Agent: *
Disallow: /

Host: ${import.meta.env.SITE}
`.trim();

const robots = env.PUBLIC_BOTS !== "enabled" ? disallow : allow;

export function GET() {
	return new Response(robots, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
