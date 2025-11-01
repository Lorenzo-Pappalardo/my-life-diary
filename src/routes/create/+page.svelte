<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();
	const { form: formData, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance>
	<div id="metadata-group">
		<div>
			<label for="title">Title</label>
			<input id="title" type="text" name="title" min="3" max="300" bind:value={$formData.title} />
		</div>

		<div>
			<label for="context">Context</label>
			<select id="context" name="context" bind:value={$formData.context}>
				<option value="Life">Life</option>
				<option value="University">University</option>
				<option value="Baxenergy">BaxEnergy</option>
				<option value="Games">Games</option>
			</select>
		</div>

		<div>
			<label for="start">Start date</label>
			<input id="start" type="date" name="start" bind:value={$formData.start} />
		</div>

		<div>
			<label for="end">End date</label>
			<input id="end" type="date" name="end" bind:value={$formData.end} />
		</div>

		<div>
			<label for="impact">Impact</label>
			<select id="impact" name="impact" bind:value={$formData.impact}>
				<option value={true} selected>Positive</option>
				<option value={false}>Negative</option>
			</select>
		</div>
	</div>

	<div id="description-group">
		<label for="description">Description</label>
		<textarea id="description" name="description" rows="10" bind:value={$formData.description}></textarea>
	</div>

	<button>Save</button>
</form>

<style>
	form {
		display: grid;
		grid-template-areas:
			'metadata'
			'description'
			'save';
		gap: 16px;

		div#metadata-group {
			grid-area: metadata;
		}

		div#description-group {
			grid-area: description;
		}

		div#metadata-group {
			display: grid;
			grid-template-columns: 3fr repeat(4, 1fr);
			gap: 16px;

			> div {
				display: flex;
				flex-direction: column;
			}
		}

		div#description-group {
			display: flex;
			flex-direction: column;
		}

		button {
			grid-area: save;
			justify-self: end;
		}
	}
</style>
