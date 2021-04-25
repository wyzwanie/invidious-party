<script>
	import { chooseInstance } from '$lib/_helper'
	import { chosen } from '$lib/_store'
	import { instances } from '$lib/_localStore'
	
	import AsyncError from '$lib/AsyncError.svelte'
	import AsyncLoading from '$lib/AsyncLoading.svelte'
	import Videos from '$lib/Videos.svelte'

	let retry = false

	const fetchPopular = async instance => {
		try {
			///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
			const req = await fetch(`https://${instance}/api/v1/popular`)
			const res = await req.json()
			return res
		} catch(err) {
            retry = true
		}
	}

	const disableInstance = chosen => {
		console.log('disable started')
		const index = $instances.findIndex(x => x[0] === chosen)
		$instances[index][1].enabled = false
		$instances = $instances
	}

	$: if(retry) {
        $chosen = chooseInstance($instances)
        retry = false
    }
</script>

{#if chosen}
	{#await fetchPopular($chosen)}
		<AsyncLoading chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
	{:then videos}
		<Videos {videos} chosen={$chosen} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
	{:catch error}
		<AsyncError {error} on:disable={() => {disableInstance($chosen);$chosen = chooseInstance($instances)}} />
	{/await}
{/if}