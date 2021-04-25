<script>
    import { onMount, afterUpdate } from 'svelte'
    import { chosen, ipfs } from '$lib/_store'
    import { settings, instances, instancesUpdatedAt } from '$lib/_localStore'
    import { chooseInstance, getInstances, sleep } from '$lib/_helper'

    import Header from '$lib/Header.svelte'

    let currentPage
    let ipfsStatus = 'initializing'
    let searchTerm

    const changeTheme = e => {
        $settings = {
            ...$settings,
            theme: e.detail
        }
        if(e.detail === 'light') document.documentElement.classList.toggle('light')
    }

    onMount(async () => {
        //never fetched before
        if(!$instancesUpdatedAt) {
            console.log('--- fetching instances ---')
            $instances = await getInstances()
            $instancesUpdatedAt = new Date().getTime()
        }
        //instances lastUpdated more than 24h ago
        if ($instancesUpdatedAt && ((new Date().getTime() - $instancesUpdatedAt) > 24 * 60 * 60 * 1000)) {
            console.log('--- refreshing instances ---')
            $instances = await getInstances()
            $instancesUpdatedAt = new Date().getTime()
        }

        $chosen = chooseInstance($instances)

        if($settings && $settings.theme === 'light') document.documentElement.classList.toggle('light')
        if(Ipfs && !$ipfs) initializeNode()
    })

    afterUpdate(() => {
        currentPage = window.location.pathname
        if(currentPage.includes('/search')) searchTerm = window.decodeURI(window.location.search.split('=')[1])
    })

    const initializeNode = async () => {
        ipfsStatus = 'ipfs: assets loaded'
        await sleep(681)
        try {
            ipfsStatus = 'ipfs: swarming...'
            $ipfs = await Ipfs.create()
            ipfsStatus = 'ipfs: loaded yay!'
        } catch(err) {
            'ipfs: error! RELOAD PAGE'
        }
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
        
    }
    $: console.log('$layout:$instances', $instances)
    $: console.log('$layout:$settings', $settings)
</script>

<svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"
        on:load={initializeNode}
        on:error={() => ipfsStatus = 'ipfs: error! RELOAD PAGE'}
    />
</svelte:head>

<Header {currentPage} {searchTerm} chosen={$chosen} status={false} {ipfsStatus}
    on:changeInstance={() => $chosen = chooseInstance($instances)}
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