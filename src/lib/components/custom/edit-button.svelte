<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const { id } = $props();
</script>

<Button href="/edit/{id}" variant="link" class="p-0">Edit</Button>
