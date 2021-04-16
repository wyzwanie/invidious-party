
<script>
    import { lzw_encode, encodeData, saveLocal } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'

    let ipfsNode
    let savedCID
    let result
    let cid

    const initializeNode = async () => ipfsNode = await Ipfs.create()

    const save = async data => {
        if(ipfsNode) savedCID = await ipfsNode.dag.put(data)
        console.log(savedCID)
        // let a = await ipfsNode.key.gen('myKey', {
        //     type: 'ed25519'
        // })
        // console.log(a)

    }
    const get = async cid => {
        if(ipfsNode && cid) result = await ipfsNode.dag.get(cid)
        else return 'not ready yet'
        return result.value
    }
</script>
{!!ipfsNode} {savedCID}<hr>
{#await get(savedCID)}
    ...loading...
{:then result}
    r:{JSON.stringify(result)}
{:catch err}
    e:{err.message}
{/await}


<input bind:value={cid}><button on:click={() => savedCID = cid}>getCID</button>
<button on:click={() => save($store)}>as</button>
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
        <h3>Input RSS for subscription:</h3>
        <input type="text" bind:value={$store.rss}>
    </div>
    <div class="right">
        <h3>Here you own your data</h3>
        This project is completely public and given as a tool to be used.<br>
        It was made possible thanks to brilliant project invidious.io && svelte.<br>
        invidious.party is purely client side app, there are no servers, trackers, no data collection.<br>
        <hr>
        Since you own your data, you will have to take care of it :)<br>
        By default app uses unencrypted localStorage to store information neccessary for application to work.<br>
        So when you switch the browser or clear your browser cache, you would lose your subscriptions/settings.<br>
        Currently to solve this, you can grab below link and bookmark it.<br>
        This link has all your settings/subscriptions encoded.<br>
        ...
    </div>    
</div>

<svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"
        on:load={initializeNode}>
    </script>
</svelte:head>

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