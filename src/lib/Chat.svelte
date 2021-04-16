<script>
    import { onDestroy } from 'svelte'
    import { joinRoom } from 'trystero'

    export let roomID

    let name
    let names = {}
    let namesColors = {}
    let message
    let messages = []

    let sendName
    let getName
    let sendMsg
    let getMsg

    let room
    let peers

    const config = { appId: 'invidious.party' }

    const sendMessage = (msg, id) => {
        const msgObj = {
            id: id || 'self',
            text: msg,
            timestamp: new Date().getTime()
        }
        messages = [...messages, msgObj]
        sendMsg(msgObj)
        message = ''
    }
    const setName = name => {
        names['self'] = name
        namesColors['self'] = "#" + ((1<<24)*Math.random() | 0).toString(16)
        sendName(name)
    }

    onDestroy(() => room.leave())

    $: if(!room) {
        room = joinRoom(config, roomID)
    } else {
        setTimeout(() => peers = room.getPeers(), 1000)
        sendName = room.makeAction('name')[0]
        getName = room.makeAction('name')[1]
        sendMsg = room.makeAction('msg')[0]
        getMsg = room.makeAction('msg')[1]

        room.onPeerJoin(id => {
            sendName(name, id)
            peers = room.getPeers()
        })
        room.onPeerLeave(id => {
            delete names.id
            peers = room.getPeers()
        })
        getName((name, id) => (names[id] = name))
        getMsg((msg, id) => {
            const { text, timestamp } = msg
            messages = [...messages, { id, text, timestamp }]
            if(!namesColors[id]) namesColors[id] = "#" + ((1<<24)*Math.random() | 0).toString(16)
        })
    }
    
</script>

<h2>Welcome to p2p chat</h2>
<p>There are no servers involved, all communication is uncensorable, unlimited, no logs are stored or sent anywhere.</p>
<p>Anyone can pick any name they want, colors are based on uniqueIDs and randomized everytime somone joins.</p>
<p>made possible by brilliant package: <a href="https://github.com/dmotz/trystero">https://github.com/dmotz/trystero</a>
<hr>
<!-- {#if room} -->
    {#if !names.self}
        Pick a name:<br>
        <input type="text" bind:value={name} />
        <button on:click={() => setName(name)}>saveName</button>
        <hr>
    {/if}
    <div class="chat">
        <div class="chatBox">
            <div class="messagesBox">
                <div class="messages">
                    {#key messages}
                        {#each messages as msg}
                            <div class="message">
                                <b style="color: {namesColors[msg.id]}">{names[msg.id]}</b>: {msg.text}<br>
                                <span>{new Date(msg.timestamp).toLocaleTimeString() }<br>{msg.id}</span><br>
                            </div> 
                        {/each}
                    {/key}
                </div>
            </div>
            <div class="inputBox">
                <input type="text" on:keyup={e => {if(e.key === 'Enter') sendMessage(message)}} bind:value={message}>
                <button on:click={() => sendMessage(message)}>send</button>
            </div>
        </div>
        <div class="peersBox">
            {#if peers}
                #of peers: {peers.length}
            {:else}
                ...gathering...
            {/if}
            {#each Object.keys(names) as ID}
                <div class="peer">
                    <span style="color:{namesColors[ID]}"></span>
                    <span style="font-size:90%;">{ID}</span>
                </div>
            {/each}
        </div>
    </div>
<!-- {/if} -->
<style>
h2,p {
    margin: 0;
}
.chat {
    display: flex;
}
.chatBox {
    flex: 1 1 61.8%;
}
.inputBox {
    display: flex;
}
.inputBox input {
    display: flex;
    width: 100%;
    padding: 7px;
    background: rgb(59 59 59);
    color: white;
    border: none;
    border: 1px solid #3b3b3b;
}
.inputBox input:focus {
    outline: none;
}
.messagesBox {
    min-height: 420px;
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
.peersBox {
    /* min-width: 213px; */
}
</style>