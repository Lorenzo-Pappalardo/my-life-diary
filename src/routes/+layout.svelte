<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="mx-4 my-2 font-bold">
	<Button href="/" variant="link" class="text-4xl">My life</Button>
</header>

{@render children?.()}
