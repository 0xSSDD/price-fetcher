<script lang="ts">
  import { availableTokens, selectedBase, selectedQuote, isInitialized, currentPrice } from '$lib/stores/Currency';

  export let type: 'base' | 'quote';

  const store = type === 'base' ? selectedBase : selectedQuote;

  // Just reset price when selection changes
  function handleChange() {
      currentPrice.set(null);
  }
</script>

<div class="min-w-[120px]">
  {#if $isInitialized && $availableTokens.length > 0}
      <select
          id={type}
          bind:value={$store}
          on:change={handleChange}
          class="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          class="w-full p-2 border rounded-md bg-gray-100 cursor-wait opacity-70"
      >
          <option>Loading...</option>
      </select>
  {/if}
</div>
