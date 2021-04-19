<script>
    import { createEventDispatcher } from 'svelte'
    import Rotate from '$lib/Rotate.svelte'

    export let error
    const dispatch = createEventDispatcher()
</script>

<div class="df">
    {#if error.message}
        {error.message}
    {:else}
        {error}
    {/if}<br>
    <Rotate on:rotate />
    <p style="font-size: 90%">click Rotate button to try on next invidious instance</p>
</div>

<style>
.df {
    align-items: center;
}
.df p {
    padding: 7px;
}
</style>