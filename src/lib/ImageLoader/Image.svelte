<script>
    import { onMount } from 'svelte'
    import { chooseInstance } from '$lib/helper'
    import { instances } from '$lib/Stores/localStore'

    export let src
    export let alt
    export let size = '320x180'
    
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

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" on:error={replaceImage} />
{#if !loaded}
    <svg class:loaded viewBox="0 0 {size.split('x')[0]} {size.split('x')[1]}"><rect width="100%" height="100%" fill="var(--text-100)"/></svg>
{/if}


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
    height: 0;
    opacity: 0;
    transition: opacity 0.6s ease-out;
}
img:after {
    display: block;
    content: "";
    width: 100%;
    padding-top: 56.25%;
    background-color: rgba(0,0,0,0.1);
}
img.loaded {
    height: 100%;
    opacity: 1;
    object-fit: cover;
    object-position: center;
}
</style>
