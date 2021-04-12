<script>
    import { createEventDispatcher } from 'svelte'

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

    const watchCount = viewCount => {
        if(Math.floor(viewCount/1000) < 1000) return `${Math.floor(viewCount/1000)}K`
        if(Math.floor(viewCount/1000000) < 1000000) return `${Math.floor(viewCount/1000000)}M`
        if(Math.floor(viewCount/1000000000) < 1000000000) return `${Math.floor(viewCount/1000000000)}G`
    }
</script>

{#if videos.length > 0}
<div class="videos">
    {#each videos as video}
        <div class="video-outer">
            <div class="video-inner">
                <div class="card">
                    <a class="thumbnail" href="/watch?v={video.videoId}">
                        <img alt="thumbnail" src="{chosen}vi/{video.videoId}/mqdefault.jpg">
                        <div class="duration">{secToMin(video.lengthSeconds)}</div>
                    </a>
                    <h3 class="title"><a href="/watch?v={video.videoId}">{video.title}</a></h3>
                    <h4 class="author"><a href="{chosen}channel/{video.authorId}">{video.author}</a></h4>
                    <div class="stats">
                        <span>Shared {video.publishedText}</span>
                        <span>{watchCount(video.viewCount)}</span>
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
        /* display: flex;
        flex-direction: row;
        flex-wrap: wrap; */
        width: calc(25% - 1em);
        margin-bottom: 1em;

        /* flex: 1 0 500px;
        box-sizing: border-box;
        margin: 1rem .25em;
        display: flex;
        flex-direction: column; */
    }
    .video-inner {
        display: flex;
        flex-direction: row;
        background: var(--bg-dark-second)
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
        flex-grow: 1;
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
    /* .info {
        display: flex;
        background: var(--bg-dark-second);
        padding: 7px;
    } */
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
    /* @media screen and (min-width: 40em) { 
        .video {
            flex: 0 1 calc(100% - 1em);
        }
    }
    @media screen and (min-width: 85em) {
        .video {
            flex: 0 1 calc(23% - 1em);
        }
    } */
</style>