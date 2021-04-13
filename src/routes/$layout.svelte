<script>
    import { onMount, beforeUpdate } from 'svelte'
    import Header from '$lib/Header.svelte'

    import { store, chosen } from '$lib/_store'

    let currentPage
    let searchTerm
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
            localStorage.lastUpdate = new Date().toJSON()
            localStorage.theme = false
            $store.instances = filteredInstances
            $store.lastUpdate = localStorage.lastUpdate
            $store.theme = false
        } else {
            $store.instances = JSON.parse(localStorage.instances)
            $store.lastUpdate = localStorage.lastUpdate
            $store.theme = localStorage.theme === undefined ? false : JSON.parse(localStorage.theme)
        }
        $chosen = chooseInstance($store.instances)
        store.chosen = $chosen
        $store = $store
        if($store.theme) document.documentElement.classList.toggle('light')
        console.log($store.theme)
    })
    beforeUpdate(() => {
        currentPage = window.location.pathname
        if(currentPage === '/search') searchTerm = window.location.search.split('=')[1]
    })
    const changeTheme = e => {
        $store.theme = e.detail
        $store = $store
        localStorage.theme = $store.theme
		localStorage.lastUpdate = new Date().getTime()
        document.documentElement.classList.toggle('light')
    }
    $: console.log($store.theme)
</script>

<Header {currentPage} {searchTerm} chosen={$chosen}
    on:next={() => {store.nextChosen();$chosen=$store.chosen}}
    status={$store.theme}
    on:theme={changeTheme}
/>

<main>
    <slot></slot>
</main>

<footer>

</footer>

<style>
:global(body) {
    background: var(--bg-dark);
    color: var(--txt-dark);
    position: relative;
}
:global(html.light) {
    filter: invert(1) hue-rotate(180deg);
}
:global(html.light img) {
    filter: invert(1) hue-rotate(180deg);
}
:global(main) {
    max-width: 83.33333%;
    margin: 0 auto;
    padding-left: 94px;
    padding-top: 1em;
}
</style>