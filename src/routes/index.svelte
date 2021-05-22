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

	const fetchVideo = async(instance, videoID) => {
        try {
            ///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
            const req = await fetch(`https://${instance}/api/v1/videos/${videoID}`)
            const res = await req.json()
            counter ++
            if(res.videoId) return res
			else retry = true
		} catch(err) {
            retry = true
		}
	}

	const setWatching = videoID => {
		playing = videoID
		videosPlaying['self'] = videoID
		videosPlaying = videosPlaying
		$actions.watching[0](videoID)
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
        })
	}
	$: console.log(videosPlaying)
</script>

	{#if $peers.length > 0}
		There {$peers.length > 1 ? 'are' : 'is'} {$peers.length} {$peers.length > 1 ? 'peers' : 'peer'} @ da party.
	{/if}
	<div class="party">	
		<div class="video {playing ? '' : 'empty'}">
			{#if Object.keys($peers).length > 0}
				{#if playing}
					{#await fetchVideo($chosen, playing)}
						<AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($instances)} />
					{:then videoAPI}
						<div class="top">
							<div class="video">
								{#if $chosen}
									<Video chosen={$chosen} {videoAPI} on:error={$chosen = chooseInstance($instances)} />
								{/if}
							</div>
							<div class="chat">
								<Chat roomID={playing} />
							</div>
						</div>
					{:catch error}
						<AsyncError {error} on:rotate={$chosen = chooseInstance($instances)} />
					{/await}
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

<style>
.wrp {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.party {
    display: flex;
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