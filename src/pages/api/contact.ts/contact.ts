import { getFormDataValues, log } from "@acdh-oeaw/lib";
import type { APIContext } from "astro";
import * as v from "valibot";

import { subjectPrefix } from "@/config/email.config";
import { sendEmail } from "@/lib/email";

const ContactFormSchema = v.object({
	email: v.string([v.email()]),
	message: v.string([v.minLength(1)]),
	subject: v.string([v.minLength(1)]),
});

export async function POST(context: APIContext) {
	const formData = await context.request.formData();

	const result = await v.safeParseAsync(ContactFormSchema, getFormDataValues(formData));

	if (!result.success) {
		return Response.json({ message: "Invalid input." }, { status: 400 });
	}

	const data = result.output;

	const subject = `${subjectPrefix} ${data.subject}`;
	const message = data.message;

	try {
		await sendEmail({
			from: data.email,
			subject,
			text: message,
		});

		return context.redirect("/success", 303);
	} catch (error) {
		log.error(error);

		return Response.json({ message: "Failed to send message." }, { status: 500 });
	}
}

export const prerender = false;
