<script>
    import { createEventDispatcher } from 'svelte'

    export let chosen
    export let currentPage
    export let searchTerm

    const dispatch = createEventDispatcher()
    const handleSearch = e => {
        if(e.keyCode === 13) window.location.href = `/search?q=${searchTerm}`
    }
</script>

<header>
    <div class="container">
        <div class="topRow">
            <div class="logo" style="color:var(--accent)">
                INVIDIOUS<br><span style="font-weight: 100;font-size: 90%; color: white;">instance: {chosen ? new URL(chosen).hostname : 'loading'}</span>
            </div>
            <div class="search">
                <input type="text" bind:value={searchTerm} placeholder="search" on:keyup={handleSearch}>
            </div>
            <div class="stuff">
                notification/settings
            </div>
        </div>
        <div class="botRow">
            <div class="menu">
                <ul>
                    <li><a href="/" class={currentPage === '/' ? 'active' : ''}>POPULAR</a></li>
                    <li>TRENDING</li>
                    <li>SUBSCRIPTIONS</li>
                    <li>PLAYLISTS</li>
                </ul>
            </div>
        </div>
    </div>
</header>

<style>
    header {
        padding: 9px;
    }
    a {
        color: white;
    }
    .active {
        font-weight: bold;
        color: var(--accent);
    }
    .logo {
        font-weight: bold;
    }
    .topRow {
        display: flex;
        justify-content: space-between;
    }
    .search {
        flex-grow: 0.618;
    }
    input {
        width: 100%;
        background: transparent;
        color: var(--accent);
        font-size: 1.2em;
        border: none;
        border-bottom: 1px solid white;
    }
    input:focus {
        outline: none;
        border-bottom: 2px solid var(--accent)
    }
    
    ul {
        display: flex;
        list-style: none;
        justify-content: center
    }
    li {
        padding: 9px;
    }
</style>