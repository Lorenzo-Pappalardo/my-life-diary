<script lang="ts">
	import DataTable from '$lib/components/custom/data-table.svelte';
	import EditButton from '$lib/components/custom/edit-button.svelte';
	import { renderComponent } from '$lib/components/ui/data-table';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { Event } from '../generated/prisma/browser';

	const { data } = $props();

	const displayedEvents = data.events.map<DisplayedEvent>(event => ({
		id: event.id,
		title: event.title,
		context: event.context,
		period: {
			start: event.startDate,
			end: event.endDate
		},
		impact: event.impact
	}));

	const columns: ColumnDef<DisplayedEvent>[] = [
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
		},
		{
			header: 'Actions',
			cell: cell => renderComponent(EditButton, { id: cell.row.original.id })
		}
	];

	type DisplayedEvent = Pick<Event, 'id' | 'title' | 'context' | 'impact'> & {
		period: {
			start: Event['startDate'];
			end: Event['endDate'];
		};
	};
</script>

<DataTable data={displayedEvents} {columns} />
