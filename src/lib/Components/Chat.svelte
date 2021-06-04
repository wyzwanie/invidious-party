<script>
    import { afterUpdate, beforeUpdate, onDestroy, onMount } from 'svelte'
    
    import randomColor from 'randomcolor'
    import { joinRoom, selfId } from 'trystero/torrent'
    
    import { domain } from '$lib/config'
    import { nick, settings } from '$lib/Stores/localStore'
    import { chosen, peers, party, actions } from '$lib/Stores/memoryStore'
    
    export let roomID
    export let height

    let names = {}
    let namesColors = {}
    let message
    let messages = []

    let sendName
    let getName
    let sendMsg
    let getMsg
    
    let nameContainer
    let chatHelp
    let autoscroll
    let chatBox

    let chatRoom

    const initChat = roomID => {
        const config = { appId: domain }

        if(!chatRoom) chatRoom = joinRoom(config, roomID)
    }





    const setName = n => {
        $nick = n
        $peers['self'] = { nick: n }
        $peers = $peers
        namesColors['self'] = randomColor({ luminosity: 'bright' })
    }
    const sendMessage = (msg, id) => {
        const msgObj = {
            id: 'self',
            text: msg,
            timestamp: new Date().getTime()
        }
        messages = [...messages, msgObj]
        $actions.chat[0](msgObj)
        message = ''
    }

    onMount(() => {
        console.log($party)
        $party.joinRoom({ appId: 'invidious.party' }, roomID)
    })
    beforeUpdate(() => {
        autoscroll = chatBox && chatBox.offsetHeight + chatBox.scrollTop > chatBox.scrollHeight - 50
    })
    afterUpdate(() => {
        if(autoscroll) chatBox.scrollTo(0, chatBox.scrollHeight);
    })
    
    $: if($nick) $peers['self'] = { nick: $nick }
    $: if($actions) {
        $actions.chat[1]((msg, id) => {
            console.log('msg', msg)
            const { text, timestamp } = msg
            messages = [...messages, {
                id,
                text,
                timestamp
            }]
            if(!namesColors[id]) namesColors[id] = randomColor({ luminosity: 'bright' })
        })
    }

    $: console.log($party)
</script>

<div class="chat">
    <div class="info">
        <span style="font-size: 1.382em;font-weight: bold;">{$nick}, Welcome to p2p chat </span>
        <span class="help" on:click={() => chatHelp = !chatHelp}>?</span>
        {#if chatHelp}
            <p>There are no servers involved, all communication is uncensorable, unlimited, no logs are stored or sent anywhere.</p>
            <p>Anyone can pick any name they want, colors are based on uniqueIDs and randomized everytime somone joins.</p>
            <p>made possible by brilliant package: <a href="https://github.com/dmotz/trystero">https://github.com/dmotz/trystero</a>
            <p><b>use it at your own risk, you've been warned.</b></p>
        {/if}
    </div>
    {#if !$nick}
        <div class="namePicker">
            <input placeholder="Pick a name" type="text" bind:this={nameContainer} />
            <button on:click={() => setName(nameContainer.value)}>pick</button>
        </div>
        <div style="padding: 7px;">
            <p><b>use it at your own risk, you've been warned.</b></p>
        </div>
    {/if}
    <div class="chatBox" style="max-height:{height-106}px; overflow-y:auto" bind:this={chatBox}>
        <div class="messagesBox">
            <div class="messages">
                {#key messages}
                    {#each messages as msg}
                        {#if msg.id !== 'app'}
                            <div class="message">
                                <b style="color: {namesColors[msg.id]}">{$peers[msg.id].nick}</b>: {msg.text}<br>
                                <span>{new Date(msg.timestamp).toLocaleTimeString() }<br>{msg.id}</span><br>
                            </div>
                        {:else}
                            <div class="notifications">
                                {msg.text}
                            </div>
                        {/if}
                    {/each}
                {/key}
            </div>
        </div>
    </div>
    <div class="peersBox">
        {#if $nick}
            <div class="inputBox">
                <input type="text" on:keyup={e => {if(e.key === 'Enter') sendMessage(message)}} bind:value={message}>
                <button on:click={() => sendMessage(message)}>send</button>
            </div>
        {/if}
        {#if Object.keys($peers).length > 0}
            #of peers: {Object.keys($peers).length}
        {:else}
            status: searching for peers...
        {/if}
        <!-- {#each Object.keys(names) as ID}
            <div class="peer">
                <span style="color:{namesColors[ID]}"></span>
                <span style="font-size:90%;">{ID}</span>
            </div>
        {/each} -->
    </div>
</div>
<!-- {/if} -->
<style>
.chat {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 5px;
}
.info {
    position: relative;
    background: var(--bg-2);
    padding: 7px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}
.help {
    position: absolute;
    right: 7px;
    top: 7px;
    color: var(--accent);
    border: 2px solid var(--accent);
    border-radius: 50%;
    width: 1.3em;
    height: 1.3em;
    display: flex;
    font-size: 1.1em;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.help:hover {
    filter: grayscale(0.618)
}
.namePicker {
    display: flex;
    padding: 7px;
}
.chatBox {
    display: flex;
    flex-direction: column;
    height: calc(100% - 31px);
}
.inputBox {
    display: flex;
    padding: 3px;
}
input {
    font-size: 1em;
    padding: 7px;
    background: rgb(59 59 59);
    color: white;
    border: 1px solid #3b3b3b;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    width: 100%
}
input:focus {
    outline: none;
}
button {
    font-size: 1em;
    font-weight: bold;
    padding: 7px;
    background: var(--accent);
    border: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    flex: 1 1 11%;
    cursor: pointer;
}
.messagesBox {
    height: 100%;
    background: var(--bg-1);
}
.message {
    position: relative;
    display: flex;
    padding: 7px;
}
.message span {
    position: absolute;
    bottom: 3px;
    right: 3px;
    font-size: 61.8%;
}
.message:nth-child(2n) {
    background: rgb(0,0,0,0.381);
}
.notifications {
    background: #515151;
    padding: 7px;
    color: white;
}
.peersBox {
    padding: 7px;
    border-top:1px solid var(--bg-2);
}
</style>