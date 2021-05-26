<script>
    import { ftch } from '$lib/helper'
    import { controller } from '$lib/Stores/memoryStore'

    const signal = controller.signal


    ftch('https://vid.puffyan.us/api/v1/popular/', { signal })
        .then(data => console.log(data))
        .catch(err => console.log(err))

    
</script>

<div>
    <button on:click={() => $controller.abort()}>abort</button>
    nothing here yet sadge
</div>