<script>
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, Fetcher, filterTable, instanceFailedRequest, log } from '$lib/helper'
    
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'

    let error
    let retry = false
    let popular
    let loading
    let searchTerm
    let oryginalPopular

    const fetcher = new Fetcher($chosen, `/popular/?fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
    fetcher.on('start', () => loading = true)
    fetcher.on('ok', data => {
        error = false
        loading = false
        popular = oryginalPopular = data
    })
    fetcher.on('err', err => {
        loading = false
        error = err
        log('popular:fetch', err, 'dev')
        const updated = instanceFailedRequest($instances, $chosen)
        if(updated) $instances = updated
        retry = true
    })

    const runFetcher = instance => {
        if(!instance || fetcher.running) return
        fetcher.instance = instance
        fetcher.go()
    }

    $: runFetcher($chosen)
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        runFetcher($chosen)
    }

    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'longest', 'newest', 'oldest']
    const searchOptions = ['all', 'title', 'author']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="Sort by:" selected=default options={sortOptions} on:change={e => {
            popular = oryginalPopular
            popular = popular.sort(filterTable[e.detail])
        }} />
        <Filter label="Search by:" options={searchOptions} placeholder="search..." on:input={e => {
            popular = oryginalPopular
            searchTerm = e.detail
            if(searchTerm === '') return
            let result = []
            for(let item of popular) {
                if(item.title.toLowerCase().includes(searchTerm) || item.author.toLowerCase().includes(searchTerm)) result.push(item)
            }
            popular = result
            }} search margin />
    </div>

    {#if loading}
        <AsyncLoading chosen={$chosen} />
    {:else}
        {#if !error}
            <Videos videos={popular} chosen={$chosen} />
        {:else}
            ERROR: {JSON.stringify(error)}
        {/if}
    {/if}
</div>

<style>
.filters {
    display: flex;
}
@media (max-width: 600px) {
    .filters {
        flex-direction: column;
    }
}
</style>