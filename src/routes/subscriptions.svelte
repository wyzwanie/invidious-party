<script>
    // import { chooseInstance } from '$lib/_helper'
    // import { store, chosen } from '$lib/_store'

    // let suubFeed = []

    // // suubs = ['channelID', ...]

    // const fetchSubscriptions = async channel => {
    //     if(!$store.rss) return null
    //     try {
    //         const channel = 'UC-lHJZR3Gqxm24_Vd_AJ5Yw'
    //         const subs = await fetch(`https://tube.connect.cafe/feed/channel/${channel}`)
    //         const text = await subs.text()

    //         const parser = new DOMParser()
    //         const xml = parser.parseFromString(text, 'text/xml')
    //         const feed = xml.getElementsByTagName('entry')[0]
    //         for(let entry in feed) {
    //             const videoId = feed.getElementsByTagName('yt:videoId')[0].innerHTML
    //             const title = feed.getElementsByTagName('title')[0].innerHTML
    //             const link = feed.getElementsByTagName('link')[0]
    //             const published = feed.getElementsByTagName('published')[0].innerHTML

    //             const parsedEntry = { videoId, title, link, published }

    //             suubFeed = [...suubFeed, parsedEntry]
    //         }
    //         console.log(feed)
    //     } catch(err) {
    //         console.log(err)
    //         $chosen = chooseInstance($store.instances)
    //         fetchSubscriptions()
    //     }
    // }

    // const refresh = async () => {

    // }
    // $: console.log(subscriptions)
    
</script>
<!-- <button on:click={fetchSubscriptions}>click</button> -->

