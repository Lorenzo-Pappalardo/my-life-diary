<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each data.events as event}
	<h2>{event.title}</h2>
	<p>{event.description}</p>
	<p>Context: {event.context}</p>
	<p>Start Date: {event.startDate}</p>
	<p>End Date: {event.endDate}</p>
	<p>Impact: {event.impact ? 'High' : 'Low'}</p>
{/each}
