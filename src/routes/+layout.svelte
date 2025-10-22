<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<a href="/" style="text-decoration: none; color: inherit;"><h1>My life</h1></a>
</header>

{@render children?.()}
