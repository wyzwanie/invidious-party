<script>
    import { createEventDispatcher } from 'svelte'
    import { sleep } from '$lib/_helper'

    import Loader from '$lib/Loader.svelte'
    import Rotate from '$lib/Rotate.svelte'

    export let chosen

    const dispatch = createEventDispatcher()
</script>

<p>...fetching from {chosen}...</p>
<Loader />
{#await sleep(2000) then value}
    <div class="df">
        <p>Instance too slow?</p>
        <Rotate on:rotate />
        <p style="font-size: 90%">click Rotate to try on next invidious instance</p>
    </div>
{/await}

<style>
    .df {
        align-items: center;
    }
    .df p {
        padding: 7px;
    }
</style>