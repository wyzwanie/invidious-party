<script>
    import Select from 'svelte-select'
    import { onMount, afterUpdate } from 'svelte'
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, getQueryString, log } from '$lib/helper'
    import countryCodes from '$lib/iso3166countryCodes'

    import AsyncError from '$lib/Components/AsyncError.svelte'
    import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'
    
    let features
    let oryginalFetch
    let retry = false
    let searchQuery
    let thisFeatures

    let searchFilters = {
        sortBy: '',
        uploadDate: '',
        duration: '',
        type: 'video',
        country: ''
    }


    const sortByOptions = ['', 'relevance', 'rating', 'upload_date', 'view_count']
    const dateOptions = ['', 'hour', 'today', 'week', 'month', 'year']
    const durationOptions = ['', 'short', 'long']
    const typeOptions = ['all', 'channel', 'playlist','video']
    const featuresOptions = ['hd', 'subtitles', 'creative_commons', '3d', 'live', 'purchased', '4k', '360', 'location', 'hdr']

//     q: String
// page: Int32
// sort_by: "relevance", "rating", "upload_date", "view_count"
// date: "hour", "today", "week", "month", "year"
// duration: "short", "long"
// type: "video", "playlist", "channel", "all", (default: video)
// features: "hd", "subtitles", "creative_commons", "3d", "live", "purchased", "4k", "360", "location", "hdr" (comma separated: e.g. "&features=hd,subtitles,3d,live")
// region: ISO 3166 country code (default: "US")

    const buildSearchQuery = params => {
        let queryString = '&'
        Object.keys(params).forEach(param => {
            if(params[param]) queryString += `${param}=${params[param]}&`
        })
        return queryString.slice(0, -1)
    }

    const fetchSearch = async (instance, query, params) => {
        if(!instance) instance = chooseInstance($instances)
// return console.log(`https://${instance}/api/v1/search/?q=${query}${buildSearchQuery(params)}`)
        try {
            const req = await fetch(`https://${instance}/api/v1/search/?q=${query}${buildSearchQuery(params)}`) //&fields
            const res = await req.json()

            if(res.length > 0) {
                oryginalFetch = res
                return res
            } else throw new Error(res)
        } catch(err) {
            log('popular->fetch:error', err, 'dev')
            const index = $instances.findIndex(x => x[0] === instance)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
        }
    }

    onMount(() => {
        searchQuery = getQueryString('q')
        // features = new MultiSelect('.features', {
        //     items: featuresOptions,
        //     placeholder: 'Select features'
        // })
        // features.on('change', e => searchFilters.features = features.getCurrent())
    })
    afterUpdate(() => searchQuery = getQueryString('q'))

    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }

    $: console.log(searchFilters)
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
            {#await fetchSearch($chosen, searchQuery, searchFilters)}
                <AsyncLoading chosen={$chosen} />
            {:then videos}
                <Videos {videos} chosen={$chosen} />
            {:catch error}
                <AsyncError {error} />
            {/await}
        {/if}
    </div>
</div>

<style>
.filters {
    display: flex;
}
</style>