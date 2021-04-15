<script>
    import { createEventDispatcher } from 'svelte'
    import { convertCount } from '$lib/_helper'
    import Lazy from 'svelte-lazy'

    export let chosen
    export let videos

    const dispatch = createEventDispatcher()

    const secToMin = seconds => {
        let minutes = seconds / 60
        let newMinutes = Math.floor(minutes)
        let newSeconds = Math.round((minutes - newMinutes) * 60)
        newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds
        return `${newMinutes}:${newSeconds}`
    }
    $: if(videos[0].el) console.log(videos[0].el.offsetWidth)
</script>

{#if videos.length > 0}
<div class="videos">
    {#each videos as video}
        <div class="video-outer" bind:this={video.el}>
            <div class="video-inner">
                <div class="card">
                    <a class="thumbnail" href="/watch?v={video.videoId}">
                        <Lazy height={video.el ? video.el.offsetWidth : 0}>
                            <img alt="thumbnail" src="https://{chosen}/vi/{video.videoId}/mqdefault.jpg">
                        </Lazy>
                        <div class="duration">{secToMin(video.lengthSeconds)}</div>
                    </a>
                    <h3 class="title"><a href="/watch?v={video.videoId}">{video.title}</a></h3>
                    <h4 class="author"><a href="/channel#{video.authorId}">{video.author}</a></h4>
                    <div class="stats">
                        <span>Shared {video.publishedText}</span>
                        <span>{convertCount(video.viewCount)}</span>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
{:else}
    No results or an error! <button on:click={() => dispatch('empty')}>Try another instance?</button>
{/if}
<style>    
.videos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.video-outer {
    width: calc(25% - 1em);
    margin-bottom: 1em;
}
.video-inner {
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
}
.stats {
    display: flex;
    justify-content: space-between;
    padding: 7px
}
.stats span {
    font-size: 90%;
    font-weight: bold;
}
.duration {
    position: absolute;
    bottom: 7px;
    right: 3px;
    background: rgba(0,0,0,0.6);
    padding: 3px;
    color: white;
}
.author {
    flex-grow: 1;
    color: var(--accent-hover);
}
</style>