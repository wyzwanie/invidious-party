<script>
    import { onMount, afterUpdate } from 'svelte'

    import { page } from '$app/stores'
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, Fetcher, instanceRequestStatus } from '$lib/helper'
    import countryCodes from '$lib/iso3166countryCodes'

    import AsyncError from '$lib/Components/AsyncError.svelte'
    import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'
    
    let error
    let loading
    let retry = false

    let searchQuery
    let searchResult
    let searchFilters = {
        sortBy: '',
        uploadDate: '',
        duration: '',
        type: 'video',
        country: ''
    }

    const buildSearchQuery = params => {
        let queryString = '&'
        Object.keys(params).forEach(param => {
            if(params[param]) queryString += `${param}=${params[param]}&`
        })
        return queryString.slice(0, -1)
    }

    const fetcher = new Fetcher($chosen, `/search/?q=${searchQuery}${buildSearchQuery(searchFilters)}`)
    fetcher.on('start', () => loading = true)
    fetcher.on('ok', data => {
        error = loading = false
        searchResult = data
        const updated = instanceRequestStatus($instances, $chosen, 'ok')
        if(updated) $instances = updated
    })
    fetcher.on('err', err => {
        console.log('search:fetchError', err, 'dev')
        loading = false
        error = err
        const updated = instanceRequestStatus($instances, $chosen, 'fail')
        if(updated) $instances = updated
        retry = true
    })

    const runFetcher = (instance, query, params) => {
        if(!instance || !query) return
        fetcher.instance = instance
        fetcher.url = `/search/?q=${searchQuery}${buildSearchQuery(params)}`
        fetcher.go()
    }
        
    onMount(() => searchQuery = $page.query.get('q'))
    afterUpdate(() => searchQuery = $page.query.get('q'))

    $: runFetcher($chosen, searchQuery, searchFilters)
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        runFetcher($chosen, searchQuery, searchFilters)
    }

    const sortByOptions = ['', 'relevance', 'rating', 'upload_date', 'view_count']
    const dateOptions = ['', 'hour', 'today', 'week', 'month', 'year']
    const durationOptions = ['', 'short', 'long']
    const typeOptions = ['all', 'channel', 'playlist','video']
    //todo multiselect
    const featuresOptions = ['hd', 'subtitles', 'creative_commons', '3d', 'live', 'purchased', '4k', '360', 'location', 'hdr']
</script>

<div class="container">
    <div class="filters">
        <Filter label="Type:" selected={searchFilters.type} options={typeOptions} on:change={e => searchFilters.type = e.detail } />
        <Filter label="Sort by:" selected={searchFilters.sortBy} options={sortByOptions} on:change={e => searchFilters.sortBy = e.detail} margin />
        <Filter label="Upload date:" selected={searchFilters.uploadDate} options={dateOptions} on:change={e => searchFilters.uploadDate = e.detail} margin />
        <Filter label="Duration:" selected={searchFilters.duration} options={durationOptions} on:change={e => searchFilters.duration = e.detail} margin />
        <Filter label="Country:" selected={searchFilters.country} options={countryCodes}  on:change={e => searchFilters.country = e.detail} margin />
        <!-- <div class="features">
            <Select items={featuresOptions} placeholder="Select features" isMulti />
        </div> -->
    </div>
    <div class="search">
        {#if searchQuery}
            {#if loading}
                <AsyncLoading chosen={$chosen} />
            {:else}
                {#if !error}
                    <Videos videos={searchResult} chosen={$chosen} />
                {:else}
                    <AsyncError {error} />
                {/if}
            {/if}
        {/if}
    </div>
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