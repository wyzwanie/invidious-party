<script>
    import { onMount } from 'svelte'
    import { store, chosen, subStore, ipfs } from '$lib/_store'
    import { chooseInstance,  } from '$lib/_helper'
    import ListOfVideos from '$lib/ListOfVideos.svelte'
    import Video from '$lib/Video.svelte'

    let playlistID
    let counter = 0
    let currentVideo = false
    let retry = false
    let left
    let active = 0

    onMount(async () => playlistID = window.location.search.split('=')[1])

    const fetchPlaylist = (async (instance, playlistID) => {
        if(!playlistID) return { error: 'This playlist does not exist.'}
        if(playlistID.length > 34) return { error: 'Wrong channel ID'}
        if(counter > 10) return { error: 'is everything OK? too many retries...' }

        try {
            const req = await fetch(`https://${instance}/api/v1/playlists/${playlistID}/`)
            const res = await req.json()

            if(res && Object.keys(res).length > 0) {
                if(res.error && res.error !== 'This playlist does not exist.') {
                    // retry = true
                    counter++
                }
                currentVideo = res.videos[0].videoId
                console.log(currentVideo)
                return res
            }
            return res
        } catch(err) {
            retry = true
            counter++
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

    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }
</script>

{#await fetchPlaylist($chosen, playlistID)}
    ... loading ...
    {:then playlist}
        {#if playlist.error}
            {playlist.error}<br>
            <button on:click={() => {$chosen = chooseInstance($store.instances)}}>Try another instance?</button>
        {:else}
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
                        <ListOfVideos {active} chosen={$chosen} videos={playlist.videos}
                            on:play={e => currentVideo = e.detail}
                        />
                    </div>
                </div>
            </div>
        {/if}
    {:catch error}
    > {error.message}
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