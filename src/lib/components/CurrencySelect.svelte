<script lang="ts">
  import { availableTokens, selectedBase, selectedQuote, isInitialized, currentPrice } from '$lib/stores/Currency';

  export let type: 'base' | 'quote';

  const store = type === 'base' ? selectedBase : selectedQuote;

  // Just reset price when selection changes
  function handleChange() {
      currentPrice.set(null);
  }
</script>

<div class="select-container">
  {#if $isInitialized && $availableTokens.length > 0}
      <select
          id={type}
          bind:value={$store}
          on:change={handleChange}
      >
          {#each $availableTokens as token}
              <option value={token.name}>
                  {token.name.toUpperCase()}
              </option>
          {/each}
      </select>
  {:else}
      <select disabled>
          <option>Loading...</option>
      </select>
  {/if}
</div>

<style>
  .select-container {
      min-width: 120px;
  }

  select:disabled {
      opacity: 0.7;
      cursor: wait;
  }
</style>
