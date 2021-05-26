<script>
    import { createEventDispatcher } from 'svelte'
    import { convertCount, howLongAgo, secToMin } from '$lib/helper'

    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'

    export let chosen
    export let videos

    const dispatch = createEventDispatcher()
</script>

{#if videos && videos.length > 0}
    <div class="videos">
        {#each videos as video}
            <div class="video-outer" bind:this={video.el}>
                <div class="video-inner">
                    <div class="card">
                        <a class="thumbnail" href="/watch?v={video.videoId}">
                            <ImageLoader src={`https://${chosen}/vi/${video.videoId}/mqdefault.jpg`} alt={video.title} />
                            <div class="duration">{secToMin(video.lengthSeconds)}</div>
                        </a>
                        <h3 class="title"><a href="/watch?v={video.videoId}">{video.title}</a></h3>
                        <h4 class="author"><a href="/channel#{video.authorId}">{video.author}</a></h4>
                        <div class="stats">
                            <span>Shared {howLongAgo(video.published)}</span>
                            <span>{convertCount(video.viewCount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
        {#if videos.length % 4 > 0}
            <div style="width: calc({25 * (videos.length % 4)}% - 0.5em)"></div>
        {/if} 
    </div>
{:else}
    <div class="df">
        <p>Instance returned empty result.</p>
        <p style="font-size: 90%">Click Rotate icon in top right corner, to try on next invidious instance, or</p>
        <button on:click={() => dispatch('disable')}>Disable instance</button> so it will not be used, you can change that later in settings.
    </div>
{/if}


<style>
.df {
    flex-direction: column;
    align-items: flex-start;
}
.df p {
    padding: 7px;
}
.videos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.videos::after {
    content: '';
    width: calc(25% - 0.5em);
}
.video-outer {
    width: calc(25% - 0.5em);
    margin-bottom: 1em;
}
@media screen and (max-width: 1366px) {
    .video-outer {
        width: calc(33% - 0.5em);
        margin-bottom: 1em;
    }
}
@media screen and (max-width: 1000px) {
    .video-outer {
        width: calc(50% - 0.5em);
        margin-bottom: 1em;
    }
}
@media screen and (max-width: 768px) {
    .videos {
        justify-content: center;
    }
    .video-outer {
        width: calc(100% - 0.5em);
        margin-bottom: 1em;
    }
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
    justify-content: center;
    align-content: center;
}
:global(.thumbnail img) {
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