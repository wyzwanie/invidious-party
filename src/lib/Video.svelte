<script>
    import { createEventDispatcher } from 'svelte'

    export let chosen
    export let version = ''
    export let videoID

    let player
    let initialized = 0

    const dispatch = createEventDispatcher()
    const options = {
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
        }
    }
    const initializeVideo = () => {
        console.log('loaded')
        player = videojs('my-player', options)
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
    $: if(initialized > 5) initializeVideo()
</script>

<svelte:head>
    {#if chosen}
        <link rel="stylesheet" href="https://{chosen}/css/video-js.min.css?v={version}">
        <link rel="stylesheet" href="https://{chosen}/css/videojs-http-source-selector.css?v={version}">
        <link rel="stylesheet" href="https://{chosen}/css/videojs.markers.min.css?v={version}">
        <!-- <link rel="stylesheet" href="https://{chosen}/css/videojs-share.css?v={version}"> -->
        <link rel="stylesheet" href="https://{chosen}/css/videojs-vtt-thumbnails.css?v={version}">
        <link rel="stylesheet" href="https://{chosen}/css/quality-selector.css?v={version}">

        <script src="https://{chosen}/js/video.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
        <script src="https://{chosen}/js/videojs-contrib-quality-levels.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
        <script src="https://{chosen}/js/videojs-http-source-selector.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
        <script src="https://{chosen}/js/videojs-markers.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
        <!-- <script src="https://{chosen}/js/videojs-share.min.js?v={version}" on:load={() => initialized++} /> -->
        <script src="https://{chosen}/js/videojs-vtt-thumbnails.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
        <script src="https://{chosen}/js/silvermine-videojs-quality-selector.min.js?v={version}" on:load={() => initialized++} on:error={() => dispatch('error')} />
    {/if}    
</svelte:head>
<!-- <button on:click={() => dispatch('error')}>nextChosen</button>
{#if initialized > 4}
YEE
{/if} -->
{#if chosen && videoID}
<!-- <iframe src="https://{chosen}/embed/{videoID}" title="video" /> -->
<!-- &itag=18&local=true -->
<!-- svelte-ignore a11y-media-has-caption -->
<div class="video-js-responsive-container vjs-hd">
    <video
        id="my-player"
        class="video-js"
        controls
        preload="auto"
        poster="https://{chosen}/vi/{videoID}/maxres.jpg"
        data-setup=""
    >
        <source
            src="https://{chosen}/latest_version?id={videoID}&itag=18"
            type='video/mp4; codecs="avc1.42001E, mp4a.40.2"'
            label="medium"
            selected="false"
        >
        <source 
            src="https://{chosen}/latest_version?id={videoID}&itag=22"
            type='video/mp4; codecs="avc1.64001F, mp4a.40.2"'
            label="hd720"
            selected="true"
        >
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
        </a>
    </p>
    </video>
</div>
{:else}
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
}
</style>