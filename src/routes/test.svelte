<script>
    import { onMount } from 'svelte'
    import { joinRoom } from 'trystero'

    let name
    let names = {}
    let message
    let messages = []

    let sendName
    let getName
    let sendMsg
    let getMsg

    onMount(async () => {
        const config = { appId: 'invidious.party' }
        const room = joinRoom(config, 'ytlink')

        sendName = room.makeAction('name')[0]
        getName = room.makeAction('name')[1]
        sendMsg = room.makeAction('msg')[0]
        getMsg = room.makeAction('msg')[1]

        room.onPeerJoin(id => {
            console.log(`${id} joined`)
            sendName(name, id)
        })
        getName((name, id) => (names[id] = name))
        getMsg((msg, id) => messages = [...messages, { id, text: msg }])

  })
</script>

<input type="text" bind:value={name} />
<button on:click={() => sendName(name)}>saveName</button>
<hr>
{JSON.stringify(names)}
<hr>
{#each messages as msg}
    {msg.id}: {msg.text}<br>
{/each}
<input type="text" bind:value={message}><button on:click={() => sendMsg(message)}>send</button>
<hr>
<!-- JSON.stringi -->
<!-- {#if XsendMsg}
<button on:click={() => XsendMsg({
    message: 'yooo',
    from: 'mama'
})}>S</button>
{/if}
{#if XsendMsg}
<button on:click={() => XgetMsg()}>G</button>
{/if} -->