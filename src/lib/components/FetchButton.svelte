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
    class="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-base cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
    disabled={$isLoading}
  >
    {$isLoading ? 'Fetching...' : 'Get Price'}
  </button>