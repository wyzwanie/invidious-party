<script>
    export let chosen
    export let videos

    const secToMin = seconds => {
        let minutes = seconds / 60
        let newMinutes = Math.floor(minutes)
        let newSeconds = Math.round((minutes - newMinutes) * 60)
        return `${newMinutes}:${newSeconds}`
    }
</script>

<div class="videos">
    {#each videos as video}
        <div class="video">
            <div class="thumbnail">
                <img alt="thumbnail" src="{chosen}vi/{video.videoId}/mqdefault.jpg">
                <div class="duration">{secToMin(video.lengthSeconds)}</div>
            </div>
            <div class="title">
                <a href="/watch?v={video.videoId}">{video.title}</a>
            </div>
            <div class="author">
                <a href="{chosen}channel/{video.authorId}">{video.author}</a>
            </div>
            <div class="stats">
                {video.publishedText}
                {video.viewCount}
            </div>
        </div>
    {/each}
</div>

<style>
    .videos {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .video {
        flex: 0 23%;
        margin-bottom: 2%;
    }
    .thumbnail {
        position: relative;
    }
    .thumbnail img {
        width: 100%;
    }
    .duration {
        position: absolute;
        bottom: 7px;
        right: 3px;
        background: rgba(0,0,0,0.6);
        padding: 3px;
        color: white;
    }
</style>