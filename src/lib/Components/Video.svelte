<script>
    import { onMount } from 'svelte'
    import Plyr from 'plyr'
    import 'plyr/dist/plyr.css'

    export let chosen
    export let videoAPI
    export let borderRadiusTop = true
    
    let player = {}
    let dashSource = videoAPI.dashUrl || false
    let dash = false

    onMount(() => {
        player = new Plyr('#player', {
            debug: true,
            iconUrl: '/plyr.svg',
            blankVideo: '/blankVideo.mp4'
        })
        player.on('error', () => {
            dash = true
        })
        const wrapper = document.querySelector('.plyr__video-wrapper')
        const plr = document.querySelector('.plyr')
        if(borderRadiusTop) {
            plr.style.borderRadius = '5px'
            wrapper.style.borderRadius = '5px'
        }
        else {
            plr.style.borderBottomLeftRadius = '5px'
            // plr.style.borderBottomRightRadius = '5px'
            wrapper.style.borderBottomLeftRadius = '5px'
            // wrapper.style.borderBottomRightRadius = '5px'
        }
    })

    // <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=140" type="audio/mp4; codecs=&quot;mp4a.40.2&quot;" label="131392k" selected="true">
            
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=249" type="audio/webm; codecs=&quot;opus&quot;" label="63674k" selected="false">
        
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=250" type="audio/webm; codecs=&quot;opus&quot;" label="81133k" selected="false">
        
    //         <source src="/latest_version?id=DTvS9lvRxZ8&amp;itag=251" type="audio/webm; codecs=&quot;opus&quot;" label="154016k" selected="false">
    const asd = p => {
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

<svelte:head>
    {#if dash}
        <script src="https://cdn.dashjs.org/latest/dash.all.min.js" on:load={() => {
                const dash = dashjs.MediaPlayer().create()
                const video = document.querySelector('video')
                dash.initialize(video, dashSource, true)
                player = new Plyr(video)
        }} />
    {/if}
</svelte:head>


{#if videoAPI && videoAPI.formatStreams}
    <div class="video-wrapper">
    <!-- {#if audioOnly}
        <div class="poster">
            <img src="{`https://${chosen}/vi/${videoAPI.videoId}/maxres.jpg`}" alt="poster" />
        </div>
    {/if} -->
    <!-- svelte-ignore a11y-media-has-caption -->
        <video controls playsinline data-poster={`https://${chosen}/vi/${videoAPI.videoId}/maxresdefault.jpg`} id="player">
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

            {#if videoAPI.captions.length}
                {#each videoAPI.captions as caption}
                    <track kind="captions" label="English" srclang="en" src="url.en.vtt" />
                {/each}
            {/if}

            <!-- Fallback for browsers that don't support the <video> element -->
            <!-- <a href="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" download>Download</a> -->
        </video>
    </div>
{:else}
    no streams available, please rotate instance in top right corner.
{/if}
<style>
:global(.plyr__poster) {
    object-fit: cover;
    background-size: 101%;
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