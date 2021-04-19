<script>
    import { onMount } from 'svelte'
    import { store, chosen, ipfs, SUBs } from '$lib/_store'
    import { chooseInstance } from '$lib/_helper'
    import Videos from '$lib/Videos.svelte'

let retry = false
let counter = 0

    const getSubscriptions = async () => {
        // if($store && store.subscriptions && $store.subscriptions.cid) {
        try {
            const cid = $store.subscriptions.cid
            const result = await $ipfs.dag.get(cid)
            return result.value.SUBs
        } catch(err) {
            return $SUBs
        }
    }
    const fetchSubscriptions = async (instance, channelID) => {
        try {
            // instance = 'tube.connect.cafe'
            const req = await fetch(`https://${instance}/feed/channel/${channelID}`)
            const res = await req.text()

            const parser = new DOMParser()
            const xml = parser.parseFromString(text, 'text/xml')
            const feed = xml.getElementsByTagName('entry')[0]
            const suubFeed = []
            
            for(let entry in feed) {
                const videoId = feed.getElementsByTagName('yt:videoId')[0].innerHTML
                const title = feed.getElementsByTagName('title')[0].innerHTML
                const link = feed.getElementsByTagName('link')[0]
                const published = feed.getElementsByTagName('published')[0].innerHTML
                const parsedEntry = { videoId, title, link, published }
                suubFeed = [...suubFeed, parsedEntry]
            }
            console.log(feed)
            return suubFeed
        } catch(err) {
            // counter++
            // retry = true
        }
    }
    $: if($ipfs) getSubscriptions()
    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }
</script>

{#await getSubscriptions()}
    ...fetching from IPFS...
{:then subscriptions}
{JSON.stringify(subscriptions)}
    {#each subscriptions as channelID, i}
    {channelID}
    <hr>
        {#await fetchSubscriptions($chosen, channelID, i)}
            ...fetching {i+1}/{subscriptions.length}...
        {:then rss} 
            {rss}
        {:catch error}
            {error}
        {/await}
    <hr>
    {/each}
{:catch error}
    {error}
{/await}




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
