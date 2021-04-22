<script>
    import { onMount, afterUpdate } from 'svelte'
    import { store, chosen, ipfs, SUBs } from '$lib/_store'
    import { getInstances, getVersion, chooseInstance, saveLocal, sleep } from '$lib/_helper'

    import Header from '$lib/Header.svelte'

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
            const initStorage = {
                instances,
                subscriptions: {
                    cid: false,
                    SUBs: [],
                    lastFetch: false
                },
                theme: false,
                lastStoreUpdate: false,
                lastInstancesUpdate: false,
                // version: instances[instances.findIndex(x => x[0] === $chosen)][1].version
            }
            saveLocal(initStorage)
            $store = initStorage
        } else {
            //refresh instance list every 24h
            if((new Date().getTime() - localStorage.lastStoreUpdate)/1000  > 24 * 60 * 60) localStorage.instances = JSON.stringify(await getInstances())
            $store = {
                instances: JSON.parse(localStorage.instances),
                subscriptions: JSON.parse(localStorage.subscriptions),
                theme: !localStorage.theme ? false : JSON.parse(localStorage.theme),
                lastStoreUpdate: JSON.parse(localStorage.lastStoreUpdate),
                lastInstancesUpdate: JSON.parse(localStorage.lastInstancesUpdate),
                // version: JSON.parse(localStorage.instances)[JSON.parse(localStorage.instances).findIndex(x => x[0] === $chosen)][1].version
            }
            $SUBs = JSON.parse(localStorage.subscriptions).SUBs
        }
        $chosen = chooseInstance($store.instances)
        //if light theme toggle class
        if($store.theme) document.documentElement.classList.toggle('light')
        if(Ipfs && !$ipfs) initializeNode()
    })

    afterUpdate(() => {
        currentPage = window.location.pathname
        if(currentPage.includes('/search')) searchTerm = window.decodeURI(window.location.search.split('=')[1])
    })

    let ipfsStatus = 'initializing'

    const initializeNode = async () => {
        ipfsStatus = 'ipfs: assets loaded'
        await sleep(681)
        ipfsStatus = 'ipfs: swarming...'
        $ipfs = await Ipfs.create()
        //     {
        //     config: {
        //         Addresses: {
        //             Swarm: [
        //                 '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        //                 '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        //                 '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
        //             ]
        //         }
        //     }
        // }
        ipfsStatus = 'ipfs: loaded yay!'
    }
    $: console.log('$layout:store', $store)
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

<!-- <footer>
donate to invidious<br>
thanks...<br>
</footer> -->

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