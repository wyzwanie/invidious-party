<script>
    import { createEventDispatcher } from 'svelte'
    import { convertCount } from '$lib/_helper'
    import Lazy from 'svelte-lazy'

    export let chosen
    export let playlists

    let vw

    const dispatch = createEventDispatcher()
</script>

<svelte:window bind:innerWidth={vw} />

{#if vw && playlists.length > 0}
    <div class="playlists">
        {#each playlists as playlist}
            <div class="playlist-outer" bind:this={playlist.el}>
                <div class="playlist-inner">
                    <div class="card">
                        <a class="thumbnail" href="/playlist?list={playlist.playlistId}">
                            <Lazy height={Math.floor(vw*0.11)} placeholder=...loading...>
                                <img alt="thumbnail" src="https://{chosen}/vi/{playlist.playlistThumbnail.split('/vi/')[1]}">
                            </Lazy>
                            <div class="count">{playlist.videoCount} video{playlist.videoCount > 1 ? 's' : ''}</div>
                        </a>
                        <h3 class="title"><a href="/playlist?list={playlist.playlistId}">{playlist.title}</a></h3>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{:else}
    No results or an error! <button on:click={() => dispatch('empty')}>Try another instance?</button>
{/if}

<style>
:global(.svelte-lazy) {
    width: 100%;
}
.playlists {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.playlist-outer {
    width: calc(25% - 1em);
    margin-bottom: 1em;
}
.playlist-inner {
    display: flex;
    flex-direction: row;
    background: rgb(0 0 0 / 35%);
    border-radius: 5px;
}
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.thumbnail {
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
}
.thumbnail img {
    width: 100%;
    /* height: 215px; */
    flex-grow: 1;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.title {
    font-weight: 400;
    flex-grow: 1;
    margin: 0;
    padding: 7px;
    height: 38px;
}
.author {
    margin: 0;
    padding: 7px;
    flex-grow: 1;
    color: white;
}
.author a {
    color: white;
}
.count {
    position: absolute;
    bottom: 7px;
    right: 3px;
    background: rgba(0,0,0,0.6);
    padding: 3px;
    color: white;
}
</style>