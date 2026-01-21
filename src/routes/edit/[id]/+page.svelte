<script lang="ts">
	import EventForm from '$lib/components/custom/event-form.svelte';

	const { data } = $props();
</script>

<EventForm {data} />
