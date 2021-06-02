<script>
    import { createEventDispatcher } from 'svelte'

    export let error
    const dispatch = createEventDispatcher()
</script>

<div class="error">
    <div class="message">
        <span style="font-weight: 500;">ERROR:</span>
        {#if error.message}
            {error.message}
        {:else}
            {JSON.stringify(error)}
        {/if}
    </div>
    <div class="info">
        <p>Instance shows errors too often?</p>
        <button on:click={() => dispatch('disable')}>Disable it in your rotation list</button><br>
        <p style="font-size: 90%">OR click Rotate icon next to search, to try on next invidious instance</p>
    </div>
</div>

<style>
.message {
    margin-bottom: 11px;
}
</style>