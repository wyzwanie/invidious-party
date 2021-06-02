<script>
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, Fetcher, filterTable, instanceRequestStatus, log } from '$lib/helper'

    import countryCodes from '$lib/iso3166countryCodes'
    
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'
    
    let error
    let loading
    let retry = false
    
    let country = 'US'
    let type = 'Default'
    let trending
    let oryginalTrending
    let searchTerm

    const fetcher = new Fetcher($chosen, `/trending/?region=${country}&type=${type}&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
    fetcher.on('start', () => loading = true)
    fetcher.on('ok', data => {
        error = loading = false
        trending = oryginalTrending = data
        const updated = instanceRequestStatus($instances, $chosen, 'ok')
        if(updated) $instances = updated
    })
    fetcher.on('err', err => {
        log('trending:fetch', err, 'dev')
        loading = false
        error = err
        const updated = instanceRequestStatus($instances, $chosen, 'fail')
        if(updated) $instances = updated
        retry = true
    })
    
    const runFetcher = (instance, country, type) => {
        if(!instance || fetcher.running) return
        fetcher.instance = instance
        fetcher.url = `/trending/?region=${country}&type=${type}&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`
        fetcher.go()
    }

    $: runFetcher($chosen, country, type)
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        runFetcher($chosen, country, type)
    }

    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'longest', 'newest', 'oldest']
    const typeOptions = ['Default', 'Music', 'Gaming', 'Movies']
    const srchOptions = ['all', 'title', 'author']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="Country:" selected={country} options={countryCodes}  on:change={e => country = e.detail} flex=2 />
        <Filter label="Type:" selected={type} options={typeOptions}  on:change={e => type = e.detail} margin />
        <Filter label="Sort by:" selected=default options={sortOptions} on:change={e => {
            trending = oryginalTrending
            trending = trending.sort(filterTable[e.detail])
        }} margin />
        <Filter label="Search by:" selected=all options={srchOptions} placeholder="search..." on:input={e => {
            trending = oryginalTrending
            searchTerm = e.detail
            if(searchTerm === '') return
            let result = []
            for(let item of trending) {
                if(item.title.toLowerCase().includes(searchTerm) || item.author.toLowerCase().includes(searchTerm)) result.push(item)
            }
            trending = result
            }} search margin flex=2 />
    </div>

    {#if loading}
        <AsyncLoading chosen={$chosen} />
    {:else}
        {#if !error}
            <Videos videos={trending} chosen={$chosen} />
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