<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import EventForm from '$lib/components/custom/event-form.svelte';

	const { data } = $props();
</script>

<EventForm {data}>
	<Form.Button class="w-fit">Save</Form.Button>
</EventForm>
