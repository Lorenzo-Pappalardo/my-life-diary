import prisma from '$lib/prisma';
import type { Event } from '../generated/prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let events: readonly Event[];

	try {
		events = await prisma.event.findMany();
	} catch {
		events = [];
	}

	return {
		events
	};
};
