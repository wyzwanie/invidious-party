<script>
	import { chooseInstance, sleep } from '$lib/_helper'
	import { store, chosen } from '$lib/_store'
	
	import AsyncError from '$lib/AsyncError.svelte'
	import AsyncLoading from '$lib/AsyncLoading.svelte'
	import Videos from '$lib/Videos.svelte'

	let counter = 0
	let retry = false

	const fetchPopular = async instance => {
		if(counter > 10) {
            counter = 0
            return { error: 'is everything OK? too many retries...' }
        }
		try {
			///api/v1/videos/aqz-KE-bpKQ?fields=videoId,title,description
			const req = await fetch(`https://${instance}/api/v1/popular`)
			const res = await req.json()
			counter++
			return res
		} catch(err) {
            retry = true
            counter++
		}
	}

	$: if(retry) {
        $chosen = chooseInstance($store.instances)
        retry = false
    }
</script>


{#await fetchPopular($chosen)}
	<AsyncLoading chosen={$chosen} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{:then videos}
	<Videos {videos} chosen={$chosen} on:empty={() => {console.log('asd');$chosen = chooseInstance($store.instances)}} />
{:catch error}
	<AsyncError {error} on:rotate={() => $chosen = chooseInstance($store.instances)} />
{/await}