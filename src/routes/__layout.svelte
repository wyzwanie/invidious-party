<script>
    import { page, navigating } from '$app/stores'
    import '../app.css'
    import { onDestroy, onMount, afterUpdate } from 'svelte'
    import { joinRoom, selfId } from 'trystero/torrent'
    import { chosen, peers, party, actions } from '$lib/stores/_memoryStore'
    import { consent, nick, settings, instances, instancesUpdatedAt, SUBsUpdatedAt } from '$lib/stores/_localStore'
    import { chooseInstance, getInstances, log } from '$lib/_helper'

    import Consent from '$lib/Consent.svelte'
    import Header from '$lib/Layout/Header.svelte'
	import Sidebar from '$lib/Layout/Sidebar.svelte'

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

            $actions.name[0]($nick || 'anon')

            $party.onPeerJoin(id => {
                console.log('peer join')
                $actions.name[0]($nick || 'anon', id)
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

	onMount(() => {
		initParty()
	})
    $: console.log(isSidebarOpen)

    let isSidebarOpen = true

</script>

<Header />
<main>
	<Sidebar />
    <div class="content">
        {#if !$consent}
            <Consent />
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
    padding: 1em;
    overflow: auto;
}
	/* main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	} */
</style>
