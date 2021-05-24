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

    let retry = false

    const fetchTrending = async country => {
        try {
            // type: "music", "gaming", "news", "movies" doesnt work :(
            // region: ISO 3166 country code (default: "US")  
            const req = await fetch(`https://${$chosen}/api/v1/trending/?region=${country}&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
            const res = await req.json()
            return res
        } catch(err) {
            log('trending->fetch:error', err, 'dev')
            const index = $instances.findIndex(x => x[0] === $chosen)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
        }

}
let country = 'US'
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        fetchTrending(country)
    }

    $: console.log($instances)

    const disableInstance = () => {}
    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'newest', 'oldest']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="select country:" options={countryCodes} selected={country} on:change={e => country = e.detail} />
        <Filter label="sort by:" selected=default options={sortOptions} margin />
    </div>
    {#if $chosen}
        {#await fetchTrending(country)}
            <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:then videos}
            <Videos {videos} chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:catch error}
            <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {/await}
    {/if}
</div>

<style>
    .filters {
        display: flex;
    }
</style>