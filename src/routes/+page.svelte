<script lang="ts">
	import { columns, type DisplayedEvent } from './columns.js';
	import DataTable from './data-table.svelte';

	const { data } = $props();

	const displayedEvents = data.events.map<DisplayedEvent>((event) => ({
		title: event.title,
		context: event.context,
		period: {
			start: event.startDate,
			end: event.endDate
		},
		impact: event.impact
	}));
</script>

<DataTable data={displayedEvents} {columns} />
