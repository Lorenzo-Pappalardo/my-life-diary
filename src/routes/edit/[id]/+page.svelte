<script lang="ts">
	import EventForm from '$lib/components/custom/event-form.svelte';
	import * as Form from '$lib/components/ui/form';

	const { data } = $props();
</script>

<EventForm {data}>
	<div class="flex gap-1">
		<Form.Button formaction="?/update" class="w-fit">Save</Form.Button>
		<Form.Button formaction="?/delete" class="w-fit" variant="destructive">Delete</Form.Button>
	</div>
</EventForm>
