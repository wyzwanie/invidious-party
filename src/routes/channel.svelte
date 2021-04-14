<script>
	import { chooseInstance, saveLocal } from '$lib/_helper'
	import { store, chosen } from '$lib/_store'
	
	import Loader from '$lib/Loader.svelte'
	import Videos from '$lib/Videos.svelte'

    let loading
    let channel
    let channelID = 'UCsXVk37bltHxD1rDPwtNM8Q'

    const fetchChannel = async instance => {
        if(!$chosen) return false
        try {
            loading = 'fetching channel data...'
            ///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}`)
            channel = await req.json()
            loading = JSON.stringify(channel)
            loading = false
        } catch(err) {
            loading = 'error'
            console.log(err)
            $chosen = chooseInstance($store.instances)
            fetchChannel($chosen)
        }
    }
    $: fetchChannel($chosen)
</script>
{loading}
<button on:click={() => fetchChannel()}>XXX</button>