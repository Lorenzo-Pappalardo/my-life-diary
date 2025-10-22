<script lang="ts">
	import { columns, type DisplayedEvent } from './columns.js';
	import DataTable from './data-table.svelte';

	const { data } = $props();

	const displayedEvents = data.events.map<DisplayedEvent>((event) => ({
		title: event.title,
		context: event.context,
		date: event.endDate !== null ? `${event.startDate} - ${event.endDate}` : `${event.startDate}`,
		impact: event.impact ? 'Positive' : 'Negative'
	}));
</script>

<DataTable data={displayedEvents} {columns} />
