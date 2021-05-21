<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
</script>

<h1>Greetings Explorer!</h1>
<div class="row">
    <div class="left">
        <p>You have reached <span>invidious.party</span> a site where <a href="https://github.com/iv-org/invidious">invidious</a> instances have a party 🎉<br>
        [DONATE->list of all instances and their donation addresses + project donation links]<br>
        <!-- This party would not be possible if not for brilliant invidious, which allows you to watch youtube videos, without them ever knowing who requested that video.<br> -->
        <span>invidious.party</span> is a fully static site build using <a href="https://svelte.dev">SvelteKit</a> and hosted on <a href="https://ipfs.io">IPFS</a><br>
        as there are no central servers to store any of your data (by design and principle)<br>
        here you own your data. with freedom comes responsibility.</p>
        [...]
    </div>
    <div class="right">

    </div>
</div>
<div class="row">
    <div class="left">
        <h3 style="margin-bottom: -10px; font-size: 1.25em">there are couple ways you can use <span>invidious.party</span>:</h3>
        <h4 style="margin-bottom: -10px; font-size: 1.25em">soloMODE</h4>
        <p>in soloMODE your browser communicates only with invidious instances to serve you content.<br>
        by default your subscriptions and settings are stored only in browser' localStorage[#]<br>
        because of that if you switch browser or clear history you will lose data you've saved<br>
        if you want to share your data with a friend or another device you can do so using bookmarks and QRcodes
        this solution apart from obvious drawback that everytime you add a subscription you need to bookmark new address [maybe some snippet?]
        has a limitation on maximum number of subscriptions (150) or videos in playlist (500) per link
        </p>
    </div>
    <div class="right">
        SOME TOGGLES<br>
        maybe enable IPFS or GUN for soloMODE persistent storage
    </div>
</div>
<div class="row">
    <div class="left">
        <h4 style="margin-bottom: -10px; font-size: 1.25em">partyMODE</h4>
        <p>in order to have a party there needs to be a way for browsers to communicate between each other.<br>
        unfortunately due to limitations in <a href="https://medium.com/quick-code/webrtc-advantages-technical-hurdles-and-a-case-study-4737d6ccd1a0">webRTC [2]</a> there needs to be some remote machine,<br>
        that will help browsers (peers) to discover themselfs</p>
        <p>made possible thanks to brilliant package <a href="https://github.com/dmotz/trystero">trystero</a><br>
        in partyMODE we use torrent trackers to find tunnels in order for party to happen, after a tunnel is established between peers communication is direct peer2peer.<br>
        when you are in partyMODE ?? <span>invidious.party</span> broadcasts videoId you watch,<br>
        so other peers having a party at the same time,<br>
        can see dynamically what other party members are watching, what is watched the most etc.<br>
        and have fun in (to be encrypted) global public p2p chat<br>
        additionally? when in partyMODE on every video/channel page there chat room for that specific video/channel.<br>
        chat does not hold history, nor there are any moderators.<br>
        on one hand that makes you pretty close to anonymous, but you don't know who is listening.<br>
        it is not feasible to try to try to track everyone, but with enough resources it is possible to track you down.</p>
        <p><b>YOU'VE BEEN WARNED</b></p>
        <button on:click={() => dispatch('consent', 'solo')}>ACCEPT and go soloMODE</button>   \ <button on:click={() => dispatch('consent', 'party')}>ACCEPT and go partyMODE</button>
    </div>
    <div class="right">
        SOME TOGGLES<br>
        or information that toggle to enable partyMODE is in the header<br>
        torrent trackers:-there are some default already build in, but if you would like to pick your own you can change that in settings<br>
    </div>
</div>



<style>
.row {
    display: flex;
}
.left {
    flex-basis: 68.1%;
}
.right {
    flex: 1;
    padding: 2em;
    margin-top: 4em;
}

p, li {
    font-size: 120%;
    color: rgba(255,255,255,0.8)
}
h1, h4 {
    color: rgba(255,255,255,0.9);
    margin-bottom: -10px;
}
</style>