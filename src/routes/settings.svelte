
<script>
    import { saveLocal } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'
</script>

<h1>Settings</h1>
<div class="wrapper">
    <div class="left">
        <h3>Chose instances rotation:</h3>
        {#if $store && $store.instances && $store.instances.length > 0}
            <ul style="list-style: none;">
                {#each $store.instances as instance, index}
                    <li>
                        <input type="checkbox" bind:checked={$store.instances[index][1].enabled}>
                        <span style="margin-right:7px"></span>
                        {instance[0]}
                        <span style="margin-right:7px"></span>
                        {instance[1].flag}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <div class="right">
        <h3>Input RSS for subscription:</h3>
        <input type="text" bind:value={$store.rss}>
    </div>    
</div>

<button on:click={() => saveLocal({ instances: $store.instances, rss: $store.rss })}>Save</button>
<button on:click={() => window.location = chosen}>Back To Invidious</button>


<!-- fetch('')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = ``;
    items.forEach(el => { -->