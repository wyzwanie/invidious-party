<script>
    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'

    export let chosen
    export let playlists
</script>

<pre>
    {JSON.stringify(playlists, null, 4)}
</pre>

{#if playlists && playlists.length > 0}
    <div class="playlists">
        {#each playlists as playlist}
            <div class="playlist-outer">
                <div class="playlist-inner">
                    <div class="card">
                        <a class="thumbnail" href="/playlist?list={playlist.playlistId}">
                            <ImageLoader src={`https://${chosen}/vi/${playlist.playlistThumbnail.split('/vi/')[1]}`} alt={playlist.title} />
                        </a>
                        <div class="info">
                            <h3 class="title"><a href="/playlist?list={playlist.playlistId}">{playlist.title}</a></h3>
                            <div class="count">{playlist.videoCount} video{playlist.videoCount > 1 ? 's' : ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{:else}
    No results or an error!
{/if}

<style>
.playlists {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.playlist-outer {
    width: calc(25% - 0.5em);
    margin-bottom: 1em;
}
@media screen and (max-width: 1366px) {
   .playlist-outer {
        width: calc(33% - 0.5em);
        margin-bottom: 1em;
    }
}
@media screen and (max-width: 1000px) {
   .playlist-outer {
        width: calc(50% - 0.5em);
        margin-bottom: 1em;
    }
}
@media screen and (max-width: 768px) {
    .playlists {
        justify-content: center;
    }
   .playlist-outer {
        width: calc(100% - 0.5em);
        margin-bottom: 1em;
    }
}
.playlist-inner {
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
    display: flex;
    justify-content: center;
    align-content: center;
}
:global(.thumbnail img) {
    width: 100%;
    flex-grow: 1;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -3px;
    padding: 7px;
}
.title {
    font-weight: 400;
    display: flex;
    align-items: center;
}
.count {
    color: var(--text--80);
}
</style>