<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="p-0 pb-4 flex items-baseline gap-2">
	<Button href="/" variant="link" class="p-0 text-4xl mr-2">My life</Button>
	<div class="flex-[1_0] flex justify-end">
		<Button href="/create" variant="link" class="p-0">Create event</Button>
	</div>
</header>

{@render children?.()}
