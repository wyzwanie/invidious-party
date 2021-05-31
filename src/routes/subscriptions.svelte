<script>
    import Queue from 'async-await-queue'
    import { chosen } from '$lib/Stores/memoryStore'
    import { instances, SUBs, SUBcache, SUBsUpdatedAt, SUBcacheUpdatedAt, SUBsRefreshedAt } from '$lib/Stores/localStore'

    import { chooseInstance, instanceRequestStatus } from '$lib/helper'

    import Videos from '$lib/Components/Videos.svelte'
    import ProgressBar from '$lib/UI/ProgressBar.svelte'

    const CONCURRENCY = 30
    const INTERVAL = 200
    let Youtube = $SUBs
    // ["UCAmg0HpcIXdIyKSw5aml8HA","UC2-slOJImuSc20Drbf88qvg","UC8Q7XEy86Q7T-3kNpNjYgwA","UCpXwMqnXfJzazKS5fJ8nrVw","UCm22FAXZMw1BaWeFszZxUKw","UCHykVXxOLGdXTvBh82oGCog","UC867Q451mPjjD52peYqpF4A","UCrvz2RsOkUdNA3UCMFmvvnw","UCuNy42Y5egf07cSiHbF23wg","UC__vX0QGDIOQgelZ0rdIOsA","UCvK4bOhULCpmLabd2pDMtnA","UCL_f53ZEJxp8TtlOkHwMV9Q","UC7zlt5O0XQgz851q_ZWwk5g","UCMR_nAMCppEXZiDZ-HLAeJg","UCodkNmk9oWRTIYZdr_HuSlg","UCatDoyZBxEI5ym-Z1R9XZ6g","UC8m_wYdQFOLWIdupJrXnhQg","UCZ3bvy8G3TpURYYASrFsEeA","UCqMVaZM-USi0G54pu5318dQ","UCE_paKcgmlk4piFodH5Wrxg","UCH6E4xDfxBqrkoKdAyVu2dg","UCjI3-FRNbKFvnrG4iDnQCQw","UC9T6tYiK-5OlQ_YBpPhfREQ","UC-WMwOzgFdvvGVLB1EZ-n-w","UC7ucvC0OrD2BQUmEec5NJeg","UCbfYPyITQ-7l4upoX8nvctg","UC2IZ-VjoG467JBCVstD5WPw","UCqVUDbWANEG47KmB2MoM6IA","UCqqKgdUv3BIvs-Y2w7xJBoA","UCM2YmsRUeIbRkqjgNm0eTGQ","UCJ4h7utY-IjXKXOUuwmSYXw","UCptAHlN1gdwD89tFM3ENb6w","UCIRiWCPZoUyZDbydIqitHtQ","UCworsKCR-Sx6R6-BnIjS2MA","UC_ML5xP23TOWKUcc-oAE_Eg","UCOavg1FtdeuyUTLz3wmuIKQ","UCINRrQmprPmC_xMDyFweHXQ","UC_wbVsZY1gbgrVgMbOSMCyA","UChKFnPoA9O2dAMrcNT2aUsQ","UCO7WDNkmzkfg-U_n9ix6aeQ","UCLF2DONV6JCJUs6eK6POaxg","UCAWCSm3nrVjwHBts3RQ38iQ","UC98_050r8lMxngxurJgU1gA","UCiRiQGCHGjDLT9FQXFW0I3A","UCAGTpcuP8o9_sWzvDGfZYKA","UCSQL2gI40u6XULunbjZ02Kw","UC29ju8bIPH5as8OGnQzwJyA","UC4TJ3TENuTpkO6OgqO44TFw","UCZSJEX8QvqdhDQ0WhRjlqkg","UCyUBW72KU30dfAYWLVNZO8Q","UCRatys97ggrXVtQQBGRALkg","UChg4k23shL6Xf0lyA8D4w_w","UC281yIVp-U8Ijg4KUVRgDRA","UCE7b3weKYX_KATV47EVIPHA","UClu2e7S8atp6tG2galK9hgg","UCeqSUA4o9kyaD15VjM__uDg","UCL0u5uz7KZ9q-pe-VC8TY-w","UClgyqJ3ToNoWvO81T9GV07Q","UC4QZ_LsYcvcq7qOsOhpAX4A","UCZ9aMM1v-0HcKS9SYHVekUA","UCu6mSoMNzHQiBIOCkHUa2Aw","UC7FX3mdJ-zPjTMbxv-nCsGg","UCF2_XJffJwfmcAZ-Avmg3fA","UCbbz3_jH582xS93hxszPvjQ","UCmt4OVC6o7WYGI1Cw4aIQQg","UCs9pt6HOHWTZc6Ju6ZofOpQ","UCF49IVUlpV1kZVA14vfivwQ","UCmGVAcHMaM-xmffSNxF2dyA","UCHkkUuVWTSwN82IHIhxq_jg","UCLNgu_OupwoeESgtab33CCw","UCJJOPBQ9KITlzGyxwWxgswg","UCRtyLX-ej-H1PSiaw8g9aIA","UCV5vCi3jPJdURZwAOO_FNfQ","UCrv269YwJzuZL3dH5PCgxUw","UCqwCM44EbcLK5rUeWjBbmiA","UCbx6pClCMGeTTWydbGR9zzA","UCyWDmyZRjrGHeKF-ofFsT5Q","UCho-XTOszUf8vxjy0bm20lA","UC_gSotrFVZ_PiAxo3fTQVuQ","UCvKo-PpKHkbYO2xhKWH6mow","UCnrE7PkiyVPP5ZTMqo3QW-Q","UC0XiDgtbFR8ohoGlstuFgGQ","UCtuqcXfY_wJQzeTKHn67wkw","UC9z7EZAbkphEMg0SP7rw44A","UCxJDH_2HXzwUtT62HgWJqCg","UC_T_YxgUApnjCn3qM-T0-hA","UCVZomfn1f2mugJwd3AW58-g","UCDmyxGV9gw4ZfrL6iVkfiRA","UC4178V769P2ckA65-em0JYQ","UCsCkqoXvLwM1b-FXKovEo8Q","UCGhI9Oy4Le2pY7zuDXU8Mlw","UCfFLQTIFphzroMfsMYjtBcQ","UCiqJJdLFUaWLpTeuNmmJTXA","UCsIlJ9eYylZQcyfMOPNUz9w","UC4_ctkkj65dorWrooMhApeA","UCN4M6rqfhk3NhsJOF3IoTgA","UCb9R0TyctlF9i8PhQ7Ffv9g","UCJu_ihulI-4GNeLYbIyLViw","UCzq1iSqvuXIGeNeUvETfSKQ","UCM_-69pwiy8VGNB6kobm9Mw","UCHkYrJ2Fbe7pBjEZvkFzi3A","UCyjzaMkXTTp9P20UZbxDH6w","UC70G73qumyIXJ57r84JpAHg","UCTS_bRqS7oO4y9gYviOFNYw","UC68GPKqwj-F6acTMYxZb0bA","UC9Wesh1nf7vtrMHNF7DtUog","UCHCOMqChQNT35GezGrd1cvg","UCJx74HaacAjDZk8LPdOfUFQ","UCYdXHOv7srjm-ZsNsTcwbBw","UCrc3XCtBGtWErZUVVvn15jQ","UC6EyGxVgmTGt27_U9c_oz9g","UCUmHIdrEgCRUN1DdmaJmndg","UCb9q9pJVg-FNM6jVEyJfXKQ","UC_wp-1vWJxrB2tzJ3yT618g","UCIVhUjqW-sOZiBUE7Un9Bkw","UCKb8u1n-zGfwIgv1-nyjKNw","UC5fHBGiBdRN5MWMHEGFcZNw","UCgNg3vwj3xt7QOrcIDaHdFg","UCuD1cRmH2Dl0HW-gFQ3Aluw","UCJWCJCWOxBYSi5DhCieLOLQ","UC_voeHE6JFumgTW6juXnQXg","UCAQHQEO4QpI5dXtr3vLoFCg","UCTiL1q9YbrVam5nP2xzFTWQ","UC8HUh8-5afcpHNnrD8-ZOrA","UC8AvcEE8l8mHs-rZTXoynVQ","UCLrI-dOLyDbRnPyUeWadsOg","UCyfXrFVGvMxuLZbslH276fg","UC_m-yurHhUUypqIBgH-w8Bw","UC7pp40MU_6rLK5pvJYG3d0Q","UCR9Gcq0CMm6YgTzsDxAxjOQ","UCBFq0WddUlytySF-RsRXgGA","UC-yewGHQbNFpDrGM0diZOLA","UCrmZwuKSnPtwOVX5Uq4J4NA","UCd0f7Dor1gjTA2Tloepit2A","UC11OPzwn5Wt0-LN3rARunmg","UCPKT_csvP72boVX0XrMtagQ","UC6DicDItkLQ7N4ag1JS5mqg","UC9XF2nKk5rhKptbCmRv1MOg","UCpts-8H1DqUaGmUkFhbXMQQ","UC1X9HTMhyL4UpmjgkrN41oQ","UCMpAklXQxme_wZi3sdHdHVQ","UCVZlxkKqlvVqzRJXhAGq42Q","UCKuphhWsSpVkfOivxdTpupw","UC8q23MpiyWjv9vd4r85oj1A","UCzQUP1qoWDoEbmsQxvdjxgQ","UCJRT8RpG8V7XDOAWgH41hhA","UCxH0sQJKG6Aq9-vFIPnDZ2A","UCi5_jmhcvmj3cyo9JHh6UnA","UCZSr5B0l07JXK2FIeWA0-jw","UCPzFLpOblZEaIx2lpym1l1A","UClb90NQQcskPUGDIXsQEz5Q","UCrT7Pzf3xo52RQ2IN8QrQsA","UC_QywfFAjVkJzLNVBu6lFJw","UCR1D15p_vdP3HkrH8wgjQRw","UCCamVhi5wQkjdnXHJJSjmNw","UCNv0zmezIa_tuN9vUc3_Ziw","UCCeNgCnvIig20KToD_bkS6A","UCx1sDANGlyYQtVcfxp1mt3w","UC-8QAzbLcRglXeN_MY9blyw","UC4uQyE3rm7Ou6MyZmQDvV0w","UCAk3t7WHs2zjsZpopox8Taw","UCwfbruHSdAmxTjv3sn0A_Ow","UCRSSEcNnFKURWw1NZ7DpRCg","UCpCSAcbqs-sjEVfk_hMfY9w","UCRxAgfYexGLlu1WHGIMUDqw","UC4TjXPVIYz9Z13SB3vxKuZQ","UC9yt3wz-6j19RwD5m5f6HSg","UC9K9r4Wh9OO18BZP4KP9vGQ","UCeuZuscpnYmdWj83TvZLdmA","UCW5YeuERMmlnqo4oq8vwUpg","UC9Jqt2iEMVufQUSBX9JwVXQ","UCMdEvelZ3uNkK2ZEmehU7Cg","UCwnKziETDbHJtx78nIkfYug","UC5aqukzSeAj9etVpQpct88A","UChZyTBG-zrTgTnO-tAMNAwA","UCl4l2tOcEw3oNmjcy6zDPjw","UCFSoDSLxgbeHhEzAO8UZqAQ","UCBlAJEg-PKoRoHcyhiAopRg","UCNcfteaeJ_0cphvCRYCanxA","UCyPZmjEThQK5O3JuZfrPdiA","UCXLdDPcQD0BWjb00fGdFFYg","UCh4nQjfLEajxoyxQaHhxP-A","UCD2VuGlPSfBDFGKhxviv1Zg","UCeLFL5kXWuv66Uh9tWJYi2A","UCvBqzzvUBLCs8Y7Axb-jZew","UC4FrvWBLhbOkpgOHj-jz6Ww","UCQHofQeCmh7naz8OBJRVr7A","UCy7Jb0LIMV_hLlUu6ODgJfQ","UCL_mnuQunm9hWkHRULllDmg","UC5g-f-g4EVRkqL8Xs888BLA"]
    
    const SUBque = new Queue(30, 100)

    let toDo = []
    let failedTasks = []
    let completedTasks = []
    let result = []
    let wynikk = []
    let done = false
    let failCount = 0
    let requestCount = 0
    let inProgress = 0

    let q
    
    const processResult = res => {
        $SUBsRefreshedAt = new Date().getTime()
        
        // const cache = await $ipfs.dag.put(SUBfeed)
        // $SUBcacheCID = cache
        let przyciety = res.map(channel => {   
            return {
                ...channel, 
                latestVideos: channel.latestVideos.map(video => {
                    return {
                        title: video.title,
                        videoId: video.videoId,
                        authorId: video.authorId,
                        author: video.author,
                        viewCount: video.viewCount,
                        published: video.published,
                        publishedText: video.publishedText,
                        isUpcoming: video.isUpcoming,
                        lengthSeconds: video.lengthSeconds,
                        liveNow: video.liveNow,
                    }
                })
            }
        })
        let poDatach = []
        przyciety.forEach(channel => {
            channel.latestVideos.forEach((video, index) => {
                if(index < 5) poDatach.push(video)
            })
        })
        
        wynikk = poDatach.sort((a, b) => b.published - a.published)
        $SUBcache = wynikk
    }
    
    const fetchSubscriptions = async tasks => {
        toDo = [...tasks]
        q = []
        for (let channelID of toDo) {
            const me = Symbol()
            const instance = chooseInstance($instances)
            q.push(SUBque.wait(me, -1)
            .then(async () => {
                try {
                    inProgress++
                    requestCount++

                    const controller = new AbortController()
                    const id = setTimeout(() => controller.abort(), 3000)
                    const req = await fetch(`https://${instance}/api/v1/channels/${channelID}?fields=authorId,author,latestVideos`, { signal: controller.signal })
                    const res = await req.json()
                    inProgress--
                    clearTimeout(id)

                    if(res.authorId) {
                        toDo = toDo.filter(x => x !== res.authorId)
                        
                        const updated = instanceRequestStatus($instances, instance, 'ok')
                        if(updated) $instances = updated

                        const exist = result.findIndex(x => x.authorId === res.authorId) > -1
                        if(!exist) {
                            result = [...result, res]
                            processResult(result)
                        }
                    }

                    } catch(err) {
                        console.log('err', err)
                        
                        const updated = instanceRequestStatus($instances, instance, 'fail')
                        if(updated) $instances = updated

                        failCount++
                        failedTasks = [...failedTasks, channelID]
                    } finally {
                        inProgress--
                        SUBque.end(me)
                    }
                // }, 2000)
            })
            // .finally(() => SUBque.end(me))
        )}
        await Promise.all(q) //SUBque.flush()
        return done = true
    }

    let counter = 0

    fetchSubscriptions(Youtube)
    $: if(done) {
        counter++
        done = false
        failedTasks = failedTasks.filter(x => completedTasks.findIndex(y => y === x) < 0)
        console.log('--- nextRound ---')
        // console.log('failedTasks', failedTasks)
        console.log('result', result)
        console.log('Youtube', Youtube)
        console.log('counter', counter)
        console.log('ynstancezStatus', $instances)
        console.log('--- END nextRound ---')
        if(toDo.length > 0 && counter < 5) fetchSubscriptions(toDo)
    }
    const test = instances => {
        return instances.map(x => x[0])[Math.floor(Math.random()*instances.length)]
    }
</script>

<div>
    <!-- inProgress   : {inProgress}<br>
    requestCount : {requestCount}<br>
    failCount    : {failCount}<br>>
    <hr>
    total Tasks      : {Youtube.length}<br>
    completed Tasks  : {completedTasks.length}<br>
    done Tasks       : {result.length}<br>
    failed Tasks     : {failedTasks.length}<br>
    done?            : {done}
    <hr>
    DO POBRANIA: {Youtube.length}
    <hr> -->
    <!-- {#each Youtube.sort(sortThings) as x}
        {x},&nbsp;
    {/each}
    <hr> -->
    <!-- POBRANE: {result.length}
    <hr> -->
    <!-- {#each result as x}
        {x.authorId},&nbsp;
    {/each}
    {result.length} -->
    <!-- <hr>
    FAILED: {failedTasks.length} -->
    <!-- <hr>
    {#each failedTasks.sort(sortThings) as x}
        {x},&nbsp;
    {/each} -->

</div>
<ProgressBar total={Youtube.length} progress={(result.length/Youtube.length)*100} />
{#if wynikk.length}
    <Videos chosen={$chosen} videos={wynikk} />
{/if}