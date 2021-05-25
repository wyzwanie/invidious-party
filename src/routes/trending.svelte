<script context="module">
    import { browser } from '$app/env'
    export const router = browser
</script>

<script>
    import { chosen } from '$lib/stores/_memoryStore'
    import { instances } from '$lib/stores/_localStore'
    import { chooseInstance, log } from '$lib/_helper'
    import countryCodes from '$lib/_iso3166countryCodes'
    
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'
    import Loader from '$lib/UI/Loader.svelte'
    
    let retry = false
    let country = 'US'
    let type = 'Default'
    
    const controller = new AbortController()
    const signal = controller.signal

    let currentFetch = 0

    const fetchTrending = async (czozen, country, type) => {
        if(!czozen) czozen = chooseInstance($instances)

        try {
            // type: "music", "gaming", "news", "movies" doesnt work :(
            // region: ISO 3166 country code (default: "US")  
            const req = await fetch(`https://${czozen}/api/v1/trending/?region=${country}&type=${type}&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`, { signal })
            const res = await req.json()
            return res
        } catch(err) {
            log('trending->fetch:error', err, 'dev')
            const index = $instances.findIndex(x => x[0] === czozen)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
        }
    }

    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }

    const disableInstance = () => {}
    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'newest', 'oldest']
    const typeOptions = ['Default', 'Music', 'Gaming', 'Movies']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="Country:" options={countryCodes} selected={country} on:change={e => country = e.detail} flex=2 />
            <Filter label="Type:" options={typeOptions} selected={type} on:change={e => type = e.detail} margin />
        <Filter label="Sort by:" selected=default options={sortOptions} margin />
        <Filter label="Search by:" options={['all', 'title', 'author']} placeholder="search..." on:input={e => console.log(e)} search margin flex=2 />
    </div>
    {#await fetchTrending($chosen, country, type)}
        <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
    {:then videos}
        <Videos {videos} chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
    {:catch error}
        <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
    {/await}
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