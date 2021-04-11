<script context="module">

	// export async function load({ page, fetch, session, context }) {
	// 	const data = await fetch(`${instance}/api/v1/popular`)

	// }
</script>

<script>
	import { store, chosen } from '$lib/_store'
	import { onMount } from 'svelte'

	import Videos from '$lib/Videos.svelte'

	let instances
	let error

	let storedProfile
	let filteredInstances

	let popular

	const fetchPopular = async instance => {
		if(!instance) return false
		try {
			const popularRequest = await fetch(`${instance}api/v1/popular`)
			popular = await popularRequest.json()
			if(popular.length > 0) return popular
			else {
				store.nextChosen()
				$chosen = $store.chosen
			}
			console.log(popular)
		} catch(err) {
			console.log(err)
			store.nextChosen()
			$chosen = $store.chosen
		}
		
	}

	$: fetchPopular($chosen)
	// $: console.log('/', $store)
</script>

<div class="container">
	{#if popular && popular.length > 0}
		<Videos videos={popular} chosen={$chosen} />
	{:else}
		...loading...or...error...<hr/>
	{/if}
</div>

{$chosen}
{error}
{JSON.stringify(filteredInstances)}