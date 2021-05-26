<script>
    import { createEventDispatcher } from 'svelte'
    import { controller } from '$lib/Stores/memoryStore'
    import { sleep } from '$lib/helper'

    export let color = '--accent'

    let rotate = false

    const sendRotate = async () => {
        if($controller) $controller.abort()
        dispatch('rotate')
        rotate = true
        await sleep(1000)
        rotate = false
    }

    const dispatch = createEventDispatcher()
</script>

<div class="refresh">
    <svg class:rotate on:click={sendRotate}
        version="1.1" x="0px" y="0px" viewBox="0 0 492.883 492.883">
        <g><g>
            <path style="fill: {color}" d="M122.941,374.241c-20.1-18.1-34.6-39.8-44.1-63.1c-25.2-61.8-13.4-135.3,35.8-186l45.4,45.4c2.5,2.5,7,0.7,7.6-3 l24.8-162.3c0.4-2.7-1.9-5-4.6-4.6l-162.4,24.8c-3.7,0.6-5.5,5.1-3,7.6l45.5,45.5c-75.1,76.8-87.9,192-38.6,282 c14.8,27.1,35.3,51.9,61.4,72.7c44.4,35.3,99,52.2,153.2,51.1l10.2-66.7C207.441,421.641,159.441,407.241,122.941,374.241z"/>
            <path style="fill: {color}" d="M424.941,414.341c75.1-76.8,87.9-192,38.6-282c-14.8-27.1-35.3-51.9-61.4-72.7c-44.4-35.3-99-52.2-153.2-51.1l-10.2,66.7 c46.6-4,94.7,10.4,131.2,43.4c20.1,18.1,34.6,39.8,44.1,63.1c25.2,61.8,13.4,135.3-35.8,186l-45.4-45.4c-2.5-2.5-7-0.7-7.6,3 l-24.8,162.3c-0.4,2.7,1.9,5,4.6,4.6l162.4-24.8c3.7-0.6,5.4-5.1,3-7.6L424.941,414.341z"/>
        </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
    </svg>
</div>

<style>
/* .refresh {
    left: 17px;
    opacity: 0.618;
    cursor: pointer;
}
.refresh svg {
    width: 32px;
    cursor: pointer;
    transition: 1s;
}
.refresh svg.rotate {
    transform: rotate(360deg);
    transition: 1s;
} */

.refresh svg {
    fill: var(--text--50);
    width: 32px;
    cursor: pointer;
    transition: 1s;
}
.refresh svg.rotate {
    transform: rotate(360deg);
    fill: var(--accent);
    transition: 1s;
}
svg {
    width: 32px;
    cursor: pointer;
}

</style>