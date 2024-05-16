import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@acdh-oeaw/validate-env/astro";
import * as v from "valibot";

const environment = import.meta.env.SSR
	? Object.assign({}, process.env, import.meta.env)
	: import.meta.env;

export const env = createEnv({
	environment,
	system(input) {
		const Schema = v.object({
			NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
		});
		return v.parse(Schema, input);
	},
	private(input) {
		const Schema = v.object({
			EMAIL_CONTACT_ADDRESS: v.optional(v.string([v.email()])),
			EMAIL_SMTP_PORT: v.optional(v.coerce(v.number([v.integer(), v.minValue(1)]), Number)),
			EMAIL_SMTP_SERVER: v.optional(v.string([v.minLength(1)])),
			EMAIL_SMTP_USERNAME: v.optional(v.string([v.minLength(1)])),
			EMAIL_SMTP_PASSWORD: v.optional(v.string([v.minLength(1)])),
			KEYSTATIC_GITHUB_CLIENT_ID: v.optional(v.string([v.minLength(1)])),
			KEYSTATIC_GITHUB_CLIENT_SECRET: v.optional(v.string([v.minLength(1)])),
			KEYSTATIC_SECRET: v.optional(v.string([v.minLength(1)])),
		});
		return v.parse(Schema, input);
	},
	public(input) {
		const Schema = v.object({
			PUBLIC_APP_BASE_PATH: v.optional(v.string([v.minLength(1)])),
			PUBLIC_APP_BASE_URL: v.string([v.url()]),
			PUBLIC_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
			PUBLIC_GOOGLE_SITE_VERIFICATION: v.optional(v.string()),
			PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: v.optional(v.string([v.minLength(1)])),
			PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: v.optional(v.string([v.minLength(1)])),
			PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: v.optional(v.string([v.minLength(1)])),
			PUBLIC_KEYSTATIC_MODE: v.optional(v.picklist(["github", "local"]), "local"),
			PUBLIC_MATOMO_BASE_URL: v.optional(v.string([v.url()])),
			PUBLIC_MATOMO_ID: v.optional(v.coerce(v.number([v.integer(), v.minValue(1)]), Number)),
			PUBLIC_REDMINE_ID: v.coerce(v.number([v.integer(), v.minValue(1)]), Number),
		});
		return v.parse(Schema, input);
	},
	validation: v.parse(
		v.optional(v.picklist(["disabled", "enabled", "public"]), "enabled"),
		environment.ENV_VALIDATION,
	),
	onError(error) {
		if (error instanceof v.ValiError) {
			const message = "Invalid environment variables";

			log.error(`${message}:`, v.flatten(error).nested);

			const validationError = new Error(message);
			delete validationError.stack;

			throw validationError;
		}

		throw error;
	},
});
