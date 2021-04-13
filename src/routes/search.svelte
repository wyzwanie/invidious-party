<script>
    import { onMount } from 'svelte'
    import Loader from '$lib/Loader.svelte'
    import Videos from '$lib/Videos.svelte'
    import { store, chosen } from '$lib/_store'

    let searchTerm
    let searchResult
    let loading

    onMount(async () => {
        searchTerm = window.location.search.split('=')[1]
    })

    const fetchResult = async searchTerm => {
        try {
            loading = true
            const fetchResponse = await fetch(`${$chosen}api/v1/search?q=${searchTerm}`)
            searchResult = await fetchResponse.json()
            loading = false
        } catch(err) {
            console.log(err)
            store.nextChosen()
            $chosen = $store.chosen
            fetchResult(searchTerm)
            loading = false
        }

    }

    $: if(searchTerm && $chosen) fetchResult(searchTerm)
</script>
{#if loading}
    <Loader />
{/if}
{#if searchResult && $chosen}
    <Videos videos={searchResult} chosen={$chosen} on:empty={() => { store.nextChosen();$chosen = $store.chosen; }} />
{/if}