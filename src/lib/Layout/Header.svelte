<!-- <script context="module">
    import { browser } from '$app/env'
    export const router = browser
</script> -->

<script>
    import { createEventDispatcher } from 'svelte'
    import { goto } from '$app/navigation'
    
    import { version } from '$lib/config'
    import Rotate from '$lib/Components/Rotate.svelte'
    import Toggle from '$lib/UI/Toggle.svelte'
    import SettingsIcon from '$lib/Icons/SettingsIcon.svelte'

    export let chosen
    export let searchTerm
    export let consent
    
    const dispatch = createEventDispatcher()
    
    const handleSearch = async e => {
        if(e.keyCode === 13) await goto(`/search?q=${searchTerm}`)
    }
</script>

<header>
    <div class="logo">
        invidious.party<span style="font-size: 69%; color: unset;">&nbsp;v{version}</span><br>
        <span>instance: {#if chosen}<a style="color: white;" href="{chosen}">{chosen}</a>{:else}...initializing...{/if}</span>
        <br><span>mode: {consent ? consent : 'no consent'}</span>
    </div>
    <div class="search">
        <input type="text" bind:value={searchTerm} placeholder="search" on:keyup={handleSearch}>
    </div>
    <div class="menu">
        <div class="refresh">
            <Rotate on:rotate />
        </div>
        <div class="theme">
            <Toggle on:status={e => dispatch('theme', e.detail)} />
        </div>
        <div class="settings">
            <a href="/settings">
                <SettingsIcon />
            </a>
        </div>
    </div>
</header>

<style>
.menu {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
.menu div {
    margin: 0 8px;
}
.theme {
    align-self: start;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-1);
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