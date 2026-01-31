import { z } from 'zod';

export const defaults = {
	titleMinCharacters: 3,
	titleMaxCharacters: 500,
	impact: true
};

export const formSchema = z.object({
	title: z.string().min(defaults.titleMinCharacters).max(defaults.titleMaxCharacters),
	description: z.string().optional().nullable(),
	context: z.string(),
	start: z.date(),
	end: z.date().optional().nullable(),
	impact: z.boolean().default(defaults.impact)
});

export type FormSchema = typeof formSchema;
