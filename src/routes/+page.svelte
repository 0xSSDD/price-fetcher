<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CurrencySelect from '$lib/components/CurrencySelect.svelte';
  import PriceDisplay from '$lib/components/PriceDisplay.svelte';
  import FetchButton from '$lib/components/FetchButton.svelte';
</script>

<div class="w-full max-w-xl mx-auto p-8 rounded-2xl bg-[#1A1D21] border border-[#FFA500]/20">
  <h1 class="text-2xl font-bold text-center mb-2 text-[#FFA500]">Price Fetcher</h1>
  <p class="text-gray-400 text-center mb-8 text-sm">Real-time cryptocurrency price pairs</p>

  <div class="flex justify-center space-x-4">
    <CurrencySelect type="base" />
    <CurrencySelect type="quote" />
  </div>

  <PriceDisplay />

  <div class="flex justify-center">
    <FetchButton />
  </div>

  <div class="mt-8 pt-4 border-t border-gray-800">
    <div class="flex justify-between items-center text-xs text-gray-500">
      <span>Powered by CoinGecko</span>
      <div class="flex items-center space-x-4">
        <a href="https://github.com/0xSSDD/price-fetcher"
           class="text-[#FFA500] hover:text-[#FFB52E]"
           target="_blank"
           rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </div>
</div>