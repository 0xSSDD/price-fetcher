<script lang="ts">
    import { selectedBase, selectedQuote, currentPrice, isLoading } from '$lib/stores/Currency';

    // Don't truncate the price, just use the raw value
    $: {
        if ($currentPrice !== null) {
            console.log(`[Price Display] Raw rate for ${$selectedBase}/${$selectedQuote}:`, $currentPrice);
        }
    }

    // Create the pair string
    $: pair = `${$selectedBase}/${$selectedQuote}`.toLowerCase();
  </script>

  <div class="mt-12 mb-8 text-center">
    <div class="text-gray-400 mb-3">{pair}</div>
    <div class="text-4xl font-medium tracking-tight mb-4">
        {#if $isLoading}
            <span class="text-gray-500 text-2xl">Loading...</span>
        {:else}
            <span class="text-white">{$currentPrice ?? '---'}</span>
        {/if}
    </div>

    <!-- Add price metadata -->
    {#if $currentPrice}
    <div class="flex justify-center space-x-8 text-sm text-gray-400">
        <div>
            <span class="block text-[#FFA500]">Last Updated</span>
            <span>{new Date().toLocaleTimeString()}</span>
        </div>
    </div>
    {/if}
  </div>