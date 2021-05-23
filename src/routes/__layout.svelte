<script>
    

    import { onDestroy, onMount, afterUpdate } from 'svelte'
    import { joinRoom } from 'trystero'
    import { chosen, peers, party, actions, idsToNames } from '$lib/_memoryStore'
    // import { party, peers, sendName, getName,  } from '$lib/_partyStore'
    import { consent, nick, settings, instances, instancesUpdatedAt, SUBsUpdatedAt } from '$lib/_localStore'
    import { chooseInstance, getInstances, log } from '$lib/_helper'

    import Consent from '$lib/Consent.svelte'
    import Header from '$lib/Header.svelte'

    let currentPage
    let searchTerm

    let partyStarted

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


    const initParty = () => {
        console.log('init party')
        const config = { appId: 'invidious.party' }
        const roomID = 'party'
        try {
            if(!$party) $party = joinRoom(config, roomID)

            $actions = {
                name: $party.makeAction('name'), //name[0]: send //name[1]: get
                chat: $party.makeAction('msg'),
                watching: $party.makeAction('watching')
            }
            console.log($actions)

            $actions.name[0]($nick)
            $party.onPeerJoin(id => {
                console.log('peer join')
                $actions.name[0]($nick, id)
                if($peers['self'] && $peers['self'].videoID) $actions.watching[0]($peers['self'].videoID, id)
            })
            $actions.name[1]((nick, id) => $peers[id] = {...$peers[id], nick })
            $actions.watching[1]((videoID, id) => $peers[id] = {...$peers[id], videoID })
            $party.onPeerLeave(id => {
                console.log('peer leave')
                delete $peers[id]
                $peers = $peers
            })
            log('layout:initParty', 'party started🎉', 'dev')
        } catch(err) {
            log('layout:joinRoom-Error', err.message, 'dev')
        }
    }

    onMount(async () => {
        if($consent !== 'party') return
        initParty()
        route()
    })

    $: if($consent) {
        
        (async () => {
            log('$layout:afterUpdate', 'init', 'dev')
            // if(!$consent) return
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
        })()
    }
    onDestroy(() => {if($party) $party.leave()})

    $: log('$layout:$instances', $instances, 'dev')
    $: log('$layout:$settings', $settings, 'dev')
    // $: log('p2p:party', party, 'dev')
    $: log('p2p:peers', $peers, 'dev')
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