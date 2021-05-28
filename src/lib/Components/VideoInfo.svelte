<script>
    import { env } from '$lib/config'
    import { convertCount, getAuthorThumbnail, howLongAgo } from '$lib/helper'

    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'
    import LikeIcon from '$lib/Icons/LikeIcon.svelte'
    import AudioOrVideo from '$lib/Components/AudioOrVideo.svelte'
    import Tooltip from '$lib/UI/Tooltip.svelte'
    import DownloadIcon from '$lib/Icons/DownloadIcon.svelte'
    import Subscribe from '$lib/Components/Subscribe.svelte'

    export let chosen
    export let videoAPI

    let isOpen = false
    let isMore = false


    const replaceURLs = text => {
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
        return text.replace(urlRegex, url => {
            let hyperlink = url
            if (!hyperlink.match('^https?:\/\/')) hyperlink = 'http://' + hyperlink
            return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`
        })
    }
    const parseDescription = description => {
        if(!description) return ''
        const newLined = description.split(/\r?\n/)

        let parsed = ''
        newLined.forEach(line => parsed += `${replaceURLs(line)}<br>`)
        return parsed
    }
</script>

{#if videoAPI}
    <!-- {#if env === 'dev'}
        <div>
            <button on:click={() => isOpen = !isOpen}>view videoAPI response</button>
            {#if isOpen}
                <pre>{JSON.stringify(videoAPI, null, 4)}</pre>
            {/if}
        </div>
    {/if} -->
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
                            <LikeIcon fill=var(--text--50) height=23px />
                            <div class="likeCount">{convertCount(videoAPI.likeCount)}</div>
                        </div>
                        <div class="dislike">
                            <LikeIcon fill=var(--text--50) rotate=180deg height=23px />
                            <div class="dislikeCount">{convertCount(videoAPI.dislikeCount)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="authorBar">
            <div class="authorInfo">
                <div class="authorImg">
                    {#if getAuthorThumbnail(chosen, videoAPI.authorThumbnails)}
                        <ImageLoader size=100x100 src={getAuthorThumbnail(chosen, videoAPI.authorThumbnails)} alt={videoAPI.author} />
                    {:else}
                        <div class="empty"></div>
                    {/if}
                </div>
                <div class="authorDetails">
                    <a href="/channel#{videoAPI.authorId}">{videoAPI.author}</a>
                </div>
            </div>
            <Subscribe channelID={videoAPI.authorId} subCount={videoAPI.subCountText} />
        </div>
        <div class="description" class:isMore>
            <p>
                {@html parseDescription(videoAPI.description)}
            </p>
            <div class="readMore" on:click={() => isMore = !isMore}>
                read {isMore ? 'less' : 'more'} ↕
            </div>
        </div>
    </div>
{:else}
... something went wrong, try rotating instance ...
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
}
.empty {
    width: 41px;
    height: 42px;
    background: var(--bg-1)
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
.like, .dislike {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 7px;
    justify-content: space-evenly;
}

/* refresh */
.description {
    color: var(--text--50);
    background: var(--text-130);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all 0.6s ease-in-out;
    max-height: 100px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
}
.description p {
    padding: 7px;
    flex: 1;
    -webkit-mask-image: -webkit-gradient(linear, left 30%, left bottom, from(black), to(rgba(0, 0, 0, 0)));
    mask-image: gradient(linear, left 30%, left bottom, from(black), to(rgba(0, 0, 0, 0)));
    overflow-wrap: anywhere;
}
.description.isMore p {
    -webkit-mask-image: none;
    mask-image: none;
}
.readMore {
    position: absolute;
    bottom: 3px;
    align-items: flex-end;
    padding: 3px;
    background: var(--text--30);
    color: var(--text-180);
    border-radius: 5px;
    cursor: pointer;
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