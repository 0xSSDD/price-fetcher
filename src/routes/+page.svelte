<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CurrencySelect from '$lib/components/CurrencySelect.svelte';
  import PriceDisplay from '$lib/components/PriceDisplay.svelte';
  import FetchButton from '$lib/components/FetchButton.svelte';
</script>

<div class="container">
  <div class="currency-selectors">
    <CurrencySelect type="base" />
    <CurrencySelect type="quote" />
  </div>

  <PriceDisplay />

  <div class="button-container">
    <FetchButton />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .currency-selectors {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .button-container {
    margin-top: 1rem;
    text-align: center;
  }
</style>