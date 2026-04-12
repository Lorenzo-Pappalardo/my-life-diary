<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { ActionResult } from '@sveltejs/kit';
	import { superForm } from 'sveltekit-superforms';
	import { Toggle } from '../ui/toggle';

	const { data, isCreate }: { data: any /* Replace with correct type */; isCreate: boolean } = $props();
	const form = superForm(data.form);
	const { form: formData } = form;
	let autoSavingIntervalID: undefined | ReturnType<typeof globalThis.setInterval> = $state(undefined);
	let formRef: undefined | HTMLFormElement = $state(undefined);

	const getFormattedDate = (rawDate: null | Date): undefined | string => {
		if (!rawDate) return undefined;

		const dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' });

		const { 0: day, 2: month, 4: year } = dateFormat.formatToParts(rawDate);
		return `${year.value}-${month.value}-${day.value}`;
	};

	const getPressed = () => {
		return autoSavingIntervalID !== undefined;
	};

	const setPressed = () => {
		autoSavingIntervalID = handleAutoSave();
	};

	const handleAutoSave: () => undefined | ReturnType<typeof globalThis.setInterval> = () => {
		if (autoSavingIntervalID !== undefined) {
			return disableAutoSave();
		}

		return enableAutoSave();
	};

	const enableAutoSave: () => ReturnType<typeof globalThis.setInterval> = () => {
		const id = globalThis.setInterval(() => {
			save(undefined, true);
		}, 30000);

		console.log(`Auto-save enabled (#${id})`);
		return id;
	};

	const disableAutoSave: () => undefined = () => {
		console.log('Auto-save disabled');
		window.clearInterval(autoSavingIntervalID);
		return (autoSavingIntervalID = undefined);
	};

	const save = async (event?: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }, progressive: boolean = false) => {
		event?.preventDefault();

		let endpoint: string;
		let data: FormData;

		if (event === undefined) {
			endpoint = isCreate ? '/create' : `285?/update`;
			data = new FormData(formRef);
		} else {
			endpoint = isCreate ? event.currentTarget.action : `${event.currentTarget.action}?/update`;
			data = new FormData(event.currentTarget, event.submitter);
		}

		const response = await fetch(endpoint, {
			method: 'POST',
			body: data
		});

		if (!progressive) {
			const result: ActionResult = deserialize(await response.text());

			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
			}

			applyAction(result);
		}
	};

	if (!isCreate)
		// Auto-saving by default
		autoSavingIntervalID = handleAutoSave();
</script>

<form bind:this={formRef} class="h-fit" method="POST" onsubmit={save}>
	<div id="metadata-group">
		<Form.Field {form} name="title">
			<Form.Control>
				<Form.Label>Title</Form.Label>
				<Input id="title" type="text" name="title" min="3" max="500" bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="context">
			<Form.Control>
				<Form.Label>Context</Form.Label>
				<NativeSelect.Root id="context" name="context" bind:value={$formData.context}>
					<NativeSelect.Option value="Life">Life</NativeSelect.Option>
					<NativeSelect.Option value="University">University</NativeSelect.Option>
					<NativeSelect.Option value="Games">Games</NativeSelect.Option>
					<NativeSelect.Option value="Baxenergy">BaxEnergy</NativeSelect.Option>
					<NativeSelect.Option value="Tricentis">Tricentis</NativeSelect.Option>
				</NativeSelect.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="start">
			<Form.Control>
				<Form.Label>Start date</Form.Label>
				<Input
					id="start"
					type="date"
					name="start"
					bind:value={
						() => getFormattedDate($formData.start),
						newDate => {
							$formData.start = newDate;
						}
					} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="end">
			<Form.Control>
				<Form.Label>End date</Form.Label>
				<Input
					id="end"
					type="date"
					name="end"
					bind:value={
						() => getFormattedDate($formData.end),
						newDate => {
							$formData.end = newDate;
						}
					} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="context">
			<Form.Control>
				<Form.Label>Impact</Form.Label>
				<NativeSelect.Root id="impact" name="impact" bind:value={$formData.impact}>
					<NativeSelect.Option value={true} selected>Positive</NativeSelect.Option>
					<NativeSelect.Option value={false}>Negative</NativeSelect.Option>
				</NativeSelect.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div id="description-group">
		<Form.Field {form} name="description">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea id="description" name="description" rows={10} bind:value={$formData.description} autofocus></Textarea>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex gap-1">
		{#if !isCreate}
			<Toggle bind:pressed={getPressed, setPressed}>Auto save</Toggle>
		{/if}
		<Form.Button class="w-fit" formaction={isCreate ? '?/create' : '?/update'}>{isCreate ? 'Create' : 'Update'}</Form.Button>
		{#if !isCreate}
			<Form.Button formaction="?/delete" class="w-fit" variant="destructive">Delete</Form.Button>
		{/if}
	</div>
</form>

<style>
	form {
		display: grid;
		grid-template-areas:
			'metadata'
			'description';
		grid-template-rows: min-content;

		div#metadata-group {
			grid-area: metadata;
			display: grid;
			grid-template-columns: 3fr repeat(4, 1fr);
			gap: 16px;
		}

		div#description-group {
			grid-area: description;
			display: flex;
			flex-direction: column;
		}
	}
</style>
