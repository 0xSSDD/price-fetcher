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
    class="px-6 py-2.5 bg-[#FFA500] hover:bg-[#FFB52E] text-black font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
    disabled={$isLoading}
>
    {$isLoading ? 'Fetching...' : 'Get Price'}
</button>