import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { existsSync, mkdirSync } from 'node:fs';
import { Worker } from 'node:worker_threads';
import type { Event } from '../../generated/prisma/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (): Promise<Response> => {
	const res = await prisma.event.findMany({
		orderBy: { startDate: 'asc' }
	});

	const today = new Date();
	const exportDirectoryName = `src/generated/export/export-${today.getFullYear()}-${addPaddingIfNecessary(today.getMonth() + 1)}-${addPaddingIfNecessary(today.getDate())}`;

	if (!existsSync(exportDirectoryName)) mkdirSync(exportDirectoryName, { recursive: true });

	const workersPromises: Promise<void>[] = [];
	for (const event of res) {
		workersPromises.push(processEvent(exportDirectoryName, event));
	}

	await Promise.allSettled(workersPromises)
		.then()
		.catch(e => {
			error(e);
		});

	return new Response();
};

const addPaddingIfNecessary = (num: number) => {
	if (num.toString().length === 1) return '0' + num;
	return num;
};

const processEvent = (outputDirectoryName: string, event: Event): Promise<void> => {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./src/generated/export/worker.js', {
			workerData: {
				outputDirectoryName,
				event
			}
		});

		worker.on('message', resolve);

		worker.on('error', reject);

		worker.postMessage({ outputDirectoryName, event });
	});
};
