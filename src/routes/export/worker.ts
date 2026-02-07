import { writeFileSync } from 'node:fs';
import { parentPort, workerData } from 'node:worker_threads';

const main = () => {
	const { outputDirectoryName, event } = workerData as {
		outputDirectoryName: string;
		event: {
			title: string;
			description: string | null;
			context: string;
			startDate: Date;
			endDate: Date | null;
			impact: boolean;
		};
	};

	let markdown = '';
	markdown += `# ${event.title}\n\n`;
	markdown += `Context: ${event.context}\n`;
	markdown += `Period: ${dateToString(event.startDate)}${event.endDate !== null ? '-' + dateToString(event.endDate) : ''}\n`;
	markdown += `Impact: ${event.impact}\n\n`;
	if (event.description !== null) markdown += event.description;

	writeFileSync(`${outputDirectoryName}/${sanitiseTitle(event.title)}.md`, markdown);
	parentPort?.postMessage(true);
};

const dateToString = (date: Date): string => {
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const sanitiseTitle = (title: string): string => {
	return title.replace(/<|>|:|"|\/|\\|\||\?|\*/g, '@');
};

main();
