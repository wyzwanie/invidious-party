<script>
    import { onMount } from 'svelte'
    
    import IntersectionObserver from './IntersectionObserver.svelte'
    import Image from './Image.svelte'

    export let src
    export let alt
    export let size
    
    let nativeLoading = false
    // Determine whether to bypass our intersecting check
    onMount(() => {
      if ('loading' in HTMLImageElement.prototype) {
        nativeLoading = true
      }
    })
    
  </script>
  
  <IntersectionObserver once={true} let:intersecting={intersecting}>
    {#if intersecting || nativeLoading}
      <Image {alt} {src} {size} />
    {/if}
  </IntersectionObserver> 