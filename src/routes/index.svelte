<script>
	import { chooseInstance } from '$lib/_helper'
	import { chosen, peers, actions, idsToNames } from '$lib/_memoryStore'
	import { instances } from '$lib/_localStore'
	
	import AsyncError from '$lib/AsyncError.svelte'
    import AsyncLoading from '$lib/AsyncLoading.svelte'
	import Chat from '$lib/Chat.svelte'
	import Loader from '$lib/Loader.svelte'
	import Video from '$lib/Video.svelte'

	let retry
	let playing
	let videosPlaying = {}
	let videoAPI = {}

	// const fetchVideo = async(instance, videoID) => {
	// 	console.log('yy???', res.videoId)
    //     try {
    //         ///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
    //         const req = await fetch(`https://${instance}/api/v1/videos/${videoID}`)
    //         const res = await req.json()
    //         counter ++
	// 		console.log('yy', res.videoId)
    //         if(res && res.videoId) return res
	// 		else return retry = true
	// 	} catch(err) {
    //         retry = true
	// 	}
	// }

	const setWatching = videoID => {
		playing = videoID
		videosPlaying['self'] = videoID
		videosPlaying = videosPlaying
		$actions.watching[0](videoID)
		videoAPI = {
			videoId: videoID,
			formatStreams: [
				{
					resolution: '720p',
					itag: 22,
					size: 'x720',
					type: 'video/mp4;'
				},
				{
					resolution: '360p',
					itag: 18,
					size: 'x360',
					type: 'video/mp4;'
				},
			]
		}
	}

	$: if(retry) {
        retry = false
        $chosen = chooseInstance($instances)
    }
	$: if($actions) {
		$actions.watching[1]((videoID, id) => {
            console.log('watching', videoID)
            videosPlaying[id] = videoID
			videosPlaying = videosPlaying
			videoAPI = {
			videoId: videoID,
			formatStreams: [
				{
					resolution: '720p',
					itag: 22,
					size: 'x720',
					type: 'video/mp4;'
				},
				{
					resolution: '360p',
					itag: 18,
					size: 'x360',
					type: 'video/mp4;'
				},
			]
		}
        })
	}
	$: console.log(videosPlaying)
	const incomingSearch = async e => {
		console.log(e)
		try {
			const res = await fetch(`https://${$chosen}/podpowiedzi`)
			const podpowiedzi = await res.json()

			console.log(podpowiedzi)
		} catch(err) {

		}

	}
</script>

	{#if $peers.length > 0}
		There {$peers.length > 1 ? 'are' : 'is'} {$peers.length} {$peers.length > 1 ? 'peers' : 'peer'} @ da party.
	{/if}
	<div class="party">
		<div class="top">
			<div class="video {playing ? '' : 'empty'}">
				{#if Object.keys($peers).length}
					{#if Object.keys(videosPlaying).length}
						<Video chosen={$chosen} {videoAPI} on:error={$chosen = chooseInstance($instances)} />
					{:else}
					<div class="wrp">
						<img src="peepoDJ.gif" alt="sadge">
						<div style="text-align: center;">
							<h3>Nothing playing</h3>
							<button on:click={() => setWatching('TUJpAIxjo1c')}>ADD VIDEO TO PARTY</button>
						</div>
					</div>
					{/if}
				{:else}
					<div class="wrp">
						<img src="sadge.png" alt="sadge">
						<div style="text-align: center;">
							<h3>Party empty</h3>
							<button>START PLAYING</button>
						</div>
					</div>
				{/if}
			</div>
			<div class="chat">
				<Chat roomID="party" />
			</div>
		</div>
		<div class="bottom">
			<div class="video">
				<div class="search">
					<h1>#Search videos</h1>
					<input type="text" placeholder="find video" on:input={incomingSearch}>
				</div>
			</div>
			<div class="chat">
				<div class="playing">
					<h1>Currently playing</h1>
					{#each Object.values(videosPlaying) as videoID}
						<img src="{`https://${$chosen}/vi/${videoID}/1.jpg`}" alt="{videoID} thumbnail">
					{/each}
				</div>
			</div>
		</div>
	</div>

<style>
	.top {
		display: flex;
		margin-bottom: 11px;
	}
	.bottom {
		display: flex;
	}
	.bottom .chat, .bottom .video {
		border: 1px solid var(--light-border);
		border-radius: 5px;
	}
	.search, .playing {
		padding: 0.618em;
	}
.wrp {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.party {
    display: flex;
	flex-direction: column;
}
.video {
    width: 100%;
    margin-right: 11px;
    border: 1px solid var(--light-border);
    border-radius: 5px;
}
.video img {
	width: 31.8vw;
}
.chat {
    width: 31.8%;
}
</style>