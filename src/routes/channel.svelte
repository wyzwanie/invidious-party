<script>
    import { onMount, afterUpdate } from 'svelte'

    import { chooseInstance, convertCount, ftch, getAuthorThumbnail, log, validateChannelID } from '$lib/helper'
	import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'

    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import Playlists from '$lib/Components/Playlists.svelte'
    import Subscribe from '$lib/Components/Subscribe.svelte'
	import Videos from '$lib/Components/Videos.svelte'

    let channelID
    let isChannelIDvalid
    let retry = false
    let activeTab = 'videos'

    let channelController
    let channelSignal
    let playlistController
    let playlistSignal

    const updateAddress = () => {
        channelID = window.location.href.split('#')[1]
        isChannelIDvalid = validateChannelID(channelID)
    }

    const fetchChannel = async (instance, channelID) => {
        if(!instance) $chosen = chooseInstance($instances)
        
        if(channelController !== undefined) channelController.abort()
        channelController = new AbortController
        channelSignal = channelController.signal

        try {
            const id = setTimeout(() => channelController.abort(), 5000)

             //?fields=
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}`, { signal: channelSignal })
            const res = await req.json()

            clearTimeout(id)
            
            if(req.ok) return res
            else throw new Error(res)
		} catch(err) {
            log('fetch:channel', err, 'dev')
            const index = $instances.findIndex(x => x[0] === instance)
            if(index < 0) return retry = true
            $instances[index][1].failedRequests++
            $instances[index][1].lastFailedRequest = new Date().getTime()
            $instances = $instances
            retry = true
		}
    }

    const fetchPlaylists = async (instance, channelID) => {
        if(!instance) $chosen = chooseInstance($instances)
        
        if(channelController !== undefined) channelController.abort()
        channelController = new AbortController
        channelSignal = channelController.signal

        const req = await fetch(`https://${instance}/api/v1/channels/${channelID}/playlists`) //?fields=
        const res = await req.json()

        if(req.ok) return res
        else throw res.error
    }

    const getAuthorBanner = authorBanners => {
        log('channel:getAuthorBanner', authorBanners, 'dev')
        const link = authorBanners[authorBanners.findIndex(x => x.width == 1060)].url
        const extracted = link.split('/')[3]
        return `https://${$chosen}/ggpht/${extracted}`
    }

	const disableInstance = chosen => {
		console.log('disable started')
		const index = $instances.findIndex(x => x[0] === chosen)
		$instances[index][1].enabled = false
		$instances = $instances
        retry = true
	}

    onMount(() => updateAddress())
    afterUpdate(() => updateAddress())

	$: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }
</script>

<svelte:window on:hashchange={updateAddress}/>

{#if isChannelIDvalid}
    <div class="wrapper">
        {#await fetchChannel($chosen, channelID)}
            <AsyncLoading chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:then channel}
            <div class="banner">
                {#if channel.authorBanners.length}
                    <img src="{getAuthorBanner(channel.authorBanners)}" alt="author banner" />
                {:else}
                    <div class="noBanner">no banner :)</div>
                {/if}
                <div class="info">
                    <img src="{getAuthorThumbnail($chosen, channel.authorThumbnails)}" alt="author icon" />
                    <span class="author">{channel.author}</span>
                </div>
                <div class="sub">
                    <Subscribe {channelID} subCount={convertCount(channel.subCount)} />
                </div>
            </div>
            <nav>
                <ul>
                    <li on:click={() => activeTab = 'videos'} class="videos {activeTab === 'videos' ? 'active' : ''}">Videos</li>
                    <li on:click={() => activeTab = 'playlists'} class="{activeTab === 'playlists' ? 'active' : ''}">Playlists</li>
                    <li on:click={() => activeTab = 'community'} class="{activeTab === 'community' ? 'active' : ''}">Community</li>
                    <li on:click={() => activeTab = 'info'} class="{activeTab === 'info' ? 'active' : ''}">Info</li>
                </ul>
            </nav>
            {#if activeTab === 'videos'}
                <Videos chosen={$chosen} videos={channel.latestVideos} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
            {/if}
            {#if activeTab === 'playlists'}
                {#await fetchPlaylists($chosen, channelID)}
                    <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
                {:then playlists}
                    <Playlists chosen={$chosen} playlists={playlists.playlists} />
                {:catch error}
                    <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
                {/await}
            {/if}
            {#if activeTab === 'info'}
                <div class="description">
                    <h3>Channel description:</h3>
                    {channel.description}
                    <h3 style="margin-top: 0.618em;">Total view count: <span style="font-weight: normal">{convertCount(channel.totalViews)}</span></h3>
                </div>
            {/if}
        {:catch error}
            <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)}  on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {/await}
    </div>
{:else}
    ERROR: invalid channelID
{/if}

<style>
/* banner */
.banner {
    position: relative;
}
.banner > img {
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    filter: brightness(0.69)
}
.noBanner {
    height: 225px;
    background: var(--accent-dim);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.info {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 1em;
    left: 1em;
}
.sub {
    position: absolute;
    right: 1em;
    bottom: 34px;
    display: flex;
}
.info > img {
    width: 69px;
    /* border: 3px solid white; */
    border-radius: 50%;
}
.author {
    margin-left: 5px;
    font-size: 1.3em;
    font-weight: bold;
}
/* navigation */
nav {
    background: var(--bg-1);
    width: 100%;
    margin-top: -3px;
    margin-bottom: 1em;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
nav ul {
    list-style: none;
    display: flex;
}
nav ul li {
    padding: 1em;
    cursor: pointer;
}
.active {
    color: var(--accent);
    font-weight: bold;
    background: var(--bg-2);
}
.active.videos {
    border-bottom-left-radius: 5px;
}
.description {
    background: var(--bg-2);
    padding: 1em;
}
h3 {
    margin: 0 0 0.618em 0;
}
</style>