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

    let searchTerm
    let oryginalFetch = {}
    let retry = false

    const fetchPopular = async czozen => {
        if(!czozen) $chosen = chooseInstance($instances)
        try {
            // type: "music", "gaming", "news", "movies" doesnt work :(
            // region: ISO 3166 country code (default: "US")  
            const req = await fetch(`https://${czozen}/api/v1/popular/?&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
            const res = await req.json()
            oryginalFetch = res
            return res
        } catch(err) {
            log('popular->fetch:error', err, 'dev')
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
        fetchPopular($chosen)
    }

    const disableInstance = () => {}
    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'newest', 'oldest']
    const searchOptions = ['all', 'title', 'author']
</script>

<div class="wrapper">
    {#await fetchPopular($chosen)}
        <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
    {:then videos}
        <div class="filters">
            <Filter label="Sort by:" selected=default options={sortOptions} />
            <Filter label="Search by:" options={searchOptions} placeholder="search..." on:input={e => searchTerm = e.detail} search margin />
        </div>
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