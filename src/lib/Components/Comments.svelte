<script>
    import { onMount } from 'svelte'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, getAuthorThumbnail, howLongAgo, log } from '$lib/helper'

    import LikeIcon from '$lib/Icons/LikeIcon.svelte'
    import Loading from '$lib/UI/Loading.svelte'
    import Tooltip from '$lib/UI/Tooltip.svelte'

    export let chosen
    export let videoID

    let comments = {}
    let loading = false
    let retry = false

    const fetchComments = async (czozen, videoID, continuation = '') => {
        loading = true

        try {
            const req = await fetch(`https://${czozen}/api/v1/comments/${videoID}`)
            const res = await req.json()
            loading = false
            if(res.comments) {
                return {
                    comments: res.comments,
                    continuation: res.continuation,
                    commentCount: res.commentCount
                }
            } else {
                retry = true
                return {
                    error: res.error
                }
            }
        } catch(err) {
            loading = false
            log('comments->fetch:error', err, 'dev')
            const index = $instances.findIndex(x => x[0] === czozen)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
        }
    }

    onMount(async () => {
        comments = await fetchComments(chooseInstance($instances), videoID)
    })

    $: if(retry) {
        retry = false
        ;(async () => {
            comments = await fetchComments(chooseInstance($instances), videoID)
        })()
    }
    const loadReplies = async (commentID, czozen, videoID, continuation) => {
        try {
            const req = await fetch(`https://${czozen}/api/v1/comments/${videoID}?continuation=${continuation}&action=action_get_comment_replies`)
            const res = await req.json()

            const index = comments.comments.findIndex(x => x.commentId === commentID)
            comments.comments[index].replies.data = res  
            comments = comments          
        } catch(err) {
            console.log(err, czozen, videoID, continuation)
        }
    }
    $: console.log(comments)
</script>

<div class="comments">
    {#if loading}
        ... loading comments ...<br>
        <Loading />
    {/if}
    {#if comments && Object.keys(comments).length > 0}
        {#if comments.commentCount > 0}
            {#each comments.comments as c}
                <div class="comment df">
                    <div class="top">
                        <div class="author df">
                            <div class="image">
                                <a href="/channel#{c.authorId}">
                                    <img class={ c.authorIsChannelOwner ? 'owner' : ''} src="{getAuthorThumbnail(chosen, c.authorThumbnails)}" alt="{c.author}" />
                                </a>
                            </div>
                            <div class="info">
                                <div class="name">
                                    <a href="/channel#{c.authorId}">{c.author}</a>
                                </div>
                                <div class="when">{howLongAgo(c.published)}</div>
                            </div>
                        </div>
                        <div class="ytLink">
                            <Tooltip text="view comment on youtube">
                                <a href="https://www.youtube.com/watch?v={videoID}&lc={c.commentId}">[YT]</a>
                            </Tooltip>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="content">
                            {@html c.contentHtml}
                        </div>
                        <div class="infoBox">
                            <div class="likeCount">
                                <LikeIcon fill=var(--text--50) height=16px />
                                <span style="margin-left: 5px;">{c.likeCount}</span>
                            </div>
                            {#if c.replies}
                                <div class="replies" on:click={() => loadReplies(c.commentId, chooseInstance($instances), videoID, c.replies.continuation)}>
                                    View {c.replies.replyCount} {c.replies.replyCount === 1 ? 'reply' : 'replies'}
                                </div>
                            {/if}
                        </div>
                        <div class="repliesList df">
                            {#if c.replies && c.replies.data && c.replies.data.comments}
                                {#each c.replies.data.comments as r}
                                    <div class="reply df">
                                        <div class="replyLeft">
                                            <div class="replyAuthor df">
                                                <div class="image">
                                                    <a href="/channel#{r.authorId}">
                                                        {#if getAuthorThumbnail(chosen, r.authorThumbnails)}
                                                            <img class={ r.authorIsChannelOwner ? 'owner' : ''} src="{getAuthorThumbnail(chosen, r.authorThumbnails)}" alt="{r.author}" />
                                                        {:else}
                                                            <img class={ r.authorIsChannelOwner ? 'owner' : ''} src="{getAuthorThumbnail(chooseInstance($instances), r.authorThumbnails)}" alt="." />
                                                        {/if}
                                                    </a>
                                                </div>
                                                <div class="replyInfo">
                                                    <div class="name">
                                                        <a href="/channel#{r.authorId}">{r.author}</a>
                                                    </div>
                                                    <div class="when">{howLongAgo(r.published)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="replyRight">
                                            <div class="content">
                                                {@html r.contentHtml}
                                            </div>
                                        </div>
                                        <div class="ytLink">
                                            <Tooltip text="view comment on youtube">
                                                <a href="https://www.youtube.com/watch?v={videoID}&lc={r.commentId}">[YT]</a>
                                            </Tooltip>
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            {comments.error}
        {/if}
    {/if}
</div>

<style>
.comments {
    margin-top: 11px;
    background: #181818;
}
.comment {
    flex-direction: column;
    margin: 5.5px 0;
    border: 1px solid var(--border);
    border-radius: 5px;
}
.top {
    background: var(--text-130);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom {
    background: var(--text-100);
    color: var(--text--80);
}
.author {
    align-items: center;
    padding: 3px;
}
.author .image img {
    width: 42px;
    border-radius: 50%;
}
.author .image img.owner {
    border: 2px solid var(--accent)
}
.author .info {
    margin-left: 7px;
}
.author .name a {
    font-weight: bold
}
.author .when {
    color: var(--text--50);
    font-size: 90%;
}
.ytLink {
    padding: 7px;
}
.content {
    padding: 7px;
}
.infoBox {
    background: #161616;
    padding: 7px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
}
.likeCount {
    display: flex;
    color: var(--text--50);
    align-items: center;
}
.replies {
    color: var(--accent-dim);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out
}
.replies:hover {
    color: var(--accent)
}

.reply {
    display: flex;
    background: var(--bg-1);
}
.replyLeft {
    border-right: 1px solid var(--text-100);
}
.replyRight {
    flex: 1;
    margin-left: 7px;
}
.repliesList {
    flex-direction: column;
    margin-left: 42px;
}
.replyAuthor {
    display: flex;
    padding: 5px;
    width: 161px;
}
.replyAuthor .image a img {
    width: 33px;
    border-radius: 50%;
    margin-right: 7px;
}
.replyInfo {
    width: 121px;
}
.replyInfo .name {
    font-size: 90%;
    font-weight: bold;
}
.replyInfo .when {
    font-size: 80%;
    color: var(--text--50);
    font-weight: normal;
}
.reply:nth-child(even) {
    background: var(--bg-0);
}
</style>