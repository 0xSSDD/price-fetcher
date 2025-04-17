<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeTokens, isInitialized } from '$lib/stores/Currency';

	let { children } = $props();

	onMount(() => {
		initializeTokens();
	});
</script>

{#if $isInitialized}
	<div class="min-h-screen bg-[#0F1215] text-white flex items-center justify-center">
		{@render children()}
	</div>
{:else}
	<div class="min-h-screen bg-[#0F1215] text-gray-400 flex items-center justify-center">
		Loading tokens...
	</div>
{/if}
