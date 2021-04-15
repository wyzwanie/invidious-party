<script>
    import { onMount } from 'svelte'
	import { chooseInstance, convertCount, saveLocal } from '$lib/_helper'
	import { store, chosen } from '$lib/_store'
	
	import Loader from '$lib/Loader.svelte'
	import Videos from '$lib/Videos.svelte'

    let channelID = ''
    let retry = false
    let vw
    let activeTab = 'videos'

    onMount(() => channelID = window.location.href.split('#')[1])

    const fetchChannel = async (instance, channelID) => {
        if(!channelID) return { error: 'This channel does not exist.'}
        try {
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}`)
            const res = await req.json()

            if(res && Object.keys(res).length > 0) {
                if(res.error && res.error !== 'This channel does not exist.') retry = true
                return res
            }
            return res
        } catch(err) {
            retry = true
        }
    }

    const getAuthorBanner = authorBanners => {
        const link = authorBanners[authorBanners.findIndex(x => x.width == 1060)].url
        const extracted = link.split('/')[3]
        return `https://${$chosen}/ggpht/${extracted}`
    }
    const getAuthorThumbnail = authorThumbnails => {
        const link = authorThumbnails[authorThumbnails.findIndex(x => x.width == 100)].url
        console.log(link)
        const extracted = link.split('/')[4]
        return `https://${$chosen}/ggpht/ytc/${extracted}`
    }

    $: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false

    }
    $: console.log(channelID)
</script>

<svelte:window bind:innerWidth={vw}/>

{#await fetchChannel($chosen, channelID)}
    ...loading...<br><Loader />
    {:then channel}
        {#if channel.error}
            {channel.error}<br>
            <button on:click={() => {$chosen = chooseInstance($store.instances)}}>Try another instance?</button>
        {:else}
            <div class="banner">
                <img src="{getAuthorBanner(channel.authorBanners)}" alt="author banner" />
                <div class="info">
                    <img src="{getAuthorThumbnail(channel.authorThumbnails)}" alt="author icon" />
                    <span class="author">{channel.author}</span>
                </div>
                <div class="sub">
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
                <Videos chosen={$chosen} videos={channel.latestVideos} />
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
    > {error.message}
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