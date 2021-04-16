<script>
    import { onMount } from 'svelte'
    import { chooseInstance } from '$lib/_helper'
    import { store, chosen } from '$lib/_store'
    import Chat from '$lib/Chat.svelte'
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
    <div class="wrapper">
        <div class="video">
            <Video chosen={$chosen} {videoID} on:error={() => $chosen = chooseInstance($store.instances)} />
        </div>
        <div class="chat">
            <Chat roomID={videoID} />
        </div>
    </div>
    <h3>{author}</h3>
{/if}

<style>
.wrapper {
    display: flex;
}
.video {
    width: 80%;
    margin-right: 11px;
}
</style>