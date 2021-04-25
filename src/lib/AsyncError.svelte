<script>
    import { createEventDispatcher } from 'svelte'
    import Rotate from '$lib/Rotate.svelte'

    export let error
    const dispatch = createEventDispatcher()
</script>

<div class="df">
    <h3>error</h3>
    {#if error.message}
        {error.message}
    {:else}
        {error}
    {/if}<br>
    Instance shows errors too often?<br>
    <button on:click={() => dispatch('disable')}>Disable it in your rotation list</button><br>
    <p style="font-size: 90%">OR click Rotate icon next to search, to try on next invidious instance</p>
</div>

<style>
.df {
    align-items: center;
}
.df p {
    padding: 7px;
}
</style>