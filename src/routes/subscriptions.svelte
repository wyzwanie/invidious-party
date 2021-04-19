<script>
    import { onMount } from 'svelte'
    import { store, chosen, SUBs } from '$lib/_store'
    import { chooseInstance } from '$lib/_helper'
    import Videos from '$lib/Videos.svelte'

    let instances

    const prepareInstancesTable = instanceStore => {
        if(instanceStore) {
            instances = instanceStore.map((curr, index) => {
                if(typeof curr[0] === 'string' && curr[0].length > 0) {
                    return {
                        instance: curr[0],
                        counter: 0
                    }
                }
            })
        }
    }

    // const getSubscriptions = async instances => {
    //     // if($store && store.subscriptions && $store.subscriptions.cid) {
    //     try {
    //         const cid = $store.subscriptions.cid
    //         const result = await $ipfs.dag.get(cid)
    //         return result.value.SUBs
    //     } catch(err) {
    //         return $SUBs
    //     }
    // }

    // const rotateInstances = instances => {
    //     while(go) {
    //         if(i.counter < 3) return i.instance
    //         return false
    //     }
    //     for(let i of instances) {
            
    //     }
    // }

    const fetchSubscriptions = async (ynstancez, SUBs) => {
        if(!SUBs) return { error: 'Missing SUBs list' }
        if(!SUBs.length) return { error: 'No subscriptions' }

        let go = true
        let index = 0

        while(go) {
            // console.log(ynstancez[index].instance, ynstancez[index].counter)
            if(instances[index].counter < 3) {
                try {
                    const req = await fetch(`https://${instances[index].instance}/api/v1/channels/${channelID}`)
                    const res = await req.json()

                    if(res && Object.keys(res).length > 0) {
                        if(res.error && res.error !== 'This channel does not exist.') {
                            instances[index].counter++
                            instances = instances
                        }
                    }
                    return res
                } catch(error) {
                    instances[index].counter++
                    instances = instances
                }
            } else {
                if(index < ynstancez.length - 1) index++
                else {
                    go = false
                    return { error: 'no more instances'}
                }
            }
        }
    }
    $: if(Object.keys($store).length > 0 && $store.instances) prepareInstancesTable($store.instances)
</script>

{#if instances && instances.length}
    {#each $SUBs as channelID, i}
        {channelID}
        <hr>
            {#await fetchChannel(instances, channelID)}
                ...fetching {i+1}/{$SUBs.length}...
            {:then rss} 
                {JSON.stringify(rss)}
            {:catch error}
                {error}
            {/await}
        <hr>
    {/each}
{/if}


<!-- import { chooseInstance } from '$lib/_helper'
import { store, chosen } from '$lib/_store'

let suubFeed = []

// suubs = ['channelID', ...]

const fetchSubscriptions = async channel => {
    if(!$store.rss) return null
    try {
        const channel = 'UC-lHJZR3Gqxm24_Vd_AJ5Yw'
        const subs = await fetch(`https://tube.connect.cafe/feed/channel/${channel}`)
        const text = await subs.text()

        const parser = new DOMParser()
        const xml = parser.parseFromString(text, 'text/xml')
        const feed = xml.getElementsByTagName('entry')[0]
        for(let entry in feed) {
            const videoId = feed.getElementsByTagName('yt:videoId')[0].innerHTML
            const title = feed.getElementsByTagName('title')[0].innerHTML
            const link = feed.getElementsByTagName('link')[0]
            const published = feed.getElementsByTagName('published')[0].innerHTML

            const parsedEntry = { videoId, title, link, published }

            suubFeed = [...suubFeed, parsedEntry]
        }
        console.log(feed)
    } catch(err) {
        console.log(err)
        $chosen = chooseInstance($store.instances)
        fetchSubscriptions()
    }
}

const refresh = async () => {

}
$: console.log(subscriptions) -->
