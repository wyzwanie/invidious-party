<script>
    import { goto } from '$app/navigation'
    import { createEventDispatcher } from 'svelte'

    import Toggle from './Toggle.svelte'

    export let chosen
    export let currentPage
    export let searchTerm

    const dispatch = createEventDispatcher()
    const handleSearch = e => {
        if(e.keyCode === 13) goto(`/search?q=${searchTerm}`)
    }
    $: searchTerm = decodeURI(searchTerm)
</script>

<header>
    <div class="logo">
        INVIDIOUS<br>
        <span>instance: {chosen ? new URL(chosen).hostname : 'loading'}</span>
    </div>
    <div class="search">
        <input type="text" bind:value={searchTerm} placeholder="search" on:keyup={handleSearch}>
    </div>
    <div class="mode">
        <Toggle on:status={e => dispatch('theme', e.detail)} />
    </div>
    <div class="settings">
        notification/settings
    </div>
</header>
<div class="sidebar">
    <ul class="menu">
        <li><a href="/" class={currentPage === '/' ? 'active' : ''}>POPULAR</a></li>
        <li>TRENDING</li>
        <li>SUB<span style="font-size: 8px;">SCRIPTIONS</span></li>
        <li>PLAYLISTS</li>
    </ul> 
</div>

<style>
    .sidebar {
        position: fixed;
        left: 0;
        top: 55px;
        background: var(--bg-dark-second);
        border-right: 1px solid rgba(255,255,255,0.05);
        width: 96px;
        height: 100%;
    }
    .menu {
        display: flex;
        list-style: none;
        justify-content: center;
        flex-flow: column;
    }
    .menu li {
        padding: 9px;
    }
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.125);
        background: var(--bg-dark-second);
        padding: 9px;
    }
    .logo {
        color: var(--accent);
    }
    .logo span {
        font-weight: 100;
        font-size: 90%;
        color: white;
    }
    .active {
        font-weight: bold;
        color: var(--accent);
    }
    .logo {
        font-weight: bold;
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
</style>