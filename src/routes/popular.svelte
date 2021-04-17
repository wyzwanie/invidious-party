<script>
	import { chooseInstance } from '$lib/_helper'
	import { store, chosen } from '$lib/_store'
	
	import Loader from '$lib/Loader.svelte'
	import Videos from '$lib/Videos.svelte'

	let error
	let loading
	let popular

	const fetchPopular = async instance => {
		if(!instance) return false
		loading = true
		try {
			///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
			const popularRequest = await fetch(`https://${instance}/api/v1/popular`)
			popular = await popularRequest.json()
			loading = false
			if(popular.length > 0) return popular
			else $chosen = chooseInstance($store.instances)
		} catch(err) {
			$chosen = chooseInstance($store.instances)
			error = 'No results or an error!'
			await fetchPopular($chosen)
			loading = false
		}
	}

	$: fetchPopular($chosen)
</script>

<div class="container">
	{#if loading}
		<Loader />
	{/if}
	{#if popular && popular.length > 0}
		<Videos videos={popular} chosen={$chosen} />
	{/if}
	{#if error}
		{error} <button on:click={() => $chosen = chooseInstance($store.instances)}>Try another instance?</button>
	{/if}
</div>