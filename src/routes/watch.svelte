<script>
    import { onMount } from 'svelte'
    import { chooseInstance} from '$lib/_helper'
    import { store, chosen, subStore, ipfs } from '$lib/_store'
    import Chat from '$lib/Chat.svelte'
    import Video from '$lib/Video.svelte'

    let counter = 0
    let retry = false
    let videoID

    onMount(async () => videoID = window.location.search.split('=')[1])
    
    const fetchVideo = async(instance, videoID) => {
        if(!videoID || videoID.length !== 11) return { error: 'Missing or wrong videoID'}
        if(counter > 10) {
            counter = 0
            return { error: 'is everything OK? too many retries...' }
        }

        try {
            const req = await fetch(`https://${instance}/api/v1/videos/${videoID}`)
            const res = await req.json()
            counter ++
            return res
            if(!res || Object.keys(res).length < 1) {
                retry = true
                return { error: 'No data returned' }
            }
            if(res.error && res.error === 'Read timed out') {
                retry = true
                return res
            }
        } catch(err) {
            retry = true
            counter++
        }
    }

    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }
</script>

{#await fetchVideo($chosen, videoID)}
    ...fetching from {$chosen}...
{:then video}
    {#if !video || !video.title}
        {video.error}
        <button on:click={() => {$chosen = chooseInstance($store.instances)}}>Try another instance?</button>
    {:else}
        <div class="top">
            <div class="video">
                <div class="title">{video.title}</div>
                {#if $chosen}
                    <Video chosen={$chosen} {videoID} on:error={() => $chosen = chooseInstance($store.instances)} />
                {/if}
            </div>
            <div class="chat">
                <Chat roomID={videoID} />
            </div>
        </div>
        <div class="bottom">
            <div class="titleBar">
                
                <div class="viewCount">{video.viewCount}</div>
                <div class="published">{video.published} | {video.publishedText}</div>
                <div class="likes">
                    v {video.dislikeCount}<br>
                    ^ {video.likeCount} (refresz?)
                </div>
                {video.author} | <br>
                {video.keywords} | <br>
                <br>
                {video.allowedRegions} <br>
                !{video.dashUrl}<br>
            </div>
        </div>
        <h3>{video.author}</h3>
    {/if}
{:catch error}
    > {error.message}
{/await}

<style>
.top {
    display: flex;
}
.video {
    width: 100%;
}
.chat {
    width: 31.8%;
}
.titleBar {
    background: var(--bg-menus);
    padding: 7px;
}
.title {
    background: rgb(20 20 20);
    padding: 7px;
    font-size: 1.618em;
    font-weight: bold;
    border: 1px solid var(--bg-dark-second);
    border-bottom: none;
    border-right: none;
    border-top-left-radius: 5px;
}
</style>