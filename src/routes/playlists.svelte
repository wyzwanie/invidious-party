<script>
    import { playlists } from '$lib/Stores/localStore'
    import { searchQuery } from '$lib/Stores/memoryStore'
    
    import Search from '$lib/Components/Search.svelte'
    let error
    let playlistName

    const createPlaylist = () => {
        if($playlists.includes(playlistName)) return error = 'name already exists'

        $playlists = [...$playlists, [playlistName, []]]
        playlistName = ''
    }
</script>

<Search searchQuery={$searchQuery} />

<div class="playlists">
    <div class="info">
        <input type="text" placeholder="playlist name" bind:value={playlistName} />
        <button class="mb-1" on:click={createPlaylist}>Create</button>
        <div class="error">{error ? `ERROR: ${error}` : ''}</div>
    </div>
    <div class="list">
        {#if !$playlists.length}
        <p>You have no saved playlists</p>
        {:else}
            {#each $playlists as p}
                {p}
            {/each}
        {/if}
    </div>
</div>

<style>
    .playlists {
        display: flex;
        flex-direction: column;
    }
    .error {
        height: 16px;
        color: var(--error)
    }
input {
    margin: 0;
    background: var(--bg-1);
    font-size: 14px;
    padding: 11px;
    border: none;
    border: 1px solid var(--border);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    color: var(--text--50);
    font-weight: bold;
    flex: 4;
}
input::placeholder {
    color: var(--text--30);
}
input:focus {
    outline: none;
}
button {
    padding: 12px;
    border: 1px solid var(--border);
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -3px;
}
</style>