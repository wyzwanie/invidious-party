<script>
    import { onMount } from 'svelte'
	import { chooseInstance, convertCount, saveLocal, getAuthorThumbnail, sleep } from '$lib/_helper'
	import { store, chosen, subStore, ipfs } from '$lib/_store'
    import AsyncError from '$lib/AsyncError.svelte'
	import AsyncLoading from '$lib/AsyncLoading.svelte'
    import Playlists from '$lib/Playlists.svelte'
    import Rotate from '$lib/Rotate.svelte'
	import Videos from '$lib/Videos.svelte'
	

    let channelID = ''
    let retry = false
    let counter = 0

    let activeTab = 'videos'

    onMount(() => channelID = window.location.href.split('#')[1])
let tmp
    const sub = async channelID => {
        if(!$subStore.includes(channelID)) $subStore = [...$subStore, channelID]
        else alert('unsub?')
        const saveToIpfs = await $ipfs.dag.put({
            subscriptions: $subStore
        })
        saveLocal({ subscriptions: { array: $subStore, cid: saveToIpfs.toString() }})
        tmp = saveToIpfs.toString()
    }

    const fetchChannel = async (instance, channelID) => {
        if(!channelID) return { error: 'This channel does not exist.'}
        if(channelID.length > 24) return { error: 'wrong channel ID'}
        if(counter > 10) return { error: 'is everything OK? too many retries...' }

        try {
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}`)
            const res = await req.json()

            if(res && Object.keys(res).length > 0) {
                if(res.error && res.error !== 'This channel does not exist.') {
                    // retry = true
                    counter++
                }
                return res
            }
            return res
        } catch(err) {
            retry = true
            counter++
        }
    }

    const fetchPlaylists = async (instance, channelID) => {
        try {
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}/playlists`)
            const res = await req.json()
            if(res.error) return res.error
            else return res
        } catch(err) {
            retry = true
            counter++
        }
    }

    const getAuthorBanner = authorBanners => {
        const link = authorBanners[authorBanners.findIndex(x => x.width == 1060)].url
        const extracted = link.split('/')[3]
        return `https://${$chosen}/ggpht/${extracted}`
    }
    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }
</script>
{tmp}
{#await fetchChannel($chosen, channelID)}
    <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{:then channel}
    {#if channel.error}
        <div class="df">
            <p>{channel.error}</p>
            <Rotate on:rotate={() => $chosen = chooseInstance($store.instances)} />
            <p style="font-size: 90%">click Rotate button to try on next invidious instance</p>
        </div>
    {:else}
        <div class="banner">
            <img src="{getAuthorBanner(channel.authorBanners)}" alt="author banner" />
            <div class="info">
                <img src="{getAuthorThumbnail($chosen, channel.authorThumbnails)}" alt="author icon" />
                <span class="author">{channel.author}</span>
            </div>
            <div class="sub" on:click={sub(channelID)}>
                <span class="subCount">Subscribe <span>{convertCount(channel.subCount)}</span></span>
                <!-- <span class="totalViews">Total views: {channel.totalViews}</span> -->
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
            <Videos chosen={$chosen} videos={channel.latestVideos} on:empty={() => $chosen = chosenInstance($store.instances)} />
        {/if}
        {#if activeTab === 'playlists'}
            {#await fetchPlaylists($chosen, channelID)}
                <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($store.instances)} />
            {:then playlists}
                <Playlists chosen={$chosen} playlists={playlists.playlists} />
            {:catch error}
                <AsyncError {error} on:rotate={() => $chosen = chooseInstance($store.instances)} />
            {/await}
        {/if}
        {#if activeTab === 'info'}
            <div class="description">
                <h3>Channel description:</h3>
                {channel.description}
                <h3 style="margin-top: 0.618em;">Total view count: <span style="font-weight: normal">{convertCount(channel.totalViews)}</span></h3>
            </div>
        {/if}
    {/if}
{:catch error}
    <AsyncError {error} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{/await}

<style>
.df {
    align-items: center;
}
.df p {
    padding: 7px;
}
/* banner */
.banner {
    position: relative;
}
.banner > img {
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.info {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 1em;
    left: 1em;
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
.sub {
    position: absolute;
    right: 1em;
    bottom: 34px;
    display: flex;
}
.subCount {
    background: var(--accent);
    padding: 6px;
    border-radius: 3px;
    color: var(--bg-dark);
    font-weight: bold;
    cursor: pointer;
}
.subCount span {
    background: white;
    padding: 6px;
    margin-right: -6px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    font-weight: normal;
}
/* navigation */
nav {
    background: var(--bg-dark-second);
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
    background: rgb(0 0 0 / 35%);
}
.active.videos {
    border-bottom-left-radius: 5px;
}
.description {
    background: rgb(0 0 0 / 35%);
    padding: 1em;
}
h3 {
    margin: 0 0 0.618em 0;
}
</style>