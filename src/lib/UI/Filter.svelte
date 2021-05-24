<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    export let label = ''
    export let margin = false
    export let options = []
    export let selected = false
    export let search = false
    export let value = ''
    export let placeholder = ''
    export let flex = 1

    $: dispatch('change', selected)
</script>

<div class="wrapper" class:margin style="flex: {flex}">
    <div class="label">{label}</div>
    <div class="dropdown">
        <select bind:value={selected}>
            {#if typeof options[0] === 'object'}
                {#each options as o}
                    {#if o[1] === selected}
                        <option value={o[1]} selected>{o[0]}</option>
                    {:else}
                        <option value={o[1]}>{o[0]}</option>
                    {/if}
                {/each}
            {:else}
                {#each options as o}
                    {#if o === selected}
                        <option value={o} selected>{o}</option>
                    {:else}
                        <option value={o}>{o}</option>
                    {/if}
                {/each}
            {/if}
        </select>
    </div>
    {#if search}
        <input type="text" placeholder={placeholder}
            on:input={() => dispatch('input', value)} bind:value={value}
        />
    {/if}
</div>

<style>
.wrapper {
    display: flex;
    background: var(--bg-2);
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 7px;
    box-shadow: 0 0 2px var(--text--30);
}
.margin {
    margin-left: 7px;
}
.dropdown {
    position: relative;
    flex: 1;
}
.label {
    padding: 11px;
    font-weight: bold;
    color: var(--text--50);
    border-right: 1px solid var(--border);
    background: var(--bg-1);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    white-space: nowrap;
}
.dropdown select:focus {
    outline: none;
}
.dropdown select {
    background-color: var(--bg-2);
    color: var(--accent);
    font-size: inherit;
    font-weight: bold;
    padding: 10px;
    padding-right: 26px;
    border: 0;
    margin: 0;
    border-radius: 5px;
    text-indent: 0.01px;
    appearance: none;
    cursor: pointer;
    background: transparent;
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPScjNGVjZGM0JyBoZWlnaHQ9JzI0JyB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPScyNCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNNyAxMGw1IDUgNS01eicvPjxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnLz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: 5px;
    width: 100%;
}
option {
    background: var(--bg-0);
    color: var(--text--80)
}
input {
    margin: 0;
    background: var(--text--00);
    padding: 11px;
    font-size: 14px;
    border: none;
    border-left: 1px solid var(--border);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-left: 7px;
    color: var(--text--50);
    font-weight: bold;
    width: 100%;
}
input::placeholder {
    color: var(--text--30);
}
input:focus {
    outline: none;
}
@media (max-width: 600px) {
    .wrapper {
        margin-left: 0;
    }
}
</style>