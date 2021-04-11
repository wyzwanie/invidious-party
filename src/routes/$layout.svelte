<script>
    import { onMount } from 'svelte'
    import Header from '$lib/Header.svelte'

    import { store, chosen } from '$lib/_store'

    let filteredInstances = {}

    const getInstances = async () => {
        let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
        let allInstances = await instancesRequest.json()
        allInstances.forEach(instance => {
            if(instance[1].type === 'https' && instance[1].monitor && instance[1].monitor.statusClass === 'success') {
                let uri = instance[1].uri
                if(uri[uri.length-1] !== '/') uri = `${uri}/`
                filteredInstances[uri] = instance[1].flag
            }
        })
    }
    const chooseInstance = instances => {
        let tempInstances = []
        if(!Object.keys(instances).length) return 'oops something went wrong'
        Object.keys(instances).forEach(i => {
            if(instances[i]) tempInstances.push(i)
        })
        if(!tempInstances.length) return 'no valid instances'
        return tempInstances[Math.floor(Math.random()*tempInstances.length)]
    }

    onMount(async () => {
        if(!localStorage.instances || localStorage.instances === '{}') {
            await getInstances()
            localStorage.instances = JSON.stringify(filteredInstances)
            $store.instances = filteredInstances
            localStorage.lastUpdate = new Date().toJSON()
            $store.lastUpdate = localStorage.lastUpdate
        } else {
            $store.instances = JSON.parse(localStorage.instances)
            $store.lastUpdate = localStorage.lastUpdate
        }
        $chosen = chooseInstance($store.instances)
        store.chosen = $chosen

        console.log(localStorage)
        console.log('local', localStorage.instances)
        console.log('store', $store)
    })
    // $: if($store && $store.chosen) $chosen = $store.chosen
    $: console.log($chosen)
</script>

<Header chosen={$chosen} on:next={() => {store.nextChosen();$chosen=$store.chosen}} />

<main>
    <slot></slot>
</main>

<footer>

</footer>

<style>
:global(body) {
    max-width: 83.33333%;
    margin: 0 auto;
}
</style>