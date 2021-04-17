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
    let nameContainer

    const config = { appId: 'invidious.party' }

    onDestroy(() => {if(room) room.leave()})

    $: if(!room || !Object.keys(room).length) {
        try {
            room = joinRoom(config, roomID)
        } catch(err) {
            console.log(err.message)
        }
    } else {
        peers = room.getPeers()

        sendName = room.makeAction('name')[0]
        getName = room.makeAction('name')[1]
        sendMsg = room.makeAction('msg')[0]
        getMsg = room.makeAction('msg')[1]

        if(names.self) sendName(names.self)
        room.onPeerJoin(id => {
            if(names.self) sendName(names.self, id)
            if(!names[id]) sendMessage(`someone joined as viewer`, 'app')
            else sendMessage(`${names[id]} joined the party!`, 'app')
        })
        room.onPeerLeave(id => {
            if(names[id]) {
                sendMessage(`${names[id]} just left...`, 'app')
                delete names.id
            } else sendMessage(`viewer left`, 'app') 
            delete names.id
        })

        getName((n, id) => names[id] = n)
        getMsg((msg, id) => {
            console.log('msg', msg)
            const { text, timestamp } = msg
            messages = [...messages, { id, text, timestamp }]
            if(!namesColors[id]) namesColors[id] = "#" + ((1<<24)*Math.random() | 0).toString(16)
        })
    }

    $: console.log(names)
    let chatHelp = false

    const sendMessage = (msg, id) => {
        const msgObj = {
            id: id || 'self',
            name: '',
            text: msg,
            timestamp: new Date().getTime()
        }
        messages = [...messages, msgObj]
        sendMsg(msgObj)
        message = ''
    }
    const setName = n => {
        name = n
        names['self'] = n
        namesColors['self'] = "#" + ((1<<24)*Math.random() | 0).toString(16)
    }
</script>

<div class="chat">
    <div class="info">
        <span style="font-size: 1.382em;font-weight: bold;">Welcome to p2p chat</span>
        <span class="help" on:click={() => chatHelp = !chatHelp}>?</span>
        {#if chatHelp}
            <p>There are no servers involved, all communication is uncensorable, unlimited, no logs are stored or sent anywhere.</p>
            <p>Anyone can pick any name they want, colors are based on uniqueIDs and randomized everytime somone joins.</p>
            <p>made possible by brilliant package: <a href="https://github.com/dmotz/trystero">https://github.com/dmotz/trystero</a>
            <p><b>use it at your own risk, you've been warned.</b></p>
        {/if}
    </div>
    {#if !names.self}
        <div class="namePicker">
            <input placeholder="Pick a name" type="text" bind:this={nameContainer} />
            <button on:click={() => {setName(nameContainer.value)}}>pick</button>
        </div>
        <div style="padding: 7px;">
            <p>There are no servers involved, all communication is uncensorable, unlimited, no logs are stored or sent anywhere.</p>
            <p>Anyone can pick any name they want, colors are based on uniqueIDs and randomized everytime somone joins.</p>
            <p>made possible by brilliant package: <a href="https://github.com/dmotz/trystero">https://github.com/dmotz/trystero</a>
            <p><b>use it at your own risk, you've been warned.</b></p>
        </div>
    {/if}
    <div class="chatBox">
        <div class="messagesBox">
            <div class="messages">
                {#key messages}
                    {#each messages as msg}
                        {#if msg.id !== 'app'}
                            <div class="message">
                                <b style="color: {namesColors[msg.id]}">{names[msg.id]}</b>: {msg.text}<br>
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
        {#if names.self}
            <div class="inputBox">
                <input type="text" on:keyup={e => {if(e.key === 'Enter') sendMessage(message)}} bind:value={message}>
                <button on:click={() => sendMessage(message)}>send</button>
            </div>
        {/if}
    </div>
    <div class="peersBox">
        {#if Object.keys(names).length > 0}
            #of peers: {Object.keys(names).length}
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
.info {
    position: relative;
    background: var(--bg-menus);
    padding: 7px;
    border-top-right-radius: 5px;
    height: 42px;
}
.help {
    position: absolute;
    right: 0;
    top: 0;
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
.chat {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--bg-dark-second);
    border: 1px solid var(--bg-dark-second);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
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
    flex: 1 1 89%;
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
    background: var(--bg-dark);
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
    border-top:1px solid var(--bg-dark-second);
}
</style>