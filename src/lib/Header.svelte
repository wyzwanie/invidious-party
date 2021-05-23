<script>
    import { createEventDispatcher } from 'svelte'
    import { sleep } from '$lib/_helper'

    import Toggle from './Toggle.svelte'
    import Git from '$lib/Icons/Git.svelte'
    import Drop from '$lib/Icons/Drop.svelte'
    import Settings from '$lib/Icons/Settings.svelte'

    export let chosen
    export let currentPage
    export let searchTerm
    export let consent

    let rotate = false
    let isOpen = true
    let vw = false
    
    const dispatch = createEventDispatcher()
    
    const handleSearch = e => {
        if(e.keyCode === 13) window.location.href = `/search?q=${searchTerm}`
    }
    const changeInstance = async () => {
        dispatch('changeInstance')
        rotate = true
        await sleep(1000)
        rotate = false
    }
</script>

<svelte:window bind:innerWidth={vw} />

<header>
    <div class="logo">
        invidious.party<span style="font-size: 69%; color: unset;">&nbsp;v0.6.3</span><br>
        <span>instance: {#if chosen}<a style="color: white;" href="{chosen}">{chosen}</a>{:else}...initializing...{/if}</span>
        <br><span>mode: {consent ? consent : 'no consent'}</span>
    </div>
    <div class="search">
        <input type="text" bind:value={searchTerm} placeholder="search" on:keyup={handleSearch}>
    </div>
    <div class="refresh">
        {#if vw}
            <svg class:rotate on:click={changeInstance} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492.883 492.883" style="enable-background:new 0 0 492.883 492.883;" xml:space="preserve"><g><g><path d="M122.941,374.241c-20.1-18.1-34.6-39.8-44.1-63.1c-25.2-61.8-13.4-135.3,35.8-186l45.4,45.4c2.5,2.5,7,0.7,7.6-3 l24.8-162.3c0.4-2.7-1.9-5-4.6-4.6l-162.4,24.8c-3.7,0.6-5.5,5.1-3,7.6l45.5,45.5c-75.1,76.8-87.9,192-38.6,282 c14.8,27.1,35.3,51.9,61.4,72.7c44.4,35.3,99,52.2,153.2,51.1l10.2-66.7C207.441,421.641,159.441,407.241,122.941,374.241z"/><path d="M424.941,414.341c75.1-76.8,87.9-192,38.6-282c-14.8-27.1-35.3-51.9-61.4-72.7c-44.4-35.3-99-52.2-153.2-51.1l-10.2,66.7 c46.6-4,94.7,10.4,131.2,43.4c20.1,18.1,34.6,39.8,44.1,63.1c25.2,61.8,13.4,135.3-35.8,186l-45.4-45.4c-2.5-2.5-7-0.7-7.6,3 l-24.8,162.3c-0.4,2.7,1.9,5,4.6,4.6l162.4-24.8c3.7-0.6,5.4-5.1,3-7.6L424.941,414.341z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> 
        {/if}
    </div>
    <div class="theme">
        <Toggle on:status={e => dispatch('theme', e.detail)} />
    </div>
    <div class="settings">
        <a href="/settings">
            <Settings />
        </a>
    </div>
</header>

{#if !isOpen}
    <!-- <div class="toggler"on:click={() => isOpen = !isOpen}>v</div> -->
{:else}
    <div class="sidebar">
        <ul class="menu">
            <li><a href="/" class={currentPage === '/' ? 'active' : ''}>Party</a></li>
            <li><a href="/popular" class={currentPage === '/popular' ? 'active' : ''}>Popular</a></li>
            <li><a href="/trending" class={currentPage === '/trending' ? 'active' : ''}>Trending</a></li>
            <li><a href="/subscriptions" class={currentPage === '/subscriptions' ? 'active' : ''}>Subscriptions</a></li>
            <li>Playlists</li>
        </ul>
        <a href="https://github.com/wyzwanie/invidious-party">
            <div class="git">
                <p>source:</p>
                <Git fill=rgba(255,255,255,0.318) width=1.618em />
                <!-- <p>free software</p>
                <p>license</p> -->
            </div>
            <div class="license">
                <p>license:</p>
                <Drop fill=rgba(255,255,255,0.318) width=1.618em />
            </div>
        </a>
    </div>
{/if}

<style>
    .git, .license {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding: 0 3px;
    }
    p {
        color: rgba(255,255,255,0.318);
        font-size: 83%;
    }
a {
    color: white;
}
.active {
    font-weight: bold;
    color: var(--accent);
}
.refresh svg {
    fill: var(--grey);
    width: 32px;
    cursor: pointer;
    transition: 1s;
}
.refresh svg.rotate {
    transform: rotate(360deg);
    fill: var(--accent);
    transition: 1s;
}
.theme {
    align-self: start;
}
svg {
    width: 32px;
    cursor: pointer;
}
.sidebar {
    position: absolute;
    left: 0;
    top: 64px;
    background: var(--bg-dark-second);
    border-right: 1px solid rgba(255,255,255,0.05);
    width: 96px;
    height: calc(100% - 64px);
    min-height: calc(100vh - 64px);
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
.menu {
    display: flex;
    list-style: none;
    justify-content: center;
    flex-flow: column;
    font-weight: bold;
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
    font-weight: bold;
}
.logo span {
    font-weight: 100;
    font-size: 90%;
    color: white;
}
.search {
    flex-grow: 0.618;
}
.search input {
    width: 100%;
    background: transparent;
    color: var(--accent);
    font-size: 1.2em;
    border: none;
    border-bottom: 1px solid white;
}
.search input:focus {
    outline: none;
    border-bottom: 2px solid var(--accent)
}
</style>