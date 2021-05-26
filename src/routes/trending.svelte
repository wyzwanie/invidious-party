<script context="module">
    import { browser } from '$app/env'
    export const router = browser
</script>

<script>
    import { chosen, controller } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, ftch, log } from '$lib/helper'
    import countryCodes from '$lib/iso3166countryCodes'
    
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'
    
    let retry = false
    let country = 'US'
    let type = 'Default'
    
    let oryginalFetch

    const fetchTrending = async (instance, country, type) => {
        if(!instance) $chosen = chooseInstance($instances)

        try {
            const req = await fetch(`https://${instance}/api/v1/trending/?region=${country}&type=${type}&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
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

    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }

    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'newest', 'oldest']
    const typeOptions = ['Default', 'Music', 'Gaming', 'Movies']
    const srchOptions = ['all', 'title', 'author']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="Country:" selected={country} options={countryCodes}  on:change={e => country = e.detail} flex=2 />
        <Filter label="Type:" selected={type} options={typeOptions}  on:change={e => type = e.detail} margin />
        <Filter label="Sort by:" selected=default options={sortOptions} margin />
        <Filter label="Search by:" selected=all options={srchOptions} placeholder="search..." on:input={e => console.log(e)} search margin flex=2 />
    </div>
    {#await fetchTrending($chosen, country, type)}
        <AsyncLoading chosen={$chosen} />
    {:then videos}
        <Videos {videos} chosen={$chosen} />
    {:catch error}
        <AsyncError {error} />
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