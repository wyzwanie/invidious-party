<script>
    import { onMount, afterUpdate } from 'svelte'
    import Header from '$lib/Header.svelte'

    import { store, chosen, ipfs } from '$lib/_store'
    import { getInstances, getVersion, chooseInstance, saveLocal } from '$lib/_helper'

    let currentPage
    let searchTerm

    const changeTheme = e => {
        $store = {
            ...$store,
            theme: e.detail
        }
        saveLocal({ theme: e.detail })
        document.documentElement.classList.toggle('light')
    }

    onMount(async () => {
        if(!localStorage.instances || localStorage.instances === '{}') {
            const instances = await getInstances()
            saveLocal({
                instances,
                theme: false,
                // version: instances[instances.findIndex(x => x[0] === $chosen)][1].version
            })
            $store = {
                instances,
                lastUpdate: localStorage.lastUpdate,
                theme: false,
                // version: instances[instances.findIndex(x => x[0] === $chosen)][1].version
            }
        } else {
            $store = {
                instances: JSON.parse(localStorage.instances),
                lastUpdate: localStorage.lastUpdate,
                theme: !localStorage.theme ? false : JSON.parse(localStorage.theme),
                rss: localStorage.rss || undefined,
                // version: JSON.parse(localStorage.instances)[JSON.parse(localStorage.instances).findIndex(x => x[0] === $chosen)][1].version
            }
        }
        $chosen = chooseInstance($store.instances)
        //if light theme toggle class
        if($store.theme) document.documentElement.classList.toggle('light')
        console.log('$layout:getVersion', getVersion($chosen, $store.instances))
        if(Ipfs && !$ipfs) initializeNode()
    })

    afterUpdate(() => {
        currentPage = window.location.pathname
        if(currentPage.includes('/search')) searchTerm = window.decodeURI(window.location.search.split('=')[1])
    })

    let ipfsStatus = 'initializing'

    const initializeNode = async () => {
        ipfsStatus = 'ipfs: assets loaded'
        const tmp = await Ipfs.create()
        $ipfs = tmp
        ipfsStatus = 'ipfs: loaded yay!'
    }
</script>

<svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"
        on:load={initializeNode}>
    </script>
</svelte:head>

<Header {currentPage} {searchTerm} chosen={$chosen} status={$store.theme} {ipfsStatus}
    on:changeInstance={() => $chosen = chooseInstance($store.instances)}
    on:theme={changeTheme}
/>


<main>
    <slot></slot>
</main>

<footer>

</footer>

<style>
:global(body) {
    background: var(--bg-dark);
    color: var(--txt-dark);
    position: relative;
}
:global(html.light) {
    filter: invert(1) hue-rotate(180deg);
}
:global(html.light img) {
    filter: invert(1) hue-rotate(180deg);
}
:global(main) {
    max-width: 83.33333%;
    margin: 0 auto;
    padding-left: 94px;
    padding-top: 1em;
}
</style>