<script lang="ts">
    import { selectedBase, selectedQuote, currentPrice, isLoading } from '$lib/stores/Currency';

    // Don't truncate the price, just use the raw value
    $: {
        if ($currentPrice !== null) {
            console.log(`[Price Display] Raw rate for ${$selectedBase}/${$selectedQuote}:`, $currentPrice);
        }
    }

    // Create the pair string
    $: pair = `${$selectedBase}/${$selectedQuote}`;
  </script>

  <div class="mt-8 text-center">
    <div class="text-lg text-gray-600 mb-2">{pair}</div>
    <div class="text-4xl font-bold">
        {#if $isLoading}
            <span class="text-gray-600 text-2xl font-normal">Loading...</span>
        {:else}
            <span class="text-gray-700">{$currentPrice ?? '---'}</span>
        {/if}
    </div>
  </div>