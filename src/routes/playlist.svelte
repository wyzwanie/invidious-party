<script>
    import { onMount, afterUpdate } from 'svelte'
    import { page } from '$app/stores'
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, validatePlaylistID } from '$lib/helper'

    import AsyncError from '$lib/Components/AsyncError.svelte'
    import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import ListOfVideos from '$lib/Components/ListOfVideos.svelte'
    import Video from '$lib/Components/Video.svelte'
    import VideoInfo from '$lib/Components/VideoInfo.svelte'

    let active = 0
    let currentVideo
    let videoAPI
    let playlistID
    let isPlaylistIDvalid
    let retry = false
    let videoContainer

    const getPlaylistID = () => {
        playlistID = $page.query.get('list')
        isPlaylistIDvalid = validatePlaylistID(playlistID)
    }

    const fetchPlaylist = async (instance, playlistID) => {
        if(!instance) instance = chooseInstance($instances)

        try {
            console.log('start')
            const req = await fetch(`https://${instance}/api/v1/playlists/${playlistID}`)
            const res = await req.json()

            if(res.playlistId && res.videos) {
                currentVideo = res.videos[0].videoId
                videoAPI = await fetchVideo(instance, currentVideo)
                return res
            } else {
                throw new Error(res)
            }
        } catch(err) {
            const index = $instances.findIndex(x => x[0] === instance)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
            throw new Error(err)
        }
    }

	const fetchVideo = async (instance, videoID) => {
        if(!instance) instance = chooseInstance($instances)

        try {
            const req = await fetch(`https://${instance}/api/v1/videos/${videoID}?fields=error,videoId,title,descriptionHtml,published,keywords,viewCount,likeCount,dislikeCount,paid,premium,isFamilyFriendly,author,authorId,authorThumbnails,lengthSeconds,allowRatings,rating,isListed,liveNow,dashUrl,adaptiveFormats,formatStreams,captions,recommendedVideos,subCountText`) //
            const res = await req.json()
            
            if(res.videoId) return res
            else throw new Error('no kurwa???')
		} catch(err) {
            const index = $instances.findIndex(x => x[0] === instance)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
            throw new Error(err)
		}
	}

    const updateCurrentVideo = async e => {
        currentVideo = e.detail
        videoAPI = await fetchVideo($chosen, currentVideo)
    }

    onMount(() => getPlaylistID())
    afterUpdate(() => getPlaylistID())

    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }
</script>

{#if isPlaylistIDvalid}
    <div class="container">
        {#await fetchPlaylist($chosen, playlistID)}
            <AsyncLoading chosen={$chosen} />
        {:then playlist}
            <div class="playlist">
                <!-- <pre>
                    pre: {JSON.stringify(playlist, null, 4)}
                </pre> -->
                <div class="info">
                    <h3>{playlist.title}</h3>
                    <h4><span>by:</span> {playlist.author}</h4>
                </div>
                <div class="wrapper">
                    <div class="video">
                        {#if currentVideo}
                            {#key currentVideo}
                                <div class="top" bind:this={videoContainer}>
                                    <Video chosen={$chosen} {videoAPI} borderRadiusTop={false} />
                                </div>
                                <div class="bottom">
                                    <VideoInfo chosen={$chosen} {videoAPI} />
                                </div>
                            {/key}
                        {/if}
                    </div>
                    <div class="videoList" style="height:{videoContainer ? videoContainer.offsetHeight-1 : 0}px;overflow:auto;">
                        <ListOfVideos {active} chosen={$chosen}
                            videos={playlist.videos}
                            aktiv={playlist.videos.findIndex(x => x.videoId === currentVideo)}
                            on:play={updateCurrentVideo}
                        />
                    </div>
                </div>
            </div>
        {:catch error}
            <AsyncError {error} />
        {/await}
    </div>
{:else}
    ERROR: invalid playlistID
{/if}

<style>
.info {
    padding: 7px;
    background: var(--bg-2);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid var(--border);
    border-bottom: none;
}
.wrapper {
    display: flex;
}
.video {
    flex: 5;
}
.top {
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-bottom-left-radius: 5px;
    border-right: none;
    border-top: none;
}
.videoList {
    flex: 2;
    background: var(--bg-1);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    border-bottom-right-radius: 5px;
}
</style>