<script>
    import { createEventDispatcher, onMount } from 'svelte'
    import Plyr from 'plyr'
    import 'plyr/dist/plyr.css'

    export let chosen
    export let videoAPI
    
    let player = {}

    let mediaMeta = {

    }

    onMount(() => {
        player = new Plyr('#player', {
            debug: true,
            iconUrl: '/plyr.svg',
            blankVideo: '/blankVideo.mp4'
        })
    })

    // <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=140" type="audio/mp4; codecs=&quot;mp4a.40.2&quot;" label="131392k" selected="true">
            
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=249" type="audio/webm; codecs=&quot;opus&quot;" label="63674k" selected="false">
        
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=250" type="audio/webm; codecs=&quot;opus&quot;" label="81133k" selected="false">
        
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=251" type="audio/webm; codecs=&quot;opus&quot;" label="154016k" selected="false">
    const asd = p => {
console.log(mediaMeta.audio)
        player.source = {
            type: 'audio',
            title: 'Example title',
            sources: [
                {
                    src: `https://${chosen}/latest_version?id=${videoAPI.videoId}&itag=140`,
                    type: 'audio/mp4'
                },
                {
                    src: `https://${chosen}/latest_version?id=${videoAPI.videoId}&itag=249`,
                    type: 'audio/webm'
                },
                {
                    src: `https://${chosen}/latest_version?id=${videoAPI.videoId}&itag=250`,
                    type: 'audio/webm'
                },
                {
                    src: `https://${chosen}/latest_version?id=${videoAPI.videoId}&itag=251`,
                    type: 'audio/webm'
                },
            ]
        }
        audioOnly = true
    }
    let audioOnly = false
</script>


<button on:click={asd}>ASD</button>

<pre>
    {JSON.stringify(videoAPI, null, 4)}
</pre>
{#if videoAPI && videoAPI.formatStreams}
<div class="video-wrapper">
<!-- {#if audioOnly}
    <div class="poster">
        <img src="{`https://${chosen}/vi/${videoAPI.videoId}/maxres.jpg`}" alt="poster" />
    </div>
{/if} -->
 <video controls playsinline data-poster={`https://${chosen}/vi/${videoAPI.videoId}/maxres.jpg`} id="player">
        <!-- Video files -->
        {#each videoAPI.formatStreams as stream}
            {#if stream.resolution}
                <source
                    src={`https://${chosen}/latest_version?id=${videoAPI.videoId}&itag=${stream.itag}`}
                    type={stream.type.split(';')[0]}
                    size={stream.size.split('x')[1]}
                >
            {/if}
        {/each}
        <!-- <source src="{}" type="video/mp4" size="720">
        <source src="@" type="video/mp4" size="1080">
        <source src="@" type="video/mp4" size="1440"> -->

        <!-- Caption files -->
        <track kind="captions" label="English" srclang="en" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
            default>
        <track kind="captions" label="Français" srclang="fr" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt">

        <!-- Fallback for browsers that don't support the <video> element -->
        <a href="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" download>Download</a>
    </video>
</div>
{:else}
    ...DUPA...
{/if}
<style>
:global(.plyr--video) {
    border-radius: 5px;
}
:global(:root) {
    --plyr-color-main: var(--accent);
    --plyr-menu-background: var(--bg-dark)
}
.video-wrapper {
    position: relative;
    padding-bottom: 56.25%;  /* acpect ratio 16/9*/
    height: 0;
}
:global(.plyr) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>