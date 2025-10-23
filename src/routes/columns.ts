import type { ColumnDef } from '@tanstack/table-core';
import type { Event } from '../generated/prisma/browser';

export const columns: ColumnDef<DisplayedEvent>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
		filterFn: 'includesString',
		sortingFn: 'text'
	},
	{
		accessorKey: 'context',
		header: 'Context',
		filterFn: 'equalsString',
		sortingFn: 'text'
	},
	{
		accessorKey: 'period',
		header: 'Period',
		accessorFn: row => row.period.start,
		cell: cell => {
			const formatter = new Intl.DateTimeFormat(undefined, {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});

			const { start: startDate, end: endDate } = cell.row.original.period;

			let formatted: string = formatter.format(startDate);

			if (endDate !== null) formatted += ` - ${formatter.format(endDate)}`;

			return formatted;
		},
		filterFn: 'equals',
		sortingFn: 'datetime'
	},
	{
		accessorKey: 'impact',
		header: 'Impact',
		cell: cell => (cell.getValue<DisplayedEvent['impact']>() ? 'Positive' : 'Negative'),
		filterFn: 'equals',
		sortingFn: (rowA, rowB) => {
			if (rowA.original.impact === rowB.original.impact) return 0;
			return rowA.original.impact ? 1 : -1;
		}
	}
];

export interface DisplayedEvent {
	title: Event['title'];
	context: Event['context'];
	period: {
		start: Event['startDate'];
		end: Event['endDate'];
	};
	impact: Event['impact'];
}
