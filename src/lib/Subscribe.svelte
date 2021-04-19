<script>
    import { store, chosen, subStore, ipfs } from '$lib/_store'
    import { chooseInstance, convertCount, saveLocal } from '$lib/_helper'

    export let channelID
    export let subCount
    let tmp
    const sub = async channelID => {
        if(!$subStore.includes(channelID)) $subStore = [...$subStore, channelID]
        else alert('unsub?')
        const saveToIpfs = await $ipfs.dag.put({
            subscriptions: $subStore
        })
        saveLocal({ subscriptions: { array: $subStore, cid: saveToIpfs.toString() }})
        tmp = saveToIpfs.toString()
    }
</script>
{tmp}
<div class="sub" on:click={sub(channelID)}>
    <span class="subCount">Subscribe <span>{convertCount(subCount)}</span></span>
    <!-- <span class="totalViews">Total views: {channel.totalViews}</span> -->
</div>