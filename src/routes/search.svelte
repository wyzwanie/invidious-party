<script>
    import { onMount } from 'svelte'
    import Loader from '$lib/Loader.svelte'
    import Videos from '$lib/Videos.svelte'
    import { store, chosen } from '$lib/_store'

    let searchTerm
    let searchResult
    let loading

    onMount(async () => {
        console.log(window.location)
        searchTerm = window.location.search.split('=')[1]
    })

    const fetchResult = async searchTerm => {
        loading = true
        try {
            const fetchResponse = await fetch(`${$chosen}api/v1/search?q=${searchTerm}`)
            searchResult = await fetchResponse.json()
            loading = false
        } catch(err) {
            console.log(err)
            store.nextChosen()
            $chosen = $store.chosen
            await fetchResult(searchTerm)
            loading = false
        }
    }

    $: if(searchTerm && $chosen) fetchResult(searchTerm)
    $: console.log('searchTerm', searchTerm)
</script>
{#if loading}
    <Loader />
{:else if searchResult && $chosen}
    <Videos videos={searchResult} chosen={$chosen} on:empty={() => { store.nextChosen();$chosen = $store.chosen; }} />
{/if}