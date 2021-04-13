<script>
    import { onMount, afterUpdate } from 'svelte'
    import Header from '$lib/Header.svelte'

    import { store, chosen } from '$lib/_store'
    import { getInstances, chooseInstance, saveLocal } from '$lib/_helper'

    let currentPage
    let searchTerm

    const changeTheme = e => {
        $store = {
            ...$store,
            theme: e.detail
        }
        saveLocal(false, e.detail)
        document.documentElement.classList.toggle('light')
    }

    onMount(async () => {
        if(!localStorage.instances || localStorage.instances === '{}') {
            const instances = await getInstances()
            //save instances and set default theme to localStorage
            saveLocal(instances, false)
            $store = {
                instances,
                lastUpdate: localStorage.lastUpdate,
                theme: false,
            }
        } else {
            $store = {
                instances: JSON.parse(localStorage.instances),
                lastUpdate: localStorage.lastUpdate,
                theme: localStorage.theme === undefined ? false : JSON.parse(localStorage.theme),
            }
        }
        $chosen = chooseInstance($store.instances)
        //if light theme toggle class
        if($store.theme) document.documentElement.classList.toggle('light')
    })


    afterUpdate(() => {
        currentPage = window.location.pathname
        if(currentPage.includes('/search')) searchTerm = window.decodeURI(window.location.search.split('=')[1])
    })
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