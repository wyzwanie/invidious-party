<script>
    import { convertCount, howLongAgo, secToMin } from '$lib/helper'

    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'

    export let chosen
    export let height
    export let videos
</script>

{#if videos && videos.length > 0}
    <div class="related" style="height:{height-73}px; overflow-y:auto">
        {#each videos as video}
            <div class="wrapper">     
                <a class="thumbnail" href="/watch?v={video.videoId}">
                    <ImageLoader size=320x180 src={`https://${chosen}/vi/${video.videoId}/mqdefault.jpg`} alt={video.title} />
                    <div class="duration">{secToMin(video.lengthSeconds)}</div>
                </a>
                <div class="infoBox">
                    <h3 class="title"><a href="/watch?v={video.videoId}">{video.title}</a></h3>
                    <h4 class="author"><a href="/channel#{video.authorId}">{video.author}</a></h4>
                    <div class="stats">
                        <!-- <span>Shared {howLongAgo(video.published)}</span> -->
                        <span>{convertCount(video.viewCount)} views</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="df">
        <p><span style="font-weight: bold">ERROR:</span> Instance returned empty result.</p>
        <p>Click Rotate icon in top right corner, to try on next invidious instance, or</p>
    </div>
{/if}

    
<style>
.related {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: auto;
    border: 1px solid var(--border);
}
.wrapper {
    display: flex;
    background: var(--text-150);
    border-radius: 5px;
    margin-bottom: 5px;
}
.thumbnail {
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    flex: 3;
}
:global(.thumbnail img) {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;;
}
.duration {
    position: absolute;
    bottom: 7px;
    right: 3px;
    background: var(--text-180);
    padding: 3px;
    color: var(--text--80);
}
.infoBox {
    display: flex;
    flex-direction: column;
    padding: 7px;
    flex: 5;
}
.title {
    flex: 1;
    margin-bottom: 7px;
}
.author a {
    font-weight: 400;
    color: var(--accent-dim)
}
.author a:hover {
    color: var(--accent)
}
.stats {
    color: var(--text--80);
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
    font-size: 90%;
}
</style>