<script>
    import { createEventDispatcher } from 'svelte'
    import { getAuthorThumbnail } from '$lib/_helper'

    import Lazy from 'svelte-lazy'
    import Loader from '$lib/Loader.svelte'
    import Rotate from '$lib/Rotate.svelte'

    export let chosen
    export let video

    let error = false

    const dispatch = createEventDispatcher()
    const handleRotate = () => {
        error = true
        dispatch('rotate')
    }
</script>
{#if video}
<!-- <pre>{JSON.stringify(video)}</pre> -->
<div class="info">
    <div class="titleBar">
        <div class="left">
            <div class="title">{video.title}</div>
            <div class="viewCount">
                <svg version="1.1" id="views" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 80.794 80.794" style="enable-background:new 0 0 80.794 80.794;" xml:space="preserve"><g>	<g>		<path d="M79.351,38.549c-0.706-0.903-17.529-22.119-38.953-22.119c-21.426,0-38.249,21.216-38.955,22.119L0,40.396l1.443,1.847			c0.706,0.903,17.529,22.12,38.955,22.12c21.424,0,38.247-21.217,38.953-22.12l1.443-1.847L79.351,38.549z M40.398,58.364			c-15.068,0-28.22-13.046-32.643-17.967c4.425-4.922,17.576-17.966,32.643-17.966c15.066,0,28.218,13.045,32.642,17.966			C68.614,45.319,55.463,58.364,40.398,58.364z"/>		<path d="M40.397,23.983c-9.052,0-16.416,7.363-16.416,16.414c0,9.053,7.364,16.417,16.416,16.417s16.416-7.364,16.416-16.417			C56.813,31.346,49.449,23.983,40.397,23.983z M40.397,50.813c-5.744,0-10.416-4.673-10.416-10.417			c0-5.742,4.672-10.414,10.416-10.414c5.743,0,10.416,4.672,10.416,10.414C50.813,46.14,46.14,50.813,40.397,50.813z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <span>{video.viewCount.toLocaleString()} • Published: {video.publishedText} - <span style="font-size: 90%">{new Date(video.published*1000).toLocaleString()}</span></span>
            </div>
        </div>
        <div class="right">
            {#if !video.likeCount}
                <Rotate on:rotate={handleRotate} />
            {/if}
            <div class="like">
                <svg version="1.1" id="like" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 306.033 306.033" style="enable-background:new 0 0 306.033 306.033;" xml:space="preserve"><path d="M302.997,205.216l0.02-24.171c0-0.245-0.024-0.484-0.036-0.727l-0.013-19.285c0-35.841-29.158-65-65-65	c-0.014,0-0.025,0.002-0.039,0.002h-44.328l15.549-30.896c3.109-6.203,4.752-13.167,4.752-20.14c0-24.813-20.188-45-45-45	c-17.156,0-32.584,9.535-40.264,24.887L92.222,97.713c-2.061-1.065-4.395-1.678-6.875-1.678h-67.33c-8.284,0-15,6.716-15,15v179.998	c0,8.284,6.716,15,15,15h67.33c8.284,0,15-6.716,15-15v-2.122c16.84,11.09,36.693,17.122,57.621,17.122h80	c35.842,0,65-29.159,65-64.988l0.004-5.126c0.018-0.298,0.045-0.594,0.045-0.895L302.997,205.216z M70.347,276.033h-37.33V126.035	h37.33V276.033z M237.968,276.033h-80c-22.529,0-43.313-9.791-57.621-26.989V148.541l55.121-110.234	c2.564-5.123,7.711-8.307,13.434-8.307c8.271,0,15,6.729,15,15c0,2.362-0.529,4.615-1.561,6.675l-26.48,52.617	c-2.34,4.65-2.103,10.181,0.629,14.612c2.73,4.432,7.564,7.131,12.77,7.131h68.709c0.009,0,0.018-0.001,0.025-0.001	c19.287,0.014,34.975,15.709,34.975,35.009l0.029,44.17l-0.029,35.82C272.968,260.332,257.267,276.033,237.968,276.033z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <div class="likeCount">{video.likeCount}</div>
            </div>
            <div class="dislike">
                <svg version="1.1" id="dislike" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 306.033 306.033" style="enable-background:new 0 0 306.033 306.033;" xml:space="preserve"><path d="M302.997,205.216l0.02-24.171c0-0.245-0.024-0.484-0.036-0.727l-0.013-19.285c0-35.841-29.158-65-65-65	c-0.014,0-0.025,0.002-0.039,0.002h-44.328l15.549-30.896c3.109-6.203,4.752-13.167,4.752-20.14c0-24.813-20.188-45-45-45	c-17.156,0-32.584,9.535-40.264,24.887L92.222,97.713c-2.061-1.065-4.395-1.678-6.875-1.678h-67.33c-8.284,0-15,6.716-15,15v179.998	c0,8.284,6.716,15,15,15h67.33c8.284,0,15-6.716,15-15v-2.122c16.84,11.09,36.693,17.122,57.621,17.122h80	c35.842,0,65-29.159,65-64.988l0.004-5.126c0.018-0.298,0.045-0.594,0.045-0.895L302.997,205.216z M70.347,276.033h-37.33V126.035	h37.33V276.033z M237.968,276.033h-80c-22.529,0-43.313-9.791-57.621-26.989V148.541l55.121-110.234	c2.564-5.123,7.711-8.307,13.434-8.307c8.271,0,15,6.729,15,15c0,2.362-0.529,4.615-1.561,6.675l-26.48,52.617	c-2.34,4.65-2.103,10.181,0.629,14.612c2.73,4.432,7.564,7.131,12.77,7.131h68.709c0.009,0,0.018-0.001,0.025-0.001	c19.287,0.014,34.975,15.709,34.975,35.009l0.029,44.17l-0.029,35.82C272.968,260.332,257.267,276.033,237.968,276.033z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                <div class="dislikeCount">{video.dislikeCount}</div>
            </div>
            <div class="share"></div>
        </div>
    </div>
    <div class="line"></div>
    <div class="authorBar">
        <div class="authorInfo">
            <div class="wrapper">
                <Lazy placeholder={Loader} >
                    {#if !error}
                        <img
                            src="{getAuthorThumbnail(chosen, video.authorThumbnails)}" alt="{video.author} thumbnail"
                            on:error={() => error = true}
                        >
                    {:else}
                        <Loader />
                    {/if}                
                </Lazy>
            </div>
            <a href="/channel#{video.authorId}">{video.author}</a>
        </div>
        <div class="subcount">{video.subCountText}</div>
    </div>
</div>
{:else}
...loading...
{/if}


<style>

.info {
    background-color: var(--bg-dark-second);
    border: 1px solid var(--light-border);
    border-radius: 5px;
    margin-top: 11px;
}
.title {
    font-size: 1.618em;
    font-weight: bold;
}
.line {
    border-top: 1px solid var(--light-border);
}
/* authorBar */
.authorBar {
    width: 69px;
    height: 69px;
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
}
.authorInfo {
    display: flex;
    align-items: center;
    
}
.wrapper {
    width: 69px;
    height: 69px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.authorInfo img {
    width: 69px;
}
.authorInfo a {
    font-size: 1.382em;
    font-weight: bold;
    /* color: white; */
    margin-left: 7px;
}

/* titleBar */
.titleBar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 7px;
    border-bottom-left-radius: 5px;
}
.titleBar .left {
    display: flex;
    flex-direction: column;
}
.viewCount {
    display: flex;
    align-items: center;
    justify-self: start;
}
svg#views {
    height: 1.618em;
    width: auto;
    margin-right: 0.382em;
    align-self: center;
}
svg#views path {
    fill: white;
}
.right {
    display: flex;
    position: relative;
}
.like svg, .dislike svg {
    width: 1.382em;
    height: auto;
}
.like, .dislike {
    display: flex;
    flex-direction: column;
    justify-items: space-between;
    align-items: center;
    padding: 7px;
    padding: 0 7px;
    justify-content: space-evenly;
}
.dislike svg {
    transform: rotate(180deg)
}
.like svg path, .dislike svg path {
    fill: white;
}

/* refresh */

</style>