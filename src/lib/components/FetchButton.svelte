<script lang="ts">
  import { selectedBase, selectedQuote, currentPrice, isLoading } from '$lib/stores/Currency';

  async function fetchPrice() {
      if (!$selectedBase || !$selectedQuote) {
          console.error('Base or quote currency not selected');
          return;
      }

      try {
          $isLoading = true;
          const response = await fetch(`/api/prices/${$selectedBase.toLowerCase()}/${$selectedQuote.toLowerCase()}`);
          const data = await response.json();

          if (response.ok) {
              $currentPrice = data.rate;
          } else {
              console.error('Error:', data.error);
              $currentPrice = null;
          }
      } catch (error) {
          console.error('Failed to fetch price:', error);
          $currentPrice = null;
      } finally {
          $isLoading = false;
      }
  }
</script>

<button
  on:click={fetchPrice}
  class="fetch-button"
  disabled={$isLoading}
>
  {$isLoading ? 'Fetching...' : 'Get Price'}
</button>

<style>
  .fetch-button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #4a5568;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1rem;
  }

  .fetch-button:hover {
      background-color: #2d3748;
  }

  .fetch-button:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
  }
</style>
