<script>
    import { onMount } from 'svelte'
    import { chooseInstance, saveLocal, sleep } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'

    import AsyncError from '$lib/AsyncError.svelte'
    import AsyncLoading from '$lib/AsyncLoading.svelte'
    import Videos from '$lib/Videos.svelte'

    let counter = 0
    let retry = false
    let searchTerm

    onMount(async () => searchTerm = window.location.search.split('=')[1])

    const fetchResult = async (instance, searchQuery) => {
        if(!searchQuery) return { error: 'missing search query' }
        if(counter > 10) {
            counter = 0
            return { error: 'is everything OK? too many retries...' }
        }
        try {
            const req = await fetch(`https://${instance}/api/v1/search?q=${searchQuery}`)
            const res = await req.json()
            counter++
            return res
        } catch(err) {
            retry = true
            counter++
        }
    }
    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }

    const disableInstance = () => {
        let index = $store.instances.findIndex(x => x[1].uri === $chosen)
        if(index > -1) $store.instances[index][1].enabled = false
        $store = $store
        $chosen = chooseInstance($store.instances)
        saveLocal()
    }
    const delay = () => setTimeout(() => true, 681)
</script>

{#await fetchResult($chosen, searchTerm)}
    <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{:then videos}
    <Videos {videos} chosen={$chosen} on:empty={() => $chosen = chooseInstance($store.instances)} />
{:catch error}
    <AsyncError {error} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{/await}