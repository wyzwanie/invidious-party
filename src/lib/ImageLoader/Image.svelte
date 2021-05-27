<script>
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import { chooseInstance } from '$lib/helper'
    import { instances } from '$lib/Stores/localStore'

    export let src
    export let alt
    
    let loaded = false
    let thisImage

    onMount(() => {
        thisImage.onload = () => loaded = true
    })
    const replaceImage = () => {
        console.log('replacing')
        const src = thisImage.src
        const url = new URL(src).host
        thisImage.src = `https://${chooseInstance($instances)}${src.split(url)[1]}`
    }
</script>

<svg class:loaded viewBox="0 0 320 180"><rect width="100%" height="100%" fill="var(--text-100)"/></svg>
<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" on:error={replaceImage} />
<!-- {#if !loaded} -->
<!-- {/if} -->

<style>
svg {
    height: auto;
    transition: all 0.3s ease-out;
}
svg.loaded {
    width: 0;
    max-height: 0;
    height: 0;
    transform-box: view-box;
    transform: scale(0);
    visibility: hidden;
    display: none;
}
svg.loaded rect {
    width: 0;
    max-height: 0;
    height: 0;
    transform-box: view-box;
    transform: scale(0);
    visibility: hidden
}
img {
    height: auto;
    opacity: 0;
    transition: opacity 0.3s ease-out;
}
img.loaded {
    opacity: 1;
    object-fit: cover;
    object-position: center;
}
</style>
