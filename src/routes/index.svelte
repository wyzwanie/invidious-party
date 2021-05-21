<script>
	import { chooseInstance } from '$lib/_helper'
	import { store, chosen } from '$lib/_store'
	
	import Chat from '$lib/Chat.svelte'
	import Loader from '$lib/Loader.svelte'
	import Video from '$lib/Video.svelte'

	let videoID
</script>

<div class="party">
	<div class="video">
		{#if videoID}
			<Video chosen={$chosen} {videoID} />
		{:else}
			<img src="sadge.png" alt="sadge">
			<h3>Party Empty</h3>
			<button>ADD VIDEO TO PARTY</button>
		{/if}
	</div>
	<div class="chat">
		<!-- <Chat roomID="invidious.party" /> -->
	</div>
</div>

<style>
.party {
    display: flex;
}
.video {
    width: 100%;
	justify-self: center;
	align-items: center;
}
.chat {
    width: 50%;
}
</style>