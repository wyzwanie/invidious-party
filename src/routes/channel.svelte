<script>
    import { onMount } from 'svelte'

	import { chooseInstance, convertCount, getAuthorThumbnail } from '$lib/_helper'
	import { chosen, ipfs } from '$lib/_store'
    import { instances, SUBs, SUBsCID, SUBsUpdatedAt } from '$lib/_localStore'

    import AsyncError from '$lib/AsyncError.svelte'
	import AsyncLoading from '$lib/AsyncLoading.svelte'
    import Playlists from '$lib/Playlists.svelte'
    import Rotate from '$lib/Rotate.svelte'
	import Videos from '$lib/Videos.svelte'	

    let channelID = ''
    let retry = false
    let subbed

    let activeTab = 'videos'

    onMount(() => {
        channelID = window.location.href.split('#')[1]
        subbed = $SUBs.includes(channelID)
    })

let tmp

    const sub = async channelID => {
        if(!$SUBs.includes(channelID)) $SUBs = [...$SUBs, channelID]
        else $SUBs = $SUBs.filter(x => x !== channelID)
        subbed = !subbed
        
        try {
            const saveToIpfs = await $ipfs.dag.put({ SUBs: $SUBs })
            $SUBsCID = saveToIpfs.toString()
            $SUBsUpdatedAt = new Date().getTime()
            tmp = saveToIpfs.toString()
        } catch(err) {
            console.log('ipfs error', err)
        }
    }

    const fetchChannel = async (instance, channelID) => {
        if(!channelID) return { error: 'This channel does not exist.'}
        if(channelID.length > 24) return { error: 'wrong channel ID'}

        try {
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}`)
            const res = await req.json()
            if(res.error) throw new Error(res.error)
            return res
        } catch(err) {
            retry = true
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
        }
    }

    const getAuthorBanner = authorBanners => {
        console.log(authorBanners)
        const link = authorBanners[authorBanners.findIndex(x => x.width == 1060)].url
        const extracted = link.split('/')[3]
        return `https://${$chosen}/ggpht/${extracted}`
    }

	const disableInstance = chosen => {
		console.log('disable started')
		new AbortController().abort()
		const index = $instances.findIndex(x => x[0] === chosen)
		$instances[index][1].enabled = false
		$instances = $instances
	}

    $: if(retry) {
        $chosen = chooseInstance($instances)
        retry = false
    }
    $: subbed = (x => x.includes(channelID))($SUBs)
</script>

{tmp}|subbed: {subbed}
{#await fetchChannel($chosen, channelID)}
    <AsyncLoading chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
{:then channel}
    <div class="banner">
        <img src="{getAuthorBanner(channel.authorBanners)}" alt="author banner" />
        <div class="info">
            <img src="{getAuthorThumbnail($chosen, channel.authorThumbnails)}" alt="author icon" />
            <span class="author">{channel.author}</span>
        </div>
        <div class="sub" class:subbed on:click={sub(channelID)}>
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
        <Videos chosen={$chosen} videos={channel.latestVideos}  on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
    {/if}
    {#if activeTab === 'playlists'}
        {#await fetchPlaylists($chosen, channelID)}
            <AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)}  on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
        {:then playlists}
            <Playlists chosen={$chosen} playlists={playlists.playlists} />
        {:catch error}
            <AsyncError {error} on:rotate={() => $chosen = chooseInstance($instances)}  on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
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

<style>
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