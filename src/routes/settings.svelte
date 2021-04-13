
<script>
    import { chooseInstance } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'

    const saveSettings = () => {
        $store = $store
        const { instances } = $store
        saveData.settings = $store.
		saveData.time = new Date().getTime();
		localStorage.saveData = JSON.stringify(saveData);
		console.log(saveData)
    }
    $: console.log($store.instances)
    $: console.log($chosen)
</script>

<h1>Settings</h1>
<h3>Chose instances rotation:</h3>
    {#if $store && $store.instances && $store.instances.length > 0}
        <ul style="list-style: none;">
            {#each $store.instances as instance, index}
                <li>
                    <input type="checkbox" bind:checked={$store.instances[index].enabled}>
                    <span style="margin-right:7px"></span>
                    {instance[0]}
                    <span style="margin-right:7px"></span>
                    {instance[index].flag}
                </li>
            {/each}
        </ul>
    {/if}
<button on:click={saveSettings}>Save</button>
<button on:click={() => window.location = chosen}>Back To Invidious</button>


<!-- fetch('https://yewtu.be/feed/private?token=RBugBT8LPiRzvjkyXm3NZ2MttL2mk23d_XE1tHQ7C4s=')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = ``;
    items.forEach(el => { -->