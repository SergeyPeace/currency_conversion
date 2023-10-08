<script lang="ts">
  import { onMount } from 'svelte';

  const BASE_URL: string = 'https://open.er-api.com/v6/latest/';
  
  let secondCurrency: number = 1;

  let firstInput: number = 1;
  let secondInput: number = secondCurrency;
  let currencyNames: string[] = [];
  let rates = {};

  async function currencyRequest(URL: string){
    let response = await fetch(`${BASE_URL}${URL}`);
    if(response.ok){
      response = (await response.json()).rates;
      rates = {...response};
    };
    currencyNames = Object.keys(rates).sort();
    secondCurrency = rates[(document.getElementById('selectSecondCurrency') as HTMLSelectElement).value as keyof typeof rates] || 1;
    secondInput = +(secondCurrency*firstInput).toFixed(2);
  }

	onMount(() => {
    currencyRequest('AED');
	});


  function renderInput(event: any){
    event.target.value = event.target.value.match(/[\d]{1,13}[\.]{0,1}[\d]{0,2}/);
    event.target.id === 'firstInput'
      ? secondInput = +(event.target.value * secondCurrency).toFixed(2)
      : firstInput = +(event.target.value / secondCurrency).toFixed(2); 
  }

  function changingCurrencies(){
    let firstCurrency = document.getElementById('selectFirstCurrency') as HTMLSelectElement;
    let secondCurrency = document.getElementById('selectSecondCurrency') as HTMLSelectElement;

    [firstCurrency.selectedIndex, secondCurrency.selectedIndex] = [secondCurrency.selectedIndex, firstCurrency.selectedIndex];
    currencyRequest(firstCurrency.value);
  }

  function changeSecondCurrency(event: Event){
    secondCurrency = rates[(event.target as HTMLSelectElement).value as keyof typeof rates];
    secondInput = +(firstInput * secondCurrency).toFixed(2);
  }
</script>

<div class="container">
  <div class='container__item'>
    <select id='selectFirstCurrency' on:change={event => currencyRequest(event.currentTarget.value)}>
      {#each currencyNames as currency}
        <option value={currency}>{currency}</option>
      {/each}
    </select>
    <input id='firstInput' type="text" bind:value={firstInput} on:input={renderInput} >
  </div>
  <button class="container__btn" on:click={changingCurrencies}> ⇆ </button>
  <div class='container__item'>
    <select id='selectSecondCurrency' on:change={event => changeSecondCurrency(event)}>
    {#each currencyNames as currency}
      <option value={currency}>{currency}</option>
    {/each}
    </select>
    <input id='secondInput' type="text" bind:value={secondInput} on:input={renderInput}>
  </div>
</div>

<style>
  .container{
    display: flex; 
    align-items: center;
  }
  .container__item{
    display: flex; 
    flex-direction: column;
  }
  .container__btn{
    margin: 0 10px;
  } 

  select:hover{
    cursor: pointer;
  }
</style>