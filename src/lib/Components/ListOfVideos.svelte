<script>
    import { createEventDispatcher } from 'svelte'

    export let aktiv
    export let chosen
    export let videos

    const dispatch = createEventDispatcher()

    const extractThumbnail = videoThumbnails => {
        const index = videoThumbnails.findIndex(x => x.quality === 'medium')
        if(index > -1) return videoThumbnails[index].url.split('/vi/')[1]
        else return false
    }

    const handleClick = (videoID, index) => {
        if(aktiv === index) return false
        dispatch('play', videoID)
    }
</script>

{#if videos && chosen}
    {#each videos as video, index}
        <div class="wrapper {aktiv === index ? 'active' : ''}"
            on:click={() => handleClick(video.videoId, index)}>
            <img src="https://{chosen}/vi/{extractThumbnail(video.videoThumbnails)}" alt="{video.thumbnail}">
            <div class="title">{video.title}</div>
        </div>
    {/each}
{/if}

<style>
.wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(241 241 241 / 4%);
    cursor: pointer;
}
.wrapper img {
    height: 5em;
}
.active {
    background: var(--text-130);
    border: none;
}
.active .title {
    color: var(--text--80);
}
.title {
    color: var(--text--50);
    padding: 0 7px;
}
</style>