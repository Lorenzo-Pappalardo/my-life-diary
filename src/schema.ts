import { z } from 'zod';

export const defaults = {
	titleMinCharacters: 3,
	titleMaxCharacters: 300,
	impact: true
};

export const formSchema = z.object({
	title: z.string().min(defaults.titleMinCharacters).max(defaults.titleMaxCharacters),
	description: z.string().optional(),
	context: z.string(),
	start: z.preprocess((value: string) => new Date(value), z.date()),
	end: z.preprocess((value: string) => new Date(value), z.date()).optional(),
	impact: z.boolean().default(defaults.impact)
});

export type FormSchema = typeof formSchema;
