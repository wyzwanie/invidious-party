<script>
    import { onMount, afterUpdate } from 'svelte'
    import { page } from '$app/stores'

    import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, Fetcher, instanceRequestStatus, validatePlaylistID, validateVideoID } from '$lib/helper'

    import AsyncError from '$lib/Components/AsyncError.svelte'
    import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import ListOfVideos from '$lib/Components/ListOfVideos.svelte'
    import Video from '$lib/Components/Video.svelte'
    import VideoInfo from '$lib/Components/VideoInfo.svelte'
    
    let loadingPlaylist
    let loadingVideo
    let playlistError
    let videoError
    let retry = false
    let currentVideo
    let playlistID
    let isPlaylistIDvalid
    
    let playlist
    let videoAPI
    let videoContainer
    let active = 0
    let initial
    let innerWidth


    const getPlaylistID = () => {
        if(playlistID !== $page.query.get('list')) playlistID = $page.query.get('list')
        isPlaylistIDvalid = validatePlaylistID(playlistID)
    }

    const handleError = err => {
        if(fetcher.what === 'video') {
            loadingVideo = false
            videoError = err
        }
        if(fetcher.what === 'playlist') {
            loadingPlaylist = false
            playlistError = err
        }
        const updated = instanceRequestStatus($instances, $chosen, 'fail')
        if(updated) $instances = updated
        retry = true
    }

    const fetcher = new Fetcher($chosen, ``)
    fetcher.on('start', url => {
        if(!url) return
        if(fetcher.what === 'video') loadingVideo = true
        if(fetcher.what === 'playlist') loadingPlaylist = true
    })
    fetcher.on('ok', result => {
        if(fetcher.what === 'video') {
            loadingVideo = videoError = false
            videoAPI = result
        }
        if(fetcher.what === 'playlist') {
            loadingPlaylist = playlistError = false
            currentVideo = result.videos[0].videoId
            runFetcher($chosen, currentVideo, 'video')
            playlist = result
        }
        const updated = instanceRequestStatus($instances, $chosen, 'ok')
        if(updated) $instances = updated
    })
    fetcher.on('err', err => handleError(err))

    const runFetcher = (instance, resourceID, what) => {
        if(!instance || !what) return
        if(what === 'playlist' && !isPlaylistIDvalid) return playlistError = 'invalid playlistID'
        if(what === 'video' && !validateVideoID(resourceID)) return videoError = 'invalid videoID'

        fetcher.what = what
        fetcher.instance = instance
        if(fetcher.what === 'video') fetcher.url = `/videos/${resourceID}?fields=error,videoId,title,descriptionHtml,published,keywords,viewCount,likeCount,dislikeCount,paid,premium,isFamilyFriendly,author,authorId,authorThumbnails,lengthSeconds,allowRatings,rating,isListed,liveNow,dashUrl,adaptiveFormats,formatStreams,captions,recommendedVideos,subCountText`
        if(fetcher.what === 'playlist') fetcher.url = `/playlists/${resourceID}`
        fetcher.go()
    }

    const updateCurrentVideo = async e => {
        currentVideo = e.detail
        runFetcher($chosen, currentVideo, 'video')
    }

    const updateHeight = windowWidth => initial = videoContainer ? videoContainer.offsetHeight : 0

    onMount(() => getPlaylistID())
    afterUpdate(() => getPlaylistID())

    $: runFetcher($chosen, playlistID, 'playlist')
    $: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        runFetcher($chosen, playlistID, 'playlist')
    }
    $: if(!initial && !loadingVideo && innerWidth) initial = videoContainer ? videoContainer.offsetHeight : 0
    $: updateHeight(innerWidth)
</script>

<svelte:window bind:innerWidth={innerWidth} />

{#if isPlaylistIDvalid}
    <div class="container">
        {#if loadingPlaylist}
            <AsyncLoading chosen={$chosen} />
        {:else}
            {#if !playlistError}
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
                            {#if currentVideo && validateVideoID(currentVideo)}
                                {#if loadingVideo}
                                    <AsyncLoading chosen={$chosen} />
                                {:else}
                                    {#if !videoError}
                                        <div class="top" bind:this={videoContainer}>
                                            <Video chosen={$chosen} {videoAPI} borderRadiusTop={false} />
                                        </div>
                                        <div class="bottom">
                                            <VideoInfo chosen={$chosen} {videoAPI} />
                                        </div>
                                    {:else}
                                        <AsyncError error={videoError} />
                                    {/if}   
                                {/if}
                            {:else}
                                ERROR: invalid videoID
                            {/if}
                        </div>
                        <div class="videoList {innerWidth < 600 ? 'mobile' : ''}" style="height: {initial}px; overflow:auto;">
                            <ListOfVideos {active} chosen={$chosen}
                                videos={playlist.videos}
                                aktiv={playlist.videos.findIndex(x => x.videoId === currentVideo)}
                                on:play={updateCurrentVideo}
                            />
                        </div>
                    </div>
                </div>
            {:else}
                <AsyncError error={playlistError} />
            {/if}
        {/if}
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