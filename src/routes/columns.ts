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
		header: 'Period',
		accessorFn: row => row.period.start.getTime(),
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
		}
	},
	{
		accessorKey: 'impact',
		header: 'Impact',
		cell: cell => (cell.getValue<DisplayedEvent['impact']>() ? 'Positive' : 'Negative')
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
