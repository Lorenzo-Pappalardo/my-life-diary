import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from '../../schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ form: await superValidate(zod4(formSchema)) });

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await prisma.event.create({
				data: {
					title: form.data.title,
					description: form.data.description,
					context: form.data.context,
					startDate: form.data.start,
					endDate: form.data.end,
					impact: form.data.impact
				}
			});
		} catch {
			return fail(500, { form });
		}

		redirect(303, '/');
	}
};
