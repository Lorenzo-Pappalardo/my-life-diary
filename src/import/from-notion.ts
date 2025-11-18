import { createReadStream, existsSync, mkdirSync, readdir, writeFile } from 'node:fs';
import { createInterface } from 'node:readline';

const regexp = /:\s(.*)$/;
const resultDirectory = 'src/generated/import';

let result = 0;

const readPath = (): Promise<string> => {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise<string>((resolve, reject) => {
		rl.question(`Path to the markdown files: `, rawPath => {
			const cleanPath = rawPath.startsWith('"') ? rawPath.slice(1, -1) : rawPath;

			if (existsSync(cleanPath)) resolve(cleanPath);
			else {
				result = 1;
				reject(new Error(`"${cleanPath}" does not exist.`));
			}

			rl.close();
		});
	});
};

const readFiles = (path: string): Promise<readonly string[]> => {
	return new Promise<readonly string[]>((resolve, reject) => {
		readdir(path, undefined, (error, files) => {
			if (error === null) resolve(files);
			else reject(new Error('No suitable files found.'));
		});
	});
};

const readLineByLine = async (path: string): Promise<readonly string[]> => {
	const fileStream = createReadStream(path);

	const rl = createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const lines: string[] = [];

	for await (const line of rl) lines.push(line);

	return lines;
};

const processFiles = async (basePath: string, files: readonly string[]): Promise<PromiseSettledResult<readonly string[]>[]> => {
	const processed: Promise<readonly string[]>[] = [];

	for (const file of files) {
		processed.push(readLineByLine(`${basePath}/${file}`));
	}

	return await Promise.allSettled(processed);
};

const separateSuccessFromFailure = (
	linesByFile: PromiseSettledResult<readonly string[]>[]
): {
	successfulFiles: (readonly string[])[];
	failedFiles: unknown[];
} => {
	const successfulFiles: (readonly string[])[] = [];
	const failedFiles: unknown[] = [];

	for (const x of linesByFile) {
		if (x.status === 'fulfilled') successfulFiles.push(x.value);
		else failedFiles.push(x.reason);
	}

	return { successfulFiles, failedFiles };
};

const checkOrCreateResultDirectory = () => {
	if (!existsSync(resultDirectory)) {
		mkdirSync(resultDirectory, { recursive: true });
	}
};

const dumpFailures = (failureReasons: unknown[]): Promise<void> => {
	if (failureReasons.length === 0) return Promise.resolve();

	checkOrCreateResultDirectory();

	return new Promise(resolve => {
		writeFile(`${resultDirectory}/failures.txt`, failureReasons.join('\r\n'), 'utf8', () => {
			console.log('Finished dumping failures to file.');
			resolve();
		});
	});
};

const mapToEvent = (lines: readonly string[]): unknown => {
	const dates = regexp.exec(lines[3])?.[1]?.split('-');

	return {
		title: lines[0].substring(2),
		description: lines[6],
		context: regexp.exec(lines[2])?.[1],
		startDate: dates?.[0]?.trim(),
		endDate: dates?.[1]?.trim(),
		impact: regexp.exec(lines[4])?.[1]
	};
};

const writeEventsToFile = (events: unknown[]): Promise<void> => {
	if (events.length === 0) return Promise.resolve();

	checkOrCreateResultDirectory();

	return new Promise((resolve, reject) => {
		writeFile(`${resultDirectory}/events.json`, JSON.stringify(events), error => {
			if (error === null) {
				console.log('Finished writing events to file.');
				resolve();
			} else {
				console.error(error);
				reject(error);
			}
		});
	});
};

const main = async () => {
	try {
		const path = await readPath();
		const files = await readFiles(path);
		const linesByFile = await processFiles(path, files);
		const { successfulFiles, failedFiles } = separateSuccessFromFailure(linesByFile);
		const events = successfulFiles.map(lines => mapToEvent(lines));
		await Promise.allSettled([dumpFailures(failedFiles), writeEventsToFile(events)]);
	} catch (error) {
		console.error(error);
	} finally {
		process.exit(result);
	}
};

await main();
