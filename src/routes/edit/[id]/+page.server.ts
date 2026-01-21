import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from '../../../schema';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const event = await prisma.event.findUnique({
		where: {
			id: Number(params.id)
		}
	});

	if (event === null) error(404, 'Not found');

	return {
		form: await superValidate(
			{
				title: event.title,
				description: event.description,
				context: event.context,
				start: event.startDate,
				end: event.endDate,
				impact: event.impact
			},
			zod4(formSchema)
		)
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod4(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await prisma.event.update({
				data: {
					title: form.data.title,
					description: form.data.description,
					context: form.data.context,
					startDate: form.data.start,
					endDate: form.data.end,
					impact: form.data.impact
				},
				where: {
					id: Number(params.id)
				}
			});
		} catch {
			return fail(500, { form });
		}

		redirect(303, '/');
	}
};
