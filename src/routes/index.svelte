<script>
    // import { onMount } from 'svelte'
    // import { Fetch } from '$lib/helper'
    // import { chosen } from '$lib/Stores/memoryStore'

    // let test

    // $: if($chosen) {
    //     test = new Fetch($chosen, '/popular/')
    //     test.on('err', err => console.log('yea!!', err))
    // }

    import IntersectionObserver from '$lib/ImageLoader/IntersectionObserver.svelte'
    // $: console.log($chosen, test)
</script>

<div style="display:flex; flex-direction: column;">
    [TODO]
<!-- <button on:click={async () => {
    const wynik = await test.go()
    console.log('wynik:', wynik)
}}>test</button> -->

<!-- {#each [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9] as test}
<IntersectionObserver once={true} let:intersecting={intersecting}>
    <div style="padding: 70px">{test}</div>
    {#if intersecting}
      intersecting: {alert(test)}
    {/if}
  </IntersectionObserver> 
{/each} -->

</div>