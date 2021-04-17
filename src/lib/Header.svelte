<script>
    import { createEventDispatcher } from 'svelte'

    import Toggle from './Toggle.svelte'

    export let chosen
    export let currentPage
    export let searchTerm
    export let ipfsStatus

    let rotate = false
    let isOpen = true
    let vw = false
    
    const dispatch = createEventDispatcher()
    const handleSearch = e => {
        if(e.keyCode === 13) window.location.href = `/search?q=${searchTerm}`
    }
    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms));
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
        invidious.party<span style="font-size: 69%; color: unset;">&nbsp;v0.4.1</span><br>
        <span>instance: {#if chosen}<a style="color: white;" href="{chosen}">{chosen}</a>{:else}...initializing...{/if}</span>
        <br><span>{ipfsStatus}</span>
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
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="42.163px" height="42.163px" viewBox="0 0 42.163 42.163" style="enable-background:new 0 0 32 32;" xml:space="preserve" fill="var(--accent)">
                <g><path d="M37.364,15.082c-0.993,0-1.229-0.569-0.526-1.271l1.271-1.273c1.173-1.171,1.173-3.068,0-4.241l-4.241-4.242 c-1.172-1.172-3.07-1.173-4.243,0.001c0,0-0.568,0.569-1.271,1.271c-0.701,0.702-1.271,0.466-1.271-0.527V3 c0.001-1.657-1.34-2.997-2.998-3l-6.001,0.001c-1.659,0-3.002,1.343-3.002,3c0,0,0,0.805,0,1.797c0,0.991-0.569,1.226-1.271,0.525 l-1.27-1.27c-1.172-1.171-3.067-1.171-4.242-0.001L4.057,8.295c-1.171,1.173-1.173,3.069,0.001,4.245c0,0,0.569,0.569,1.271,1.272 c0.702,0.702,0.466,1.271-0.529,1.271H3c-1.657,0-3,1.343-3,3v6c0,1.657,1.343,3,3,3c0,0,0.806,0,1.799,0 c0.993,0,1.229,0.569,0.527,1.271l-1.271,1.271c-1.172,1.172-1.172,3.07,0,4.243l4.242,4.243c1.173,1.171,3.071,1.172,4.244,0 c0,0,0.569-0.568,1.27-1.271c0.701-0.701,1.271-0.466,1.271,0.526v1.796c0,1.451,1.029,2.66,2.397,2.939 c0.195,0.039,0.399,0.062,0.607,0.062h5.998c1.658-0.001,3-1.344,3.002-3.001c0,0,0-0.805,0-1.798s0.569-1.229,1.271-0.527 l1.271,1.271c1.173,1.174,3.071,1.174,4.245,0.002l4.241-4.242c1.172-1.172,1.172-3.072,0-4.245c0,0-0.568-0.567-1.271-1.271 c-0.701-0.701-0.467-1.271,0.524-1.271h1.795c1.657,0,3-1.343,3-3v-6c0-1.657-1.343-3-3-3 C39.162,15.082,38.357,15.082,37.364,15.082z M21.08,30.916c-5.432,0-9.835-4.402-9.835-9.834c0-5.432,4.403-9.835,9.835-9.835 c5.432,0,9.835,4.403,9.835,9.835C30.915,26.514,26.512,30.916,21.08,30.916z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
            </svg>
        </a>
    </div>
</header>

{#if !isOpen}
    <!-- <div class="toggler"on:click={() => isOpen = !isOpen}>v</div> -->
{:else}
    <div class="sidebar">
        <!-- <div class="toggler"on:click={() => isOpen = !isOpen}>x</div> -->
        <ul class="menu">
            <li><a href="/" class={currentPage === '/' ? 'active' : ''}>PARTY</a></li>
            <li><a href="/popular" class={currentPage === '/popular' ? 'active' : ''}>POPULAR</a></li>
            <li><a href="/trending" class={currentPage === '/trending' ? 'active' : ''}>TRENDING</a></li>
            <li><a href="/subscriptions" class={currentPage === '/subscriptions' ? 'active' : ''}>SUB<span style="font-size: 8px;">SCRIPTIONS</span></a></li>
            <li>PLAYLISTS</li>
        </ul> 
    </div>
{/if}

<style>
    /* .toggler {
        position: absolute;
        top: 69px;
        left: 5px;
        background: var(--accent);
        width: 2em;
        height: 2em;
        color: var(--bg-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
    } */
.sidebar {
    position: absolute;
    left: 0;
    top: 64px;
    background: var(--bg-dark-second);
    border-right: 1px solid rgba(255,255,255,0.05);
    width: 96px;
    height: calc(100% - 64px);
    min-height: calc(100vh - 64px);
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
</style>