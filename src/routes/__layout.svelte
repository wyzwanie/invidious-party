<script>
    import '../app.css'
    import { onDestroy, onMount, afterUpdate } from 'svelte'

    import { chosen, peers, party, actions } from '$lib/Stores/memoryStore'
    import { consent, nick, settings, instances, instancesUpdatedAt, SUBsUpdatedAt } from '$lib/Stores/localStore'
    import { chooseInstance, getInstances, log } from '$lib/helper'

    import Consent from '$lib/Components/Consent.svelte'
    import Header from '$lib/Layout/Header.svelte'
    import Loader from '$lib/UI/Loader.svelte'
	import Sidebar from '$lib/Layout/Sidebar.svelte'
    
    let refreshStarted = false
    let updating = true

    const initParty = () => {
        log('layout:initParty', 'initializing', 'dev')
        const config = { appId: 'invidious.party' }
        const roomID = 'party'
        try {
            if(!$party) $party = joinRoom(config, roomID)

            $actions = {
                name: $party.makeAction('name'), //name[0]: send //name[1]: get
                chat: $party.makeAction('msg'),
                watching: $party.makeAction('watching')
            }

            $actions.name[0]($nick || 'anon')

            $party.onPeerJoin(id => {
                log('party', 'peer join', 'dev')
                $actions.name[0]($nick || 'anon', id)
                if($peers['self'] && $peers['self'].videoID) $actions.watching[0]($peers['self'].videoID, id)
            })

            $actions.name[1]((nick, id) => $peers[id] = {...$peers[id], nick })
            $actions.watching[1]((videoID, id) => $peers[id] = {...$peers[id], videoID })
            $party.onPeerLeave(id => {
                log('party', 'peer leave', 'dev')
                delete $peers[id]
                $peers = $peers
            })
            log('layout:initParty', 'party started🎉', 'dev')
        } catch(err) {
            log('layout:initParty', err.message, 'dev')
        }
    }
    const refreshInstances = async () => {
        //never fetched before
        if(!$instancesUpdatedAt || !$instances.length) {
            log('layout:refreshInstances', 'initial refresh', 'dev')
            $instances = await getInstances()
            $instancesUpdatedAt = new Date().getTime()
        }
        //instances lastUpdated more than 24h ago
        if ($instancesUpdatedAt && ((new Date().getTime() - $instancesUpdatedAt) > 24 * 60 * 60 * 1000)) {
            log('layout:refreshInstances', 'starting refresh', 'dev')
            $instances = await getInstances($instances)
            $instancesUpdatedAt = new Date().getTime()
            log('layout:refreshInstances', $instances , 'dev')
        }
        $chosen = chooseInstance($instances)
        refreshStarted = false
    }

	onMount(() => {
        if($consent) {
            refreshStarted = true
            log('layout:onmount', refreshStarted, 'dev')
            if($consent === 'party') initParty()
            refreshInstances()
        } else {
            console.log($consent, $chosen, 'else')
        }
	})
    afterUpdate(() => updating = false)
    onDestroy(() => $party ? $party.leave() : null)
</script>

<svelte:window on:sveltekit:navigation-start="{() => $chosen = chooseInstance($instances)}" />

<Header consent={$consent} on:rotate={() => $chosen = chooseInstance($instances)} />
<main>
	<Sidebar />
    <div class="content">
        {#if !$consent}
            {#if refreshStarted}
                <Loader />
            {:else}
            {#if !updating}
                <Consent on:consent={e => {
                    log('layout:onConsent', 'refreshStarted', 'dev')
                    $consent = e.detail
                    refreshStarted = true
                    if($consent === 'party') initParty()
                    refreshInstances()
                }}/>
            {/if}{/if}
        {:else}
            <slot />
        {/if}
    </div>
</main>

<style>
main {
    display: flex;
    height: calc(100% - 66px);
    position: relative;
}
.content {
    padding: 0.5em;
    overflow: auto;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0px 0px 1px 1px var(--border);
}
@media (min-width: 600px) {
    .content {
        padding: 11px 5%;
    }
}
</style>
