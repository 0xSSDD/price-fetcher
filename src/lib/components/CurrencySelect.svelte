<script lang="ts">
  import { availableTokens, selectedBase, selectedQuote, isInitialized, currentPrice } from '$lib/stores/Currency';

  export let type: 'base' | 'quote';

  const store = type === 'base' ? selectedBase : selectedQuote;

  // Just reset price when selection changes
  function handleChange() {
      currentPrice.set(null);
  }
</script>

<div class="min-w-[140px]">
  {#if $isInitialized && $availableTokens.length > 0}
      <select
          id={type}
          bind:value={$store}
          on:change={handleChange}
          class="w-full px-4 py-2 bg-[#0F1215] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] appearance-none cursor-pointer"
      >
          {#each $availableTokens as token}
              <option value={token.name}>
                  {token.name.toUpperCase()}
              </option>
          {/each}
      </select>
  {:else}
      <select
          disabled
          class="w-full px-4 py-2 bg-[#0F1215] border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
      >
          <option>Loading...</option>
      </select>
  {/if}
</div>
