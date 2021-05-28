<script>
    import { onMount, afterUpdate } from 'svelte'

    import { chooseInstance, convertCount, Fetcher, getAuthorThumbnail, instanceFailedRequest, log, validateChannelID } from '$lib/helper'
	import { chosen } from '$lib/Stores/memoryStore'
    import { instances } from '$lib/Stores/localStore'

    import ImageLoader from '$lib/ImageLoader/ImageLoader.svelte'
    import AsyncError from '$lib/Components/AsyncError.svelte'
	import AsyncLoading from '$lib/Components/AsyncLoading.svelte'
    import Playlists from '$lib/Components/Playlists.svelte'
    import Subscribe from '$lib/Components/Subscribe.svelte'
	import Videos from '$lib/Components/Videos.svelte'

    let channel
    let playlists
    let channelID
    let isChannelIDvalid
    let activeTab = 'videos'

    let channelError
    let playlistError
    let loadingChannel = false
    let loadingPlaylst = false
    let retry = false

    const updateAddress = () => {
        channelID = window.location.href.split('#')[1]
        isChannelIDvalid = validateChannelID(channelID)
    }
    const handleError = err => {
        if(fetcher.what === 'videos') {
            loadingChannel = false
            channelError = err
        }
        if(fetcher.what === 'playlists') {
            loadingPlaylst = false
            playlistError = err
        }
        const updated = instanceFailedRequest($instances, $chosen)
        if(updated) $instances = updated
        retry = true
    }
    const getAuthorBanner = authorBanners => {
        log('channel:getAuthorBanner', authorBanners, 'dev')
        const link = authorBanners[authorBanners.findIndex(x => x.width == 1060)].url
        const extracted = link.split('/')[3]
        return `https://${$chosen}/ggpht/${extracted}`
    }
    
    const fetcher = new Fetcher($chosen, ``)

    fetcher.on('start', url => {
        if(!url) return
        if(fetcher.what === 'videos') loadingChannel = true
        if(fetcher.what === 'playlists') loadingPlaylst = true
    })
    fetcher.on('ok', result => {
        console.log('here?', result)
        if(fetcher.what === 'videos') {
            loadingChannel = false
            channelError = false
            channel = result
        }
        if(fetcher.what === 'playlists') {
            loadingPlaylst = false
            playlistError = false
            playlists = result.playlists
        }
    })

    fetcher.on('err', err => handleError(err, fetcher.what))
    const runFetcher = (instance, channelID, what) => {
        if(!instance || !isChannelIDvalid || !what) return
        if(activeTab === 'videos' && channel) return
        if(activeTab === 'playlists' && playlists) return

        fetcher.what = what
        fetcher.instance = instance
        if(fetcher.what === 'videos') fetcher.url = `/channels/${channelID}`
        if(fetcher.what === 'playlists') fetcher.url = `/channels/${channelID}/playlists`
        fetcher.go()
    }

    onMount(() => updateAddress())
    afterUpdate(() => updateAddress())

    $: runFetcher($chosen, channelID, activeTab)
	$: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
        runFetcher($chosen, channelID, activeTab)
    }
</script>

<svelte:window on:hashchange={updateAddress}/>

{#if isChannelIDvalid}
    <div class="wrapper">
        {#if loadingChannel}
            <AsyncLoading chosen={$chosen} />
        {:else}
            {#if !channelError}
                <div class="banner">
                    {#if channel?.authorBanners?.length}
                        <ImageLoader src={getAuthorBanner(channel.authorBanners)} size=2560x424 alt={`${channel.author} banner`} />
                    {:else}
                        <div class="noBanner">no banner :)</div>
                    {/if}
                    <div class="info">
                        <ImageLoader src={getAuthorThumbnail($chosen, channel.authorThumbnails)} size=100x100 alt={`${channel.author} icon`} />
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
                    <Videos chosen={$chosen} videos={channel.latestVideos} />
                {/if}
                {#if activeTab === 'playlists'}
                    {#if loadingPlaylst}
                        <AsyncLoading chosen={$chosen} />
                    {:else}
                        {#if !playlistError}
                            <Playlists chosen={$chosen} {playlists} />
                        {:else}
                            <AsyncError error={playlistError} />
                        {/if}
                    {/if}
                {/if}
                {#if activeTab === 'info'}
                    <div class="description">
                        <h3>Channel description:</h3>
                        {channel.description}
                        <h3 style="margin-top: 0.618em;">Total view count: <span style="font-weight: normal">{convertCount(channel.totalViews)}</span></h3>
                    </div>
                {/if}
            {:else}
                <AsyncError error={channelError} />
            {/if}
        {/if}
    </div>
{:else}
    ERROR: invalid channelID
{/if}

<style>
/* banner */
.banner {
    position: relative;
}
:global(.banner div img) {
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
:global(.info div img) {
    width: 69px;
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