<script lang="ts">
	import EventForm from '$lib/components/custom/event-form.svelte';

	const { params, data } = $props();
</script>

<EventForm {data} isCreate={true} />
