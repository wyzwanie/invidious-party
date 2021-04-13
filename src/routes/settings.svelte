
<script>
    import { store, chosen } from '$lib/_store'
    
    let filteredInstances

    const saveSettings = () => {
        $store = $store
        const { instances } = $store
        saveData.settings = $store.
		saveData.time = new Date().getTime();
		localStorage.saveData = JSON.stringify(saveData);
		console.log(saveData)
    }
    $: console.log($store.instances)
</script>

{#if $store && $store.instances && Object.keys($store.instances).length > 0}
    <h1>Settings</h1>
    <h3>Chose instances rotation:</h3>
    <ul style="list-style: none;">
        {#each Object.keys($store.instances) as uri, i}
            <li>
                <input type="checkbox" bind:checked={$store.instances[uri]}>
                <span style="margin-right:7px"></span>
                {uri}
                <span style="margin-right:7px"></span>
                {Object.values($store.instances)[i]}
            </li>
        {/each}
    </ul>
    <button on:click={saveSettings}>Save</button>
    <button on:click={() => window.location = chosen}>Back To Invidious</button>
{/if}