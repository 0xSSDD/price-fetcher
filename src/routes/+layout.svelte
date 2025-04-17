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
	{@render children()}
{:else}
	<div class="loading">
		Loading tokens...
	</div>
{/if}

<style>
	.loading {
		text-align: center;
		padding: 2rem;
		color: #666;
	}
</style>
