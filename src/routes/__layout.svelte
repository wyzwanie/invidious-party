<script>
    

    import { onDestroy, onMount, afterUpdate } from 'svelte'
    import { chosen } from '$lib/_store'
    // import { party, peers, sendName, getName,  } from '$lib/_partyStore'
    import { consent, settings, instances, instancesUpdatedAt, SUBsUpdatedAt } from '$lib/_localStore'
    import { chooseInstance, getInstances, log } from '$lib/_helper'

    import Consent from '$lib/Consent.svelte'
    import Header from '$lib/Header.svelte'

    let currentPage
    let searchTerm

    let idsToNames = {}
    let sendName
    let getName
    let party
    let peers


    const changeTheme = e => {
        $settings = {
            ...$settings,
            theme: e.detail
        }
        if(e.detail === 'light') document.documentElement.classList.toggle('light')
    }
    const route = () => {
        currentPage = window.location.pathname
        if(currentPage.includes('/search')) searchTerm = window.decodeURI(window.location.search.split('=')[1])
    }


    const initP2P = () => {
        const config = { appId: 'invidious.party' }
        const roomID = 'party'
        try {
            if(!party) party = joinRoom(config, roomID)
            peers = party.getPeers()
        } catch(err) {
            log('layout:joinRoom-Error', err.message, 'dev')
        }
    }
    // $: $party = party
    // $: $peers = peers
    // $: if(party) setInterval(() => (peers = party.getPeers()), 500)

    onMount(async () => {
        if($consent !== 'party') return
        initP2P()

        if(!party) return
        peers = party.getPeers()
        sendName = party.makeAction('name')[0]
        getName = party.makeAction('name')[1]

        sendName(`testowy-${Math.random()}`)

        party.onPeerJoin(id => {
            if(!peers.includes(id)) peers = [...peers, id]
            sendName(`testowy-${Math.random()}`, id)
        })
        getName((name, id) => (idsToNames[id] = name))
        party.onPeerLeave(id => peers = peers.filter(x => x != id))

    })

    afterUpdate(async () => {
        log('$layout:afterUpdate', 'init', 'dev')
        if(!$consent) return
        //never fetched before
        if(!$instancesUpdatedAt || !$instances.length) {
            log('$layout:updateInstances', '--- fetching instances ---', 'dev')
            $instances = await getInstances()
            $instancesUpdatedAt = new Date().getTime()
        }
        //instances lastUpdated more than 24h ago
        if ($instancesUpdatedAt && ((new Date().getTime() - $instancesUpdatedAt) > 24 * 60 * 60 * 1000)) {
            log('$layout:updateInstances', '--- refreshing instances ---', 'dev')
            $instances = await getInstances()
            $instancesUpdatedAt = new Date().getTime()
        }
        $chosen = chooseInstance($instances)
        if($settings && $settings.theme === 'light') document.documentElement.classList.toggle('light')
        route()
    })

    onDestroy(() => {if(party) party.leave()})

    $: log('$layout:$instances', $instances, 'dev')
    $: log('$layout:$settings', $settings, 'dev')
    $: log('p2p:party', party, 'dev')
    $: log('p2p:peers', peers, 'dev')

    // $: setInterval(initP2P, 500)
</script>

<Header {currentPage} {searchTerm} chosen={$chosen} status={false} consent={$consent}
    on:changeInstance={() => $chosen = chooseInstance($instances)}
    on:theme={changeTheme}
/>

<main>
    {#if !$consent}
        <Consent on:consent={e => $consent = e.detail} />
    {:else}
        <slot />
    {/if}
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