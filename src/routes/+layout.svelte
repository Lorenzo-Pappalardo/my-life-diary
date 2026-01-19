<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { children } = $props();

	const uploadCallback = () => {};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="app-container">
	<header class="flex items-baseline gap-2 p-0 pb-4">
		<Button href="/" variant="link" class="mr-2 p-0 text-4xl">My life diary</Button>
		<div class="flex flex-[1_0] justify-end">
			<Button href="/create" variant="link" class="p-0">Create event</Button>
		</div>
	</header>

	{@render children?.()}
</div>

<style>
	#app-container {
		display: grid;
		grid-template-areas:
			'header'
			'main';
		height: 100%;

		> header {
			grid-area: header;
		}
	}
</style>
