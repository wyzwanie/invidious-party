<script>
    import { onMount } from 'svelte'
    import { chooseInstance } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'
    import Video from '$lib/Video.svelte'

    let videoID
    let author
    let loading

    onMount(async () => {
        videoID = window.location.search.split('=')[1]
    })
    
    const fetchVideoInformation = async (instance, videoID) => {
        loading = true
        try {
            const videoResponse = await fetch(`https://${instance}/api/v1/videos/${videoID}`)
            const videoData = await videoResponse.json()
            // console.log('vd', videoData)
            if(videoData && !videoData.author) $chosen = chooseInstance($store.instances)
            author = videoData.title
            loading = false
        } catch(err) {
            // console.log(err)
            $chosen = chooseInstance($store.instances)
            loading = false
        }
    }

    $: if($chosen && videoID) fetchVideoInformation($chosen, videoID)
</script>

{#if loading}
    fetching... from {$chosen}<br>
{:else if videoID && $chosen}
    <Video chosen={$chosen} {videoID} on:error={() => $chosen = chooseInstance($store.instances)} />
    <h3>{author}</h3>
{/if}