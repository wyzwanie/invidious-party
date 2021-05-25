<script>
    import { SUBs } from '$lib/stores/_localStore'
    import { convertCount } from '$lib/_helper'

    export let channelID
    export let subCount

    let isSubbed

    const sub = async channelID => {
        $SUBs = $SUBs.includes(channelID) ? $SUBs.filter(x => x!== channelID) : [...$SUBs, channelID]
    }

    $: isSubbed = $SUBs.includes(channelID)
</script>

<div class="sub" on:click={sub(channelID)}>
    <div class="text" class:isSubbed>{isSubbed ? 'subscribed' : 'subscribe '}</div>
    <div class="subCount">{convertCount(subCount)}</div>
</div>

<style>
.sub {
    display: flex;
    height: 100%;
    cursor: pointer;
}
.text {
    padding: 7px;
    background: var(--accent-dim);
    color: var(--text--80);
    font-weight: bold;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    transition: all 0.3s ease-in-out
}
.text:hover, .text.isSubbed {
    background: var(--accent);
    color: var(--text-180);
}
.subCount {
    padding: 7px;
    background: var(--text--80);
    color: var(--text-180);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    font-weight: bold;
}
</style>