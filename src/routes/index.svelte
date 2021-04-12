<script>
	import { store, chosen } from '$lib/_store'
	
	import Loader from '$lib/Loader.svelte'
	import Videos from '$lib/Videos.svelte'

	let error
	let filteredInstances
	let loading
	let popular

	const fetchPopular = async instance => {
		if(!instance) return false
		loading = true
		try {
			const popularRequest = await fetch(`${instance}api/v1/popular`)
			popular = await popularRequest.json()
			loading = false
			if(popular.length > 0) return popular
			else {
				store.nextChosen()
				$chosen = $store.chosen
			}
		} catch(err) {
			console.log(err)
			store.nextChosen()
			$chosen = $store.chosen
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
		No results or an error! <button on:click={() => { store.nextChosen();$chosen = $store.chosen; }}>Try another instance?</button>
	{/if}
</div>