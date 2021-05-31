<script>
    import { createEventDispatcher, onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { version } from '$lib/config'
    import { chosen, searchQuery } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, Fetcher, instanceRequestStatus } from '$lib/helper'

    import Loading from '$lib/UI/Loading.svelte'
    import Rotate from '$lib/Components/Rotate.svelte'
    import Toggle from '$lib/UI/Toggle.svelte'
    import SettingsIcon from '$lib/Icons/SettingsIcon.svelte'

    export let searchTerm
    export let consent

    const dispatch = createEventDispatcher()

    let retry
    let suggestions = []
    let loading
    let error
    let component
    
    const fetcher = new Fetcher($chosen, `/search/suggestions/?q=${searchTerm}`)
    fetcher.on('start', () => loading = true)
    fetcher.on('ok', result => {
        error = loading = false
        suggestions = result.suggestions
        const updated = instanceRequestStatus($instances, $chosen, 'ok')
        if(updated) $instances = updated
    })
    fetcher.on('err', err => {
        loading = false
        error = err
        const updated = instanceRequestStatus($instances, $chosen, 'fail')
        if(updated) $instances = updated
        retry = true
    })

    const runFetcher = (instance, query) => {
        if(!instance || !query) return suggestions = []
        fetcher.instance = instance
        fetcher.url = `/search/suggestions/?q=${query}`
        fetcher.go()
    }

////
$: if(typeof document !== 'undefined') {
        if (suggestions.length) ['click', 'touchstart', 'keyup'].forEach(event =>
                document.addEventListener(event, handleDocumentClick, true))
        else ['click', 'touchstart', 'keyup'].forEach(event =>
                document.removeEventListener(event, handleDocumentClick, true))
	}

	const handleDocumentClick = e => {
		if(e && (e.which === 3 || (e.type === 'keyup' && e.which !== 9))) return
		if(component && component.contains(e.target) && component !== e.target && (e.type !== 'keyup' || e.which === 9)) return
		suggestions = []
	}

    const handleSearch = async e => {
        if(e.keyCode === 13) {
            if($page.path !== '/playlists') await goto(`/search?q=${searchTerm}`)
            // else return $searchQuery = searchTerm
        } else if (e.keyCode === 27) suggestions = []
    }
    const chooseSuggestion = suggestion => {
        searchTerm = suggestion
        suggestions = []
        handleSearch({ keyCode: 13})
    }

    onMount(() => searchTerm = $page.query.get('q'))

    $: if(retry) {
        retry = false
        runFetcher(chooseInstance($instances), searchTerm)
    }
    $: runFetcher($chosen, searchTerm)
</script>

<header>
    <div class="logo">
        invidious.party<span style="font-size: 69%; color: unset;">&nbsp;v{version}</span><br>
        <span>instance: {#if $chosen}<a style="color: white;" href="{$chosen}">{$chosen}</a>{:else}...initializing...{/if}</span>
        <br><span>mode: {consent ? consent : 'no consent'}</span>
    </div>
    <div class="search">
        <input type="text" bind:value={searchTerm} placeholder="search" on:keydown={handleSearch}>
        <div class="suggestions" bind:this={component}>
            {#if loading}
                <Loading />
            {:else}
                {#if !error}
                    {#each suggestions as suggestion}
                        <div class="s" on:click={() => chooseSuggestion(suggestion)}>
                            {suggestion}
                        </div>
                    {/each}
                {:else}
                    ERROR: {error}
                {/if}
            {/if}
        </div>
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
    position: relative
}
.suggestions {
    position: absolute;
    top: 14px;
    left: 0;
    z-index: 100;
    background: var(--bg-0);
    color: var(--text--80);
    border: 1px solid var(--border);
    border-radius: 5px;
}
.s {
    padding: 7px;
    cursor: pointer;
}
.s:hover {
    background: var(--bg-1)
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