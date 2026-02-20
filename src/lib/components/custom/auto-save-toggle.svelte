<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import { onDestroy } from 'svelte';

	let { defaultEnabled = $bindable<boolean>(true), callback = $bindable<() => unknown>() } = $props();

	const getPressed = () => {
		return autoSavingIntervalID !== undefined;
	};

	const setPressed = () => {
		autoSavingIntervalID = handleAutoSave();
	};

	const handleAutoSave: () => undefined | number = () => {
		if (autoSavingIntervalID !== undefined) {
			return disableAutoSave();
		}

		return enableAutoSave();
	};

	const enableAutoSave: () => number = () => {
		const id = window.setInterval(() => {
			callback();
		}, 30000);

		console.log(`Auto-save enabled (#${id})`);
		return id;
	};

	const disableAutoSave: () => undefined = () => {
		console.log('Auto-save disabled');
		window.clearInterval(autoSavingIntervalID);
		return (autoSavingIntervalID = undefined);
	};

	let autoSavingIntervalID: undefined | number = $state(undefined);

	if (defaultEnabled) {
		autoSavingIntervalID = handleAutoSave();
	}

	onDestroy(() => {
		if (autoSavingIntervalID !== undefined) {
			disableAutoSave();
		}
	});
</script>

<Toggle bind:pressed={getPressed, setPressed}>Auto save</Toggle>
