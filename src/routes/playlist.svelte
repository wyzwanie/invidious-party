<script>
    import { onMount } from 'svelte'
    import { chosen } from '$lib/_store'
    import { instances } from '$lib/_localStore'
    import { chooseInstance } from '$lib/_helper'
    
    import AsyncError from '$lib/AsyncError.svelte'
    import AsyncLoading from '$lib/AsyncLoading.svelte'
    import ListOfVideos from '$lib/ListOfVideos.svelte'
    import Rotate from '$lib/Rotate.svelte'
    import Video from '$lib/Video.svelte'

    let active = 0
    let currentVideo = false
    let left
    let playlistID
    let retry = false

    onMount(async () => playlistID = window.location.search.split('=')[1])

    const fetchPlaylist = (async (instance, playlistID) => {
        if(!playlistID) return { error: 'This playlist does not exist.'}
        if(playlistID.length > 34) return { error: 'Wrong channel ID'}

        try {
            const req = await fetch(`https://${instance}/api/v1/playlists/${playlistID}/`)
            const res = await req.json()

            if(Object.keys(res).length < 1) throw new Error(res.error)
            else {
                currentVideo = res.videos[0].videoId
                return res
            }
        } catch(err) {
            retry = true
        }
    })

    const getPlaylistAge = updated => {
        const diff = Math.floor((Math.floor(new Date().getTime()/1000) - updated))
        const days = diff / (60 * 60 * 24)
        const hours = (days - Math.floor(days)) * 60
        const minutes = (hours - Math.floor(hours)) * 60

        const daysLeft = `${Math.floor(days)} ${Math.floor(days) === 1 ? 'day' : 'days'}`
        const hoursLeft = `${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hour' : 'hours'}`
        const minutesLeft = `${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? 'minute' : 'minutes'}`

        return `${daysLeft} ${hoursLeft} ${minutesLeft} ago`
    }

	const disableInstance = chosen => {
		console.log('disable started')
		new AbortController().abort()
		const index = $instances.findIndex(x => x[0] === chosen)
		$instances[index][1].enabled = false
		$instances = $instances
	}

    $: if(retry) {
        $chosen = chooseInstance($instances)
        retry = false
    }
</script>

{#await fetchPlaylist($chosen, playlistID)}
    <AsyncLoading chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
{:then playlist}
    <div class="playlist">
        <div class="top">
            <h3>{playlist.title}</h3>
            <h4><span>by:</span> {playlist.author}</h4>
        </div>
        <div class="wrapper">
            <div class="left" bind:this={left}>
                {#if currentVideo}
                    <Video chosen={$chosen} videoID={currentVideo} />
                {/if}
            </div>
            <div class="right" style="height:{left ? left.offsetHeight : 0}px;overflow:auto;">
                <ListOfVideos {active} chosen={$chosen} videos={playlist.videos} aktiv={playlist.videos.findIndex(x => x.videoId === currentVideo)}
                    on:play={e => currentVideo = e.detail}
                />
            </div>
        </div>
    </div>
{:catch error}
    <AsyncError {error} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
{/await}

<style>
h3, h4 {
    margin: 0;
}
.wrapper {
    display: flex;
    flex-flow: row;
}
.top {
    background: rgb(0 0 0 / 35%);
    padding: 0.618em;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.left {
    width: 69%;
    border-bottom-left-radius: 5px;
    align-self: start;
}
.right {
    width: 31%;
    background: var(--bg-dark-second);
    border-bottom-right-radius: 5px;
}
::-webkit-scrollbar {
 width: 7px;
 height: 7px;
}
::-webkit-scrollbar-thumb {
 background: var(--accent);
 border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover{
 background: #cb1ee6;
}
::-webkit-scrollbar-track{
 background: var(--bg-dark-second);
 border-radius: 10px;
}
</style>