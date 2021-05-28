<script>
    import { onMount } from 'svelte'
    import { Fetch } from '$lib/helper'
    import { chosen } from '$lib/Stores/memoryStore'

    let test

    $: if($chosen) {
        test = new Fetch($chosen, '/popular/')
        test.on('err', err => console.log('yea!!', err))
    }

    $: console.log($chosen, test)
</script>

<div>
    [TODO]
<button on:click={async () => {
    const wynik = await test.go()
    console.log('wynik:', wynik)
}}>test</button>
</div>