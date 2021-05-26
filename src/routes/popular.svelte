<script>
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, log } from '$lib/helper'
    
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
	import Videos from '$lib/Components/Videos.svelte'
    import Filter from '$lib/UI/Filter.svelte'

    let searchTerm
    let oryginalFetch = {}
    let retry = false

    const fetchPopular = async instance => {
        if(!instance) $chosen = chooseInstance($instances)

        try {
            const req = await fetch(`https://${instance}/api/v1/popular/?&fields=type,title,videoId,author,authorId,viewCount,published,lengthSeconds`)
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
$: console.log($chosen)
    const disableInstance = () => {}
    const sortOptions = ['default', 'most views', 'least views', 'shortest', 'newest', 'oldest']
    const searchOptions = ['all', 'title', 'author']
</script>

<div class="wrapper">
    <div class="filters">
        <Filter label="Sort by:" selected=default options={sortOptions} />
        <Filter label="Search by:" options={searchOptions} placeholder="search..." on:input={e => searchTerm = e.detail} search margin />
    </div>
    {#await fetchPopular($chosen)}
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