import prisma from '$lib/prisma';
import { readFileSync } from 'node:fs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	const records = (
		JSON.parse(readFileSync('src/generated/import/events.json', 'utf8')) as {
			title: string;
			description?: string;
			context: string;
			startDate: string;
			endDate?: string;
			impact: string;
		}[]
	).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

	await prisma.event.createMany({
		skipDuplicates: true,
		data: records.map(record => ({
			title: record.title,
			description: record.description,
			context: record.context,
			startDate: new Date(record.startDate),
			endDate: record.endDate ? new Date(record.endDate) : undefined,
			impact: record.impact === 'Positive'
		}))
	});

	return new Response();
};
