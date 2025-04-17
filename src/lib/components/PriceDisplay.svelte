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

<div class="price-display">
  <div class="pair">{pair}</div>
  <div class="price">
      {#if $isLoading}
          <span class="loading">Loading...</span>
      {:else}
          <span class="amount">{$currentPrice ?? '---'}</span>
      {/if}
  </div>
</div>

<style>
  .price-display {
      margin-top: 2rem;
      text-align: center;
  }

  .pair {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 0.5rem;
  }

  .price {
      font-size: 2.5rem;
      font-weight: bold;
  }

  .loading {
      color: #666;
      font-size: 1.5rem;
      font-weight: normal;
  }

  .amount {
      color: #2d3748;
  }
</style>
