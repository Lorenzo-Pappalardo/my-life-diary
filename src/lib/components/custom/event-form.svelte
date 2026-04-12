<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { ActionResult } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { RouteParams } from '../../../routes/edit/[id]/$types';

	const { params, data, isCreate }: { data: { form: any }; isCreate: boolean; params?: RouteParams } = $props();
	const form = superForm(data.form);
	const { form: formData } = form;
	let formRef: undefined | HTMLFormElement = undefined;
	let autoSavingIntervalID: undefined | ReturnType<typeof globalThis.setInterval>;

	const handleAutoSave: () => ReturnType<typeof globalThis.setInterval> = () => {
		const id = globalThis.setInterval(() => {
			save(
				{
					endpoint: `${params?.id}?/update`,
					data: new FormData(formRef)
				},
				true
			);
		}, 30000);

		console.log(`Auto-save enabled (#${id})`);
		return id;
	};

	const save = async (
		event: FakeEvent | (SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }),
		progressive: boolean = false
	) => {
		let endpoint: string;
		let data: FormData;

		if (isFakeEvent(event)) {
			endpoint = event.endpoint;
			data = event.data;
		} else {
			event.preventDefault();
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

	const getFormattedDate = (rawDate: null | Date): undefined | string => {
		if (!rawDate) return undefined;

		const dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' });

		const { 0: day, 2: month, 4: year } = dateFormat.formatToParts(rawDate);
		return `${year.value}-${month.value}-${day.value}`;
	};

	onMount(() => {
		if (!isCreate) autoSavingIntervalID = handleAutoSave();
	});

	onDestroy(() => {
		if (autoSavingIntervalID !== undefined) {
			globalThis.clearInterval(autoSavingIntervalID);
			console.log(`Auto-save disabled (#${autoSavingIntervalID})`);
		}
	});

	const isFakeEvent = (event: any): event is FakeEvent => {
		return Object.hasOwn(event, 'endpoint');
	};

	interface FakeEvent {
		endpoint: string;
		data: FormData;
	}
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
