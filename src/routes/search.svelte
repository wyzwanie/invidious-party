<script>
    import { onMount } from 'svelte'
    import Loader from '$lib/Loader.svelte'
    import Videos from '$lib/Videos.svelte'
    import { chooseInstance, saveLocal } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'

    let searchTerm
    let searchResult
    let loading

    let start
    let end

    onMount(async () => {
        searchTerm = window.location.search.split('=')[1]
    })

    const fetchResult = async searchQuery => {
        start = new Date().getTime()

        loading = true
        try {
            const fetchResponse = await fetch(`${$chosen}api/v1/search?q=${searchQuery}`)
            searchResult = await fetchResponse.json()
            loading = false
        } catch(err) {
            console.log(err)
            $chosen = chooseInstance($store.instances)
            await fetchResult(searchQuery)
            loading = false
        }
    }

    $: if(searchTerm && $chosen) fetchResult(searchTerm)
    $: end = new Date().getTime()

    const disableInstance = () => {
        let index = $store.instances.findIndex(x => x[1].uri === $chosen)
        if(index > -1) $store.instances[index][1].enabled = false
        $store = $store
        $chosen = chooseInstance($store.instances)
        saveLocal()
    }
</script>

{#if loading}
    fetching... from {$chosen}<br>
    {#key end}
        {#if start-end > 1000}
            Instance too slow? <button on:click={disableInstance}>Disable instance</button>
        {/if}
    {/key}
    <Loader />
{:else if searchResult && $chosen}
    <Videos videos={searchResult} chosen={$chosen} on:empty={() => $chosen = chooseInstance($store.instances)} />
{/if}