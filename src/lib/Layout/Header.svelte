<script>
    import { createEventDispatcher, onMount, afterUpdate } from 'svelte'
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { version } from '$lib/config'
    import { searchQuery } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'
    import { chooseInstance, log } from '$lib/helper'

    import Rotate from '$lib/Components/Rotate.svelte'
    import Toggle from '$lib/UI/Toggle.svelte'
    import SettingsIcon from '$lib/Icons/SettingsIcon.svelte'

    export let chosen
    export let searchTerm
    export let consent

    const dispatch = createEventDispatcher()

    let retry
    let controller
    let signal
    let suggestions
    
let counter = 0

    const handleSearch = async e => {
        if(e.keyCode === 13) {
            if($page.path !== '/playlists') await goto(`/search?q=${searchTerm}`)
            else return $searchQuery = searchTerm
        } else {
            suggestions = await fetchSuggestions(null, searchTerm)
        }
    }

    const fetchSuggestions = async (instance, term) => {
        if(!term) return { suggestions: [] }
if(counter > 50) return
        if(controller !== undefined) controller.abort()
        controller = new AbortController
        signal = controller.signal
        
        try {
            if(!instance) instance = chooseInstance($instances)
            const req = await fetch(`https://${instance}/api/v1/search/suggestions/?q=${term}`, { signal })
            const res = await req.json()
            return res
        } catch(err) {
            counter++
            // log('suggestions->fetch:error', err, 'dev')
            retry = true
        }
    }

    const chooseSuggestion = suggestion => {
        searchTerm = suggestion
        handleSearch({ keyCode: 13})
        suggestions = null
    }

    onMount(() => searchTerm = $page.query.get('q'))

    $: if(retry) {
        retry = false
        chosen = chooseInstance($instances)
    }

    $: console.log(suggestions)
    $: console.log(searchTerm, suggestions)
</script>

<header>
    <div class="logo">
        invidious.party<span style="font-size: 69%; color: unset;">&nbsp;v{version}</span><br>
        <span>instance: {#if chosen}<a style="color: white;" href="{chosen}">{chosen}</a>{:else}...initializing...{/if}</span>
        <br><span>mode: {consent ? consent : 'no consent'}</span>
    </div>
    <div class="search">
        <input type="text" bind:value={searchTerm} placeholder="search" on:keyup={handleSearch}>
        <div class="suggestions">
            <!-- {#await fetchSuggestions(chosen, searchTerm)}
                suggestions<br>
                ... loading ...
            {:then s} -->
                {#if suggestions}
                    {#each suggestions.suggestions as suggestion}
                        <div class="s" on:click={() => chooseSuggestion(suggestion)}>
                            {suggestion}
                        </div>
                    {/each}
                {/if}
            <!-- {:catch error}
                ERROR: {error}
            {/await} -->
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