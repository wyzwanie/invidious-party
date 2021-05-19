<script>
    import { createEventDispatcher } from 'svelte'

    export let chosen
    export let videoAPI
    
    let initialized = 0
    let player
    let sources = []

    const dispatch = createEventDispatcher()
    var options = {
        preload: 'auto',
        liveui: true,
        playbackRates: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
        controlBar: {
            children: [
                'playToggle',
                'volumePanel',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'remainingTimeDisplay',
                'captionsButton',
                'qualitySelector',
                'playbackRateMenuButton',
                'fullscreenToggle'
            ]
        },
        html5: {
            preloadTextTracks: false,
            hls: {
                overrideNative: true
            }
        },
        plugins: {
            httpSourceSelector: {
                    default: 'auto'
            }
        }
    }
    $: console.log(videoAPI)

    const initializeVideo = () => {
        console.log('uuu', videoAPI)
        if(videoAPI) sources = videoAPI.formatStreams
        console.log('loaded')
        player = videojs('my-player', options)
        // player.httpSourceSelector()
        console.log(player)

        player.on('error', function (event) {
            console.log('aaaaaaa', event)
            if (player.error().code === 2 || player.error().code === 4) {
                setTimeout(function (event) {
                    // store.nextChosen()
                    // console.log($store.chosen)
                    // console.log($store)
                    dispatch('error')

                    var currentTime = player.currentTime();
                    var playbackRate = player.playbackRate();
                    var paused = player.paused();

                    player.load();

                    if (currentTime > 0.5) {
                        currentTime -= 0.5;
                    }

                    player.currentTime(currentTime);
                    player.playbackRate(playbackRate);

                    if (!paused) {
                        player.play();
                    }
                }, 5000);
            }
        });
    }
    $: if(initialized === 3) initializeVideo()
</script>

<svelte:head>
    <!-- <link rel="stylesheet" href="https://unpkg.com/video.js/dist/video-js.min.css"> -->
    <!-- <script src="https://unpkg.com/video.js/dist/video.min.js" on:load={() => initialized = true} on:error={() => dispatch('error')} /> -->

    <link rel="stylesheet" href="https://unpkg.com/video.js/dist/video-js.min.css">
    <script src="https://unpkg.com/video.js/dist/video.min.js" on:load={() => initialized++} on:error={() => dispatch('error')} />
    <script src="https://unpkg.com/videojs-contrib-quality-levels/dist/videojs-contrib-quality-levels.min.js" on:load={() => initialized++} on:error={() => dispatch('error')} />
    <script src="https://unpkg.com/videojs-http-source-selector/dist/videojs-http-source-selector.min.js" on:load={() => initialized++} on:error={() => dispatch('error')} />
    
</svelte:head>

{#if chosen && videoAPI}
<!-- <iframe src="https://{chosen}/embed/{videoID}" title="video" /> -->
<!-- &itag=18&local=true -->
<!-- svelte-ignore a11y-media-has-caption -->

{#key player}
<div class="video-js-responsive-container vjs-hd">
    <video
        id="my-player"
        class="video-js vjs-big-play-centered"
        controls
        preload="auto"
        poster="https://{chosen}/vi/{videoAPI.videoId}/maxres.jpg"
        data-setup=""
    >
    {#each sources as source}
        <source
            src="https://{chosen}/latest_version?id={videoAPI.videoId}&itag={source.itag}"
            type={source.type}
            label={source.qualityLabel}
            selected={source.qualityLabel === '720p' && source.encoding === 'h264' ? 'true' : 'false'}
        >
    {/each}
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
        </a>
    </p>
    </video>
</div>
{/key}
{:else}
... loading ...
    <button on:click={() => dispatch('error')}>nextChosen</button>
{/if}

<style>
.video-js-responsive-container.vjs-hd {
    padding-top: 56.25%;
}
:global(.video-js-responsive-container.vjs-sd) {
    padding-top: 75%;
}
.video-js-responsive-container {
    width: 100%;
    position: relative;
}
.video-js-responsive-container .video-js {
    height: 100% !important; 
    width: 100% !important;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
}
:global(.video-js .vjs-tech) {
    border-radius: 5px;
}
:global(.vjs-poster) {
    border-radius: 5px;
}
</style>