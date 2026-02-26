<script lang="ts">
	import AutoSaveToggle from '$lib/components/custom/auto-save-toggle.svelte';
	import EventForm from '$lib/components/custom/event-form.svelte';
	import * as Form from '$lib/components/ui/form';

	const { data } = $props();
	let submitButtonRef: null | HTMLElement = $state(null);

	const handleAutoSave = () => {
		submitButtonRef?.click();
		setTimeout(() => {
			document.getElementById('description')?.focus();
		}, 200);
	};
</script>

<EventForm {data}>
	<div class="flex gap-1">
		<AutoSaveToggle callback={handleAutoSave} />
		<Form.Button bind:ref={submitButtonRef} formaction="?/update" class="w-fit">Save</Form.Button>
		<Form.Button formaction="?/delete" class="w-fit" variant="destructive">Delete</Form.Button>
	</div>
</EventForm>
