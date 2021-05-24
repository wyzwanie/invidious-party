<script>
    import { onMount } from 'svelte'

    export let src
    export let alt
    
    let loaded = false
    let thisImage

    onMount(() => {
        thisImage.onload = () => loaded = true
    })
</script>

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" />

<style>
img {
    height: 200px;
    opacity: 0;
    transition: opacity 1200ms ease-out;
}
img.loaded {
    opacity: 1;
    object-fit: cover;
    object-position: center;
}
</style>
