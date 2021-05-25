<script>
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'
    import { getAuthorThumbnail, howLongAgo } from '$lib/_helper'

    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'
    import Loader from '$lib/UI/Loader.svelte'
    import EyeIcon from '$lib/Icons/___EyeIcon.svelte'
    import AudioOrVideo from '$lib/Components/AudioOrVideo.svelte'
    import Tooltip from '$lib/UI/Tooltip.svelte'
    import DownloadIcon from '$lib/Icons/DownloadIcon.svelte'
    import Subscribe from '$lib/Components/Subscribe.svelte'

    export let chosen
    export let videoAPI

    const dispatch = createEventDispatcher()
    const handleRotate = () => {
        error = true
        dispatch('rotate')
    }
    let isOpen = false
    let isMore
</script>
{#if videoAPI}
<button on:click={() => isOpen = !isOpen}>toggle</button>
{#if isOpen}
<pre>{JSON.stringify(videoAPI, null, 4)}</pre>
{/if}
    <div class="info">
        <div class="titleBar">
            <div class="titleWrap">
                <div class="title">
                    <span>{videoAPI.title}</span>
                    <div class="df">
                        <Tooltip text="download">
                            <DownloadIcon fill=var(--text--80) />
                        </Tooltip>
                        <div style="margin-right:11px;"></div>
                        <AudioOrVideo currentMode=video on:changed={e => {}} />
                    </div>
                </div>
                <div class="boxxed">
                    <div class="box">
                        <div class="infoBox">
                            <p><span>Views:</span> {videoAPI.viewCount.toLocaleString()}</p>
                            <p><span>Published:</span> {howLongAgo(videoAPI.published)}</p>
                        </div>
                    </div>
                    <div class="likeBox">
                        <div class="like">
                            <svg version="1.1" id="like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 306.033 306.033" style="enable-background:new 0 0 306.033 306.033;" xml:space="preserve"><path d="M302.997,205.216l0.02-24.171c0-0.245-0.024-0.484-0.036-0.727l-0.013-19.285c0-35.841-29.158-65-65-65	c-0.014,0-0.025,0.002-0.039,0.002h-44.328l15.549-30.896c3.109-6.203,4.752-13.167,4.752-20.14c0-24.813-20.188-45-45-45	c-17.156,0-32.584,9.535-40.264,24.887L92.222,97.713c-2.061-1.065-4.395-1.678-6.875-1.678h-67.33c-8.284,0-15,6.716-15,15v179.998	c0,8.284,6.716,15,15,15h67.33c8.284,0,15-6.716,15-15v-2.122c16.84,11.09,36.693,17.122,57.621,17.122h80	c35.842,0,65-29.159,65-64.988l0.004-5.126c0.018-0.298,0.045-0.594,0.045-0.895L302.997,205.216z M70.347,276.033h-37.33V126.035	h37.33V276.033z M237.968,276.033h-80c-22.529,0-43.313-9.791-57.621-26.989V148.541l55.121-110.234	c2.564-5.123,7.711-8.307,13.434-8.307c8.271,0,15,6.729,15,15c0,2.362-0.529,4.615-1.561,6.675l-26.48,52.617	c-2.34,4.65-2.103,10.181,0.629,14.612c2.73,4.432,7.564,7.131,12.77,7.131h68.709c0.009,0,0.018-0.001,0.025-0.001	c19.287,0.014,34.975,15.709,34.975,35.009l0.029,44.17l-0.029,35.82C272.968,260.332,257.267,276.033,237.968,276.033z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            <div class="likeCount">{videoAPI.likeCount}</div>
                        </div>
                        <div class="dislike">
                            <svg version="1.1" id="dislike" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 306.033 306.033" style="enable-background:new 0 0 306.033 306.033;" xml:space="preserve"><path d="M302.997,205.216l0.02-24.171c0-0.245-0.024-0.484-0.036-0.727l-0.013-19.285c0-35.841-29.158-65-65-65	c-0.014,0-0.025,0.002-0.039,0.002h-44.328l15.549-30.896c3.109-6.203,4.752-13.167,4.752-20.14c0-24.813-20.188-45-45-45	c-17.156,0-32.584,9.535-40.264,24.887L92.222,97.713c-2.061-1.065-4.395-1.678-6.875-1.678h-67.33c-8.284,0-15,6.716-15,15v179.998	c0,8.284,6.716,15,15,15h67.33c8.284,0,15-6.716,15-15v-2.122c16.84,11.09,36.693,17.122,57.621,17.122h80	c35.842,0,65-29.159,65-64.988l0.004-5.126c0.018-0.298,0.045-0.594,0.045-0.895L302.997,205.216z M70.347,276.033h-37.33V126.035	h37.33V276.033z M237.968,276.033h-80c-22.529,0-43.313-9.791-57.621-26.989V148.541l55.121-110.234	c2.564-5.123,7.711-8.307,13.434-8.307c8.271,0,15,6.729,15,15c0,2.362-0.529,4.615-1.561,6.675l-26.48,52.617	c-2.34,4.65-2.103,10.181,0.629,14.612c2.73,4.432,7.564,7.131,12.77,7.131h68.709c0.009,0,0.018-0.001,0.025-0.001	c19.287,0.014,34.975,15.709,34.975,35.009l0.029,44.17l-0.029,35.82C272.968,260.332,257.267,276.033,237.968,276.033z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            <div class="dislikeCount">{videoAPI.dislikeCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="authorBar">
            <div class="authorInfo">
                <div class="authorImg">
                    <ImageLoader src={getAuthorThumbnail(chosen, videoAPI.authorThumbnails)} alt={videoAPI.author} />
                </div>
                <div class="authorDetails">
                    <a href="/channel#{videoAPI.authorId}">{videoAPI.author}</a>
                </div>
            </div>
            <Subscribe channelID={videoAPI.authorId} subCount={videoAPI.subCountText} />
        </div>
        <div class="description" class:isMore on:click={() => isMore = !isMore}>
            <p>{@html videoAPI.descriptionHtml}</p>
        </div>
    </div>
{:else}
...loading...
{/if}

<style>
.boxxed {
    display: flex;
    justify-content: space-between;
}
.infoBox {
    display: flex;
    flex-direction: column;
}
.infoBox p span {
    font-weight: bold;
}
.likeBox {
    display: flex;
    margin-right: -7px;
}

.info {
    border: 1px solid var(--border);
    border-radius: 5px;
    margin-top: 11px;
    color: var(--text--50)
}
.title {
    font-size: 1.618em;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: var(--text--80);
}
.line {
    box-shadow: 0px 2px 4px -3px #ffffff36;
    height: 1px;
}
/* authorBar */
.authorBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 7px;
    background: var(--bg-2);
    box-shadow: 0px 2px 4px -3px #ffffff36;
}
.authorInfo {
    display: flex;
    align-items: center;
    
}
.authorImg {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    margin-bottom: -2px;
    margin-left: 1px;
}
:global(.authorInfo img) {
    width: 42px;
    height: 42px;
    border-bottom-left-radius: 5px;
}
.authorInfo a {
    font-size: 1.382em;
    font-weight: bold;
    margin-left: 7px;
    color: var(--accent-dim);
}
.authorInfo a:hover {
    color: var(--accent)
}

/* titleBar */
.titleBar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: var(--bg-2);
}
.titleWrap {
    display: flex;
    flex-direction: column;
    flex: 1;
}
.like svg, .dislike svg {
    width: 1.382em;
    height: auto;
}
.like, .dislike {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 7px;
    justify-content: space-evenly;
}
.dislike svg {
    transform: rotate(180deg)
}
.like svg path, .dislike svg path {
    fill: var(--text--80);
}

/* refresh */
.description {
    padding: 7px;
    color: var(--text--50);
    background: var(--text-130);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all 0.6s ease-in-out;
    max-height: 69px;
    overflow: hidden;
}
.isMore {
    max-height: 10000px;
}
:global(.description p a) {
    color: var(--accent-dim);
}
:global(.description p a:hover) {
    color: var(--accent);
}
</style>