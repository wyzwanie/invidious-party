<script>
    import { onMount } from 'svelte'
    import Video from '$lib/Video.svelte'
    import { store, chosen } from '$lib/_store'

    let videoId
    let author

    onMount(async () => {
        videoId = window.location.search.split('=')[1]
    })
    $: if($chosen && videoId) fetchVideoInformation()
    
    const fetchVideoInformation = async () => {
        try {
            const videoResponse = await fetch(`${$chosen}api/v1/videos/${videoId}`)
            const videoData = await videoResponse.json()
            console.log('vd', videoData)
            if(videoData && !videoData.author) {
                store.nextChosen()
                $chosen = $store.chosen
                console.log('nowy bo nie ma autora', $chosen)
            }
            author = videoData.author
        } catch(err) {
            console.log(err)
            getNextChosen()
        }
    }
    const getNextChosen = () => {
        console.log('jeden', $store)
        store.nextChosen()
        console.log('dwa', $store)
        $chosen = $store.chosen
    }
</script>

{#if videoId}
    <Video {videoId} chosen={$chosen} on:error={getNextChosen} />
    {author}
{/if}