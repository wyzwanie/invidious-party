<script>
    import { createEventDispatcher } from 'svelte'

    export let active
    export let chosen
    export let videos

    const dispatch = createEventDispatcher()

    const extractThumbnail = videoThumbnails => {
        const index = videoThumbnails.findIndex(x => x.quality === 'medium')
        if(index > -1) return videoThumbnails[index].url.split('/vi/')[1]
        else return false
    }
    const handleClick = (videoID, index) => {
        if(active === index) return false
        dispatch('play', videoID)
    }
</script>

{#if videos && chosen}
    {#each videos as video, index}
        <div class="wrapper {active === index ? 'active' : ''}"
            on:click={() => handleClick(videos.Id, index)}>
            <img src="https://{chosen}/vi/{extractThumbnail(video.videoThumbnails)}" alt="{video.thumbnail}">
            <div class="title">{video.title}</div>
        </div>
    {/each}
{/if}

<style>
.wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.125);
    cursor: pointer;
}
.wrapper img {
    height: 5em;
    margin-right: calc(1em * 0.618);
}
.active {
    background: rgba(0,0,0,0.382);
    border: none;
}
</style>