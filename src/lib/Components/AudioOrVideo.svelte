<script>
    import { createEventDispatcher } from 'svelte'

    import CameraIcon from '$lib/Icons/CameraIcon.svelte'
    import HeadphonesIcon from '$lib/Icons/HeadphonesIcon.svelte'
    import Tooltip from '$lib/UI/Tooltip.svelte'

    export let currentMode

    const dispatch = createEventDispatcher()
</script>

{#if currentMode === 'video'}
<Tooltip text="audio only mode">
    <HeadphonesIcon fill=var(--text--80) on:click={() => {
       currentMode = 'audio'
       dispatch('changed', 'audio')
    }} />
</Tooltip>
{/if}
{#if currentMode === 'audio'}
<Tooltip text="video mode">
    <CameraIcon fill=var(--text--80) on:click={() => {
        currentMode = 'video'
        dispatch('changed', 'video')
     }} />
</Tooltip>
{/if}