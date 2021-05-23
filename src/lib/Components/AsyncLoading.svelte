<script>
    import { createEventDispatcher } from 'svelte'
    import { sleep } from '$lib/_helper'

    import Loading from '$lib/UI/Loading.svelte'

    export let chosen

    const dispatch = createEventDispatcher()
</script>

<p>...fetching from {chosen}...</p>
<Loading />
{#await sleep(2000) then value}
    <div class="df">
        <p>Instance too slow?</p>
        <button on:click={() => dispatch('disable')}>Disable it in your rotation list</button>
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