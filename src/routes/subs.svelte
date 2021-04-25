<script>
    import { onMount } from 'svelte'
    import { ipfs } from '$lib/_store'
    import { instances, SUBs, SUBsCID, SUBcache, SUBcacheCID, SUBsUpdatedAt, SUBcacheUpdatedAt, SUBsRefreshedAt } from '$lib/_localStore'
    import { Queue } from '$lib/_queue'

    import ProgressBar from '$lib/ProgressBar.svelte'
    
    let SUBfeed = []
    let tasks = []
    let ymport
    let _instances

    let toDo = 0
    let inProgress = 0
    let finished = 0
    let concurrency = 10
    let requestsMade = 0
    let failedCount = 0
    let ymportStatus = false
    let refreshRunning = false
    let retryCounter = {}
    let maxRetry = 5

    let activeTab = 'feed'

    const job = async (task, next) => {
        if(retryCounter[task.instance]) retryCounter[task.instance].totalRequests++
        else retryCounter[task.instance] = { ...retryCounter[task.instance], totalRequests: 1 }

        const { instance, channelID, interval } = task
        let error = null

        let fetchChannel = await feCh(instance, channelID)
        if(fetchChannel.success) SUBfeed = [...SUBfeed, fetchChannel.res]
        //latestVideox[max=10]: author, authorId,  isUpcoming, lengthSeconds, liveNow, published, title, videoId, viewCount
        else error = fetchChannel

        setTimeout(next, interval, error, task)
    }
    const SUBqueue = Queue.channels(concurrency)
        .timeout(3000)
        .process(job)
        .success(task => {
            // console.log('success:task', task)
            toDo--
            finished++
        })
        .failure((err, task) => {
            // if(err.dup === 'licate') return
            // if(failedCount > tasks.length * 3) return
            if(err.init === 'success') {

            } 
            if(err.init || err.reason === 'Failed to fetch' || err.reason === 'Read timed out' || err.message === 'Process timed out') {
                if(!err.init) failedCount++

                if(retryCounter[task.instance].failed) retryCounter[task.instance].failed++
                else retryCounter[task.instance].failed = 1

                let filteredInstances = []
                for(let key of Object.keys(retryCounter)) {
                    const failed = retryCounter[key].failed
                    const totalRequests = retryCounter[key].totalRequests

                    if(!failed) filteredInstances.push(key)
                }
// console.log(filteredInstances)
                if(filteredInstances.length) {
                    const newInstance = filteredInstances[Math.floor(Math.random() * filteredInstances.length)]
                    SUBqueue.add({ ...task, instance:  newInstance })
                }
                console.log(retryCounter)
                // if(retryCounter[task.instance].failed < 10) {
                //     const instanceIndex = _instances.findIndex(x => x[0] === task.instance)
                //     let newIndex = Math.floor(Math.random() * _instances.length)
    
                //     if(instanceIndex !== newIndex) {
                //         SUBqueue.add({ ...task, instance: _instances[newIndex][0] })
                //     } else {
                //         newIndex = Math.floor(Math.random() * _instances.length)
                //         SUBqueue.add({ ...task, instance: _instances[newIndex][0] })
                //     }
                //     console.log(retryCounter)
                // }
                
            } else {
                if(err !== 'initializing') {
                    console.log('failure:err', err)
                    console.log('failure:task', task)
                }
            }
        })
        // .drain(() => // console.log('Queue drain'));

        const feCh = async (instance, channelID) => {
            if(instance === null) return { init: 'success' }
            // if(SUBfeed.findIndex(x => x.authorId === channelID) > -1) return { dup: 'licate' }
            console.log(SUBfeed)
            inProgress++
            requestsMade++

            try {
                const req = await fetch(`https://${instance}/api/v1/channels/${channelID}?fields=author,authorId,latestVideos`)
                const res = await req.json()
                inProgress--
                if(res && res.authorId) return { success: channelID, from: instance, res }
                else return { failed: channelID, from: instance, reason: res }
            } catch(error) {
                inProgress--
                return { failed: channelID, from: instance, reason: error.message }
            }
        }

    // const updateSUBfeed = () => {
    //     test.forEach((subID, i) => {
    //         tasks = [...tasks, {
    //             instance: instances[i] ? instances[i].instance : instances[i % instances.length].instance,
    //             channelID: subID,
    //             interval: 0.682
    //         }]
    //     })
    //     // console.log('############ tasks ###########')
    //     // console.log(tasks)
    //     // console.log('#####################-')
    //     concurrency = tasks.length < 11 ? 3 : (tasks.length / 200 > 1 ? 30 : 20)
    //     tasks.forEach(task => SUBqueue.add(task))
    // }

    const refresh = (refreshedAt, instances, SUBs) => {
        if(refreshRunning) return false
console.log('r', refreshedAt)
        const first_time = refreshedAt === null
        const need_refresh = refreshedAt && (refreshedAt + 15 * 1000) < new Date().getTime()
        if(first_time || need_refresh) {
            refreshRunning = true
            let ynstancez = instances.map((curr, index) => {
                if(typeof curr[0] === 'string' && curr[0].length > 0) {
                    if(curr[1].enabled) {
                        return {
                            instance: curr[0],
                            counter: 0
                        }
                    }
                }
            })

            // const test = ['UCAmg0HpcIXdIyKSw5aml8HA', 'UCm22FAXZMw1BaWeFszZxUKw', 'UCpXwMqnXfJzazKS5fJ8nrVw', 'UCodkNmk9oWRTIYZdr_HuSlg', 'UCL_f53ZEJxp8TtlOkHwMV9Q', 'UCHykVXxOLGdXTvBh82oGCog', 'UCrvz2RsOkUdNA3UCMFmvvnw', 'UC867Q451mPjjD52peYqpF4A', 'UCZ3bvy8G3TpURYYASrFsEeA', 'UCuKAMWP_iGWAXQEZJ1lyxCg']
            const test = ["UCAmg0HpcIXdIyKSw5aml8HA","UC2-slOJImuSc20Drbf88qvg","UC8Q7XEy86Q7T-3kNpNjYgwA","UCpXwMqnXfJzazKS5fJ8nrVw","UCm22FAXZMw1BaWeFszZxUKw","UCHykVXxOLGdXTvBh82oGCog","UC867Q451mPjjD52peYqpF4A","UCrvz2RsOkUdNA3UCMFmvvnw","UCuNy42Y5egf07cSiHbF23wg","UC__vX0QGDIOQgelZ0rdIOsA","UCvK4bOhULCpmLabd2pDMtnA","UCL_f53ZEJxp8TtlOkHwMV9Q","UC7zlt5O0XQgz851q_ZWwk5g","UCMR_nAMCppEXZiDZ-HLAeJg","UCodkNmk9oWRTIYZdr_HuSlg","UCatDoyZBxEI5ym-Z1R9XZ6g","UC8m_wYdQFOLWIdupJrXnhQg","UCZ3bvy8G3TpURYYASrFsEeA","UCqMVaZM-USi0G54pu5318dQ","UCE_paKcgmlk4piFodH5Wrxg","UCH6E4xDfxBqrkoKdAyVu2dg","UCjI3-FRNbKFvnrG4iDnQCQw","UC9T6tYiK-5OlQ_YBpPhfREQ","UC-WMwOzgFdvvGVLB1EZ-n-w","UC7ucvC0OrD2BQUmEec5NJeg","UCbfYPyITQ-7l4upoX8nvctg","UC2IZ-VjoG467JBCVstD5WPw","UCqVUDbWANEG47KmB2MoM6IA","UCqqKgdUv3BIvs-Y2w7xJBoA","UCM2YmsRUeIbRkqjgNm0eTGQ","UCJ4h7utY-IjXKXOUuwmSYXw","UCptAHlN1gdwD89tFM3ENb6w","UCIRiWCPZoUyZDbydIqitHtQ","UCworsKCR-Sx6R6-BnIjS2MA","UC_ML5xP23TOWKUcc-oAE_Eg","UCOavg1FtdeuyUTLz3wmuIKQ","UCINRrQmprPmC_xMDyFweHXQ","UC_wbVsZY1gbgrVgMbOSMCyA","UChKFnPoA9O2dAMrcNT2aUsQ","UCO7WDNkmzkfg-U_n9ix6aeQ","UCLF2DONV6JCJUs6eK6POaxg","UCAWCSm3nrVjwHBts3RQ38iQ","UC98_050r8lMxngxurJgU1gA","UCiRiQGCHGjDLT9FQXFW0I3A","UCAGTpcuP8o9_sWzvDGfZYKA","UCSQL2gI40u6XULunbjZ02Kw","UC29ju8bIPH5as8OGnQzwJyA","UC4TJ3TENuTpkO6OgqO44TFw","UCZSJEX8QvqdhDQ0WhRjlqkg","UCyUBW72KU30dfAYWLVNZO8Q","UCRatys97ggrXVtQQBGRALkg","UChg4k23shL6Xf0lyA8D4w_w","UC281yIVp-U8Ijg4KUVRgDRA","UCE7b3weKYX_KATV47EVIPHA","UClu2e7S8atp6tG2galK9hgg","UCeqSUA4o9kyaD15VjM__uDg","UCL0u5uz7KZ9q-pe-VC8TY-w","UClgyqJ3ToNoWvO81T9GV07Q","UC4QZ_LsYcvcq7qOsOhpAX4A","UCZ9aMM1v-0HcKS9SYHVekUA","UCu6mSoMNzHQiBIOCkHUa2Aw","UC7FX3mdJ-zPjTMbxv-nCsGg","UCF2_XJffJwfmcAZ-Avmg3fA","UCbbz3_jH582xS93hxszPvjQ","UCmt4OVC6o7WYGI1Cw4aIQQg","UCs9pt6HOHWTZc6Ju6ZofOpQ","UCF49IVUlpV1kZVA14vfivwQ","UCmGVAcHMaM-xmffSNxF2dyA","UCHkkUuVWTSwN82IHIhxq_jg","UCLNgu_OupwoeESgtab33CCw","UCJJOPBQ9KITlzGyxwWxgswg","UCRtyLX-ej-H1PSiaw8g9aIA","UCV5vCi3jPJdURZwAOO_FNfQ","UCrv269YwJzuZL3dH5PCgxUw","UCqwCM44EbcLK5rUeWjBbmiA","UCbx6pClCMGeTTWydbGR9zzA","UCyWDmyZRjrGHeKF-ofFsT5Q","UCho-XTOszUf8vxjy0bm20lA","UC_gSotrFVZ_PiAxo3fTQVuQ","UCvKo-PpKHkbYO2xhKWH6mow","UCnrE7PkiyVPP5ZTMqo3QW-Q","UC0XiDgtbFR8ohoGlstuFgGQ","UCtuqcXfY_wJQzeTKHn67wkw","UC9z7EZAbkphEMg0SP7rw44A","UCxJDH_2HXzwUtT62HgWJqCg","UC_T_YxgUApnjCn3qM-T0-hA","UCVZomfn1f2mugJwd3AW58-g","UCDmyxGV9gw4ZfrL6iVkfiRA","UC4178V769P2ckA65-em0JYQ","UCsCkqoXvLwM1b-FXKovEo8Q","UCGhI9Oy4Le2pY7zuDXU8Mlw","UCfFLQTIFphzroMfsMYjtBcQ","UCiqJJdLFUaWLpTeuNmmJTXA","UCsIlJ9eYylZQcyfMOPNUz9w","UC4_ctkkj65dorWrooMhApeA","UCN4M6rqfhk3NhsJOF3IoTgA","UCb9R0TyctlF9i8PhQ7Ffv9g","UCJu_ihulI-4GNeLYbIyLViw","UCzq1iSqvuXIGeNeUvETfSKQ","UCM_-69pwiy8VGNB6kobm9Mw","UCHkYrJ2Fbe7pBjEZvkFzi3A","UCyjzaMkXTTp9P20UZbxDH6w","UC70G73qumyIXJ57r84JpAHg","UCTS_bRqS7oO4y9gYviOFNYw","UC68GPKqwj-F6acTMYxZb0bA","UC9Wesh1nf7vtrMHNF7DtUog","UCHCOMqChQNT35GezGrd1cvg","UCJx74HaacAjDZk8LPdOfUFQ","UCYdXHOv7srjm-ZsNsTcwbBw","UCrc3XCtBGtWErZUVVvn15jQ","UC6EyGxVgmTGt27_U9c_oz9g","UCUmHIdrEgCRUN1DdmaJmndg","UCb9q9pJVg-FNM6jVEyJfXKQ","UC_wp-1vWJxrB2tzJ3yT618g","UCIVhUjqW-sOZiBUE7Un9Bkw","UCKb8u1n-zGfwIgv1-nyjKNw","UC5fHBGiBdRN5MWMHEGFcZNw","UCgNg3vwj3xt7QOrcIDaHdFg","UCuD1cRmH2Dl0HW-gFQ3Aluw","UCJWCJCWOxBYSi5DhCieLOLQ","UC_voeHE6JFumgTW6juXnQXg","UCAQHQEO4QpI5dXtr3vLoFCg","UCTiL1q9YbrVam5nP2xzFTWQ","UC8HUh8-5afcpHNnrD8-ZOrA","UC8AvcEE8l8mHs-rZTXoynVQ","UCLrI-dOLyDbRnPyUeWadsOg","UCyfXrFVGvMxuLZbslH276fg","UC_m-yurHhUUypqIBgH-w8Bw","UC7pp40MU_6rLK5pvJYG3d0Q","UCR9Gcq0CMm6YgTzsDxAxjOQ","UCBFq0WddUlytySF-RsRXgGA","UC-yewGHQbNFpDrGM0diZOLA","UCrmZwuKSnPtwOVX5Uq4J4NA","UCd0f7Dor1gjTA2Tloepit2A","UC11OPzwn5Wt0-LN3rARunmg","UCPKT_csvP72boVX0XrMtagQ","UC6DicDItkLQ7N4ag1JS5mqg","UC9XF2nKk5rhKptbCmRv1MOg","UCpts-8H1DqUaGmUkFhbXMQQ","UC1X9HTMhyL4UpmjgkrN41oQ","UCMpAklXQxme_wZi3sdHdHVQ","UCVZlxkKqlvVqzRJXhAGq42Q","UCKuphhWsSpVkfOivxdTpupw","UC8q23MpiyWjv9vd4r85oj1A","UCzQUP1qoWDoEbmsQxvdjxgQ","UCJRT8RpG8V7XDOAWgH41hhA","UCxH0sQJKG6Aq9-vFIPnDZ2A","UCi5_jmhcvmj3cyo9JHh6UnA","UCZSr5B0l07JXK2FIeWA0-jw","UCPzFLpOblZEaIx2lpym1l1A","UClb90NQQcskPUGDIXsQEz5Q","UCrT7Pzf3xo52RQ2IN8QrQsA","UC_QywfFAjVkJzLNVBu6lFJw","UCR1D15p_vdP3HkrH8wgjQRw","UCCamVhi5wQkjdnXHJJSjmNw","UCNv0zmezIa_tuN9vUc3_Ziw","UCCeNgCnvIig20KToD_bkS6A","UCx1sDANGlyYQtVcfxp1mt3w","UC-8QAzbLcRglXeN_MY9blyw","UC4uQyE3rm7Ou6MyZmQDvV0w","UCAk3t7WHs2zjsZpopox8Taw","UCwfbruHSdAmxTjv3sn0A_Ow","UCRSSEcNnFKURWw1NZ7DpRCg","UCpCSAcbqs-sjEVfk_hMfY9w","UCRxAgfYexGLlu1WHGIMUDqw","UC4TjXPVIYz9Z13SB3vxKuZQ","UC9yt3wz-6j19RwD5m5f6HSg","UC9K9r4Wh9OO18BZP4KP9vGQ","UCeuZuscpnYmdWj83TvZLdmA","UCW5YeuERMmlnqo4oq8vwUpg","UC9Jqt2iEMVufQUSBX9JwVXQ","UCMdEvelZ3uNkK2ZEmehU7Cg","UCwnKziETDbHJtx78nIkfYug","UC5aqukzSeAj9etVpQpct88A","UChZyTBG-zrTgTnO-tAMNAwA","UCl4l2tOcEw3oNmjcy6zDPjw","UCFSoDSLxgbeHhEzAO8UZqAQ","UCBlAJEg-PKoRoHcyhiAopRg","UCNcfteaeJ_0cphvCRYCanxA","UCyPZmjEThQK5O3JuZfrPdiA","UCXLdDPcQD0BWjb00fGdFFYg","UCh4nQjfLEajxoyxQaHhxP-A","UCD2VuGlPSfBDFGKhxviv1Zg","UCeLFL5kXWuv66Uh9tWJYi2A","UCvBqzzvUBLCs8Y7Axb-jZew","UC4FrvWBLhbOkpgOHj-jz6Ww","UCQHofQeCmh7naz8OBJRVr7A","UCy7Jb0LIMV_hLlUu6ODgJfQ","UCL_mnuQunm9hWkHRULllDmg","UC5g-f-g4EVRkqL8Xs888BLA"]
            toDo = test.length

            tasks = test.map((channelID, index) => {
                return {
                    instance: ynstancez[index] ? ynstancez[index].instance : null,
                    channelID,
                    interval: 1
                }
            })
            // console.log('---------------------')
            // console.log(tasks)
            // console.log('---------------------')
            concurrency = Math.floor(tasks.length / (Math.log(tasks.length)*1.618))
            tasks.forEach(task => SUBqueue.add(task))
        }
    }

    const startYmport = () => {}

    // $: console.log('instanceRetryCounter', instanceRetryCounter)
    // $: // console.log('$instances', $instances)
    // $: // console.log('$SUBs', $SUBs)
    // $: // console.log('tasks', tasks)
    // $: // console.log('refreshRunning', refreshRunning)
    $: if($instances && $instances.length && $SUBsRefreshedAt) {
        _instances = $instances
        refresh($SUBsRefreshedAt, $instances, $SUBs)
    }
    // $: refresh($SUBsRefreshedAt, $instances, $SUBs)
    $: if(requestsMade > 50) new AbortController().abort()
    $: if(tasks.length > 0 && SUBfeed.length === tasks.length) {
        refreshRunning = false
        $SUBsRefreshedAt = new Date().getTime()
        //saveCACHE
    }
    // $: if lastrefresh > Xczasu -> odpal refresha
</script>

<nav>
    <ul>
        <li on:click={() => activeTab = 'feed'} class="feed {activeTab === 'feed' ? 'active' : ''}">Feed</li>
        <li on:click={() => activeTab = 'manage'} class="{activeTab === 'manage' ? 'active' : ''}">Manage</li>
        <li on:click={() => activeTab = 'import'} class="{activeTab === 'import' ? 'active' : ''}">Import</li>
    </ul>
</nav>
<button on:click={() => alert(SUBqueue.count)}>count</button><br>
<button on:click={() => requestsMade = 200}>off</button><br>
refreshRunning: {refreshRunning}

{#if activeTab === 'feed'}
<br>
total: {tasks.length}<br>
toDo: {toDo}<br>
inProgress: {inProgress}<br>
{#key finished}
queueCount: {SUBqueue.count}<br>
{/key}
success: {finished}<br>
failedRequests: {failedCount}<br>
requestsMade: {requestsMade}<br>
concurrency: {concurrency}<br>
<hr>
    <ProgressBar total={tasks.length} progress={(finished/tasks.length)*100} />
    <hr>
    {#key SUBfeed}
        {#each SUBfeed as s}
            {#if s.latestVideos && s.latestVideos[0]}
                {s.author}: {new Date(s.latestVideos[0].published*1000).toLocaleString()}<br>
            {:else}
                {s.author}: no new videos<br>
            {/if}
        {/each}
    {/key}
{/if}

{#if activeTab === 'manage'}
    {#if $SUBs.length}
        <div class="wrapper">
            {#each SUBfeed as sub}
                <div class="box">{sub.author}<br></div>
            {/each}
        </div>
    {:else}
        you have no SUBfeed...<br>
        import in settings or add more :)
    {/if}
{/if}

{#if activeTab === 'import'}
    {#if ymportStatus}
        <br>
        <ProgressBar total={tasks.length} progress={(finished/tasks.length)*100} />
        total: {tasks.length}<br>
        toDo: {toDo}<br>
        inProgress: {inProgress}<br>
        success: {finished}<br>
        failedRequests: {failedCount}<br>
        <hr>
        concurrency: {concurrency}<br>
        Total requests made: {requestsMade}
        <hr>
    {:else}
        <h3>Import SUBfeed:</h3>
        <p>select source></p>
        youtube + intstructions<br>
        invidious + instructions<br>
        <textarea bind:value={ymport}></textarea>
        <button on:click={() => startYmport(ymport, 'invidious')}>import</button>
    {/if}
{/if}

<style>
nav {
    background: var(--bg-dark-second);
    width: 100%;
    margin-top: -3px;
    margin-bottom: 1em;
    border-radius: 5px;
}
nav ul {
    list-style: none;
    display: flex;
}
nav ul li {
    padding: 1em;
    cursor: pointer;
}
.active {
    color: var(--accent);
    background: rgb(0 0 0 / 35%);
}
.active.feed {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
</style>