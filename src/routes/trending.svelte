<script context="module">
    import { browser } from '$app/env'
    export const router = browser
</script>

<script>
    import { chosen } from '$lib/stores/_memoryStore'
    import { instances, instancesUpdatedAt } from '$lib/stores/_localStore'
    import { chooseInstance, getInstances, log } from '$lib/_helper'

    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'

    let retry = false

    const fetchTrending = async () => {
        try {
            const req = await fetch(`https://${$chosen}/api/v1/trending/?fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
            const res = await req.json()
            return res
        } catch(err) {
            log('trending->fetch:error', err, 'dev')
            const index = $instances.findIndex(x => x[0] === $chosen)
            if(index < 0) return retry = true
            $instances[index].failedRequests++
            $instances[index].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
        }
        // type: "music", "gaming", "news", "movies"
// region: ISO 3166 country code (default: "US")  

    }
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        fetchTrending()
    }

    // chooseInstance($instances)
    let a
    fetchTrending().then(x => a = x)
    $: console.log($instances)

    const disableInstance = () => {}
</script>

<div class="wrapper">
    {#if chosen}
        {#await fetchTrending($chosen)}
            <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:then videos}
            <Videos {videos} chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:catch error}
            <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {/await}
    {/if}
</div>
<!-- 
<div>
    {#key a}
<pre>
    {JSON.stringify(a, null, 4)}
</pre>
{/key}
</div> -->