import type { ColumnDef } from '@tanstack/table-core';
import type { Event } from '../generated/prisma/browser';

export const columns: ColumnDef<DisplayedEvent>[] = [
	{
		accessorKey: 'title',
		header: 'Title'
	},
	{
		accessorKey: 'context',
		header: 'Context'
	},
	{
		accessorKey: 'date',
		header: 'Date'
	},
	{
		accessorKey: 'impact',
		header: 'Impact'
	}
];

export interface DisplayedEvent {
	title: Event['title'];
	context: Event['context'];
	date: string;
	impact: 'Positive' | 'Negative';
}
