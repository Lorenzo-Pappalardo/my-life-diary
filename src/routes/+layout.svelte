<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="p-0 pb-4">
	<Button href="/" variant="link" class="text-4xl p-0">My life</Button>
</header>

{@render children?.()}
