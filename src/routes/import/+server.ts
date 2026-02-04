import prisma from '$lib/prisma';
import { existsSync, readFileSync } from 'node:fs';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	const importFileName = await request.text();
	const fullPathFileName = `src/generated/import/${importFileName}`;

	if (!existsSync(fullPathFileName)) error(404, 'Not found');

	const records = (
		JSON.parse(readFileSync(fullPathFileName, 'utf8')) as {
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
