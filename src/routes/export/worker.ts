import { writeFileSync } from 'node:fs';
import { workerData } from 'node:worker_threads';

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

const dateToString = (date: Date): string => {
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

let markdown = '';
markdown += `# ${event.title}\n\n`;
markdown += `Context: ${event.context}\n`;
markdown += `Period: ${dateToString(event.startDate)}${event.endDate !== null ? '-' + dateToString(event.endDate) : ''}\n`;
markdown += `Impact: ${event.impact}\n\n`;
markdown += event.description;

writeFileSync(`${outputDirectoryName}/${event.title}.md`, markdown);
