<script>
    import { onMount } from 'svelte'
    import { store, SUBs } from '$lib/_store'
    // import { chooseInstance } from '$lib/_helper'
    import { Queue } from '$lib/_queue'
    // import Videos from '$lib/Videos.svelte'

    let instances
    let subscriptions = []
    let tasks = []
    
    let toDo = 0
    let inProgress = 0
    let finished = 0
    let concurrency = 10
    let requestMade = 0
    let failedCount = 0

    const job = async (task, next) => {
        const { instance, channelID, interval } = task
        let error = null

        if(subscriptions.findIndex(x => x.authorId == task.channelID) > -1) return setTimeout(next, interval, null, task)

        inProgress++
        let fetchChannel = await feCh(instance, channelID)
        if(fetchChannel.success) subscriptions = [...subscriptions, fetchChannel.res]
        else error = fetchChannel
        inProgress--
        setTimeout(next, interval, error, task)
    }
    const SUBqueue = Queue.channels(concurrency)
        .timeout(3000)
        .process(job)
        .success(task => {
            console.log('success', task)
            toDo--
            finished++
        })
        .failure((err, task) => {
            const instanceIndex = instances.findIndex(x => x.instance == task.instance)
            console.log('err', err)
            failedCount++
            SUBqueue.add({ ...task, instance: instances[instanceIndex+1] ? instances[instanceIndex+1].instance : instances[instanceIndex-1].instance })
            
            // if(subscriptions.findIndex(x => x.authorId == task.channelID) > -1) return true
            // if(err.reason === 'Failed to fetch') SUBqueue.add(task)
            // if(err.reason === 'Read timed out') SUBqueue.add(task)
            // if(err.reason === 'too many retries on instance') SUBqueue.add(task)
            // if(err.message === 'Process timed out') SUBqueue.add(task)
        })
        // .drain(() => console.log('Queue drain'));

        const feCh = async (instance, channelID) => {
        requestMade++

        try {
            const req = await fetch(`https://${instance}/api/v1/channels/${channelID}?fields=author,authorId,latestVideos`)
            const res = await req.json()

            if(res && res.authorId) return { success: channelID, from: instance, res }
            else return { failed: channelID, from: instance, reason: res }
            // if(res && res.error) return { failed: channelID, from: instance, reason: res.error }
        } catch(error) {
            return { failed: channelID, from: instance, reason: error.message }
        }
    }

    const updateSubscriptions = () => {
        test.forEach((subID, i) => {
            tasks = [...tasks, {
                instance: instances[i] ? instances[i].instance : instances[i % instances.length].instance,
                channelID: subID,
                interval: 0.682
            }]
        })
        concurrency = tasks.length < 11 ? 10 : (tasks.length / 200 > 1 ? 30 : 20)
        tasks.forEach(task => SUBqueue.add(task))
    }


    const initialize = store => {
        if(store && store.instances && store.subscriptions) {
            instances = store.instances.map((curr, index) => {
                if(typeof curr[0] === 'string' && curr[0].length > 0) {
                    return {
                        instance: curr[0],
                        counter: 0
                    }
                }
            })

            const first_fetch = store.subscriptions.SUBs.length && !store.subscriptions.lastFetch
            const update = (store.subscriptions.SUBs.length && (new Date().getTime() - store.subscriptions.lastFetch))
            //if there are SUBs saved, but nothing was ever fetched fetched
            if(first_fetch || update) {
                //else subscriptions = store.subscriptions.latest
                const test = ['UCAmg0HpcIXdIyKSw5aml8HA', 'UCm22FAXZMw1BaWeFszZxUKw', 'UCpXwMqnXfJzazKS5fJ8nrVw', 'UCodkNmk9oWRTIYZdr_HuSlg', 'UCL_f53ZEJxp8TtlOkHwMV9Q', 'UCHykVXxOLGdXTvBh82oGCog', 'UCrvz2RsOkUdNA3UCMFmvvnw', 'UC867Q451mPjjD52peYqpF4A', 'UCZ3bvy8G3TpURYYASrFsEeA', 'UCuKAMWP_iGWAXQEZJ1lyxCg']
                // const test = ["UCAmg0HpcIXdIyKSw5aml8HA","UC2-slOJImuSc20Drbf88qvg","UC8Q7XEy86Q7T-3kNpNjYgwA","UCpXwMqnXfJzazKS5fJ8nrVw","UCm22FAXZMw1BaWeFszZxUKw","UCHykVXxOLGdXTvBh82oGCog","UC867Q451mPjjD52peYqpF4A","UCrvz2RsOkUdNA3UCMFmvvnw","UCuNy42Y5egf07cSiHbF23wg","UC__vX0QGDIOQgelZ0rdIOsA","UCvK4bOhULCpmLabd2pDMtnA","UCL_f53ZEJxp8TtlOkHwMV9Q","UC7zlt5O0XQgz851q_ZWwk5g","UCMR_nAMCppEXZiDZ-HLAeJg","UCodkNmk9oWRTIYZdr_HuSlg","UCatDoyZBxEI5ym-Z1R9XZ6g","UC8m_wYdQFOLWIdupJrXnhQg","UCZ3bvy8G3TpURYYASrFsEeA","UCqMVaZM-USi0G54pu5318dQ","UCE_paKcgmlk4piFodH5Wrxg","UCH6E4xDfxBqrkoKdAyVu2dg","UCjI3-FRNbKFvnrG4iDnQCQw","UC9T6tYiK-5OlQ_YBpPhfREQ","UC-WMwOzgFdvvGVLB1EZ-n-w","UC7ucvC0OrD2BQUmEec5NJeg","UCbfYPyITQ-7l4upoX8nvctg","UC2IZ-VjoG467JBCVstD5WPw","UCqVUDbWANEG47KmB2MoM6IA","UCqqKgdUv3BIvs-Y2w7xJBoA","UCM2YmsRUeIbRkqjgNm0eTGQ","UCJ4h7utY-IjXKXOUuwmSYXw","UCptAHlN1gdwD89tFM3ENb6w","UCIRiWCPZoUyZDbydIqitHtQ","UCworsKCR-Sx6R6-BnIjS2MA","UC_ML5xP23TOWKUcc-oAE_Eg","UCOavg1FtdeuyUTLz3wmuIKQ","UCINRrQmprPmC_xMDyFweHXQ","UC_wbVsZY1gbgrVgMbOSMCyA","UChKFnPoA9O2dAMrcNT2aUsQ","UCO7WDNkmzkfg-U_n9ix6aeQ","UCLF2DONV6JCJUs6eK6POaxg","UCAWCSm3nrVjwHBts3RQ38iQ","UC98_050r8lMxngxurJgU1gA","UCiRiQGCHGjDLT9FQXFW0I3A","UCAGTpcuP8o9_sWzvDGfZYKA","UCSQL2gI40u6XULunbjZ02Kw","UC29ju8bIPH5as8OGnQzwJyA","UC4TJ3TENuTpkO6OgqO44TFw","UCZSJEX8QvqdhDQ0WhRjlqkg","UCyUBW72KU30dfAYWLVNZO8Q","UCRatys97ggrXVtQQBGRALkg","UChg4k23shL6Xf0lyA8D4w_w","UC281yIVp-U8Ijg4KUVRgDRA","UCE7b3weKYX_KATV47EVIPHA","UClu2e7S8atp6tG2galK9hgg","UCeqSUA4o9kyaD15VjM__uDg","UCL0u5uz7KZ9q-pe-VC8TY-w","UClgyqJ3ToNoWvO81T9GV07Q","UC4QZ_LsYcvcq7qOsOhpAX4A","UCZ9aMM1v-0HcKS9SYHVekUA","UCu6mSoMNzHQiBIOCkHUa2Aw","UC7FX3mdJ-zPjTMbxv-nCsGg","UCF2_XJffJwfmcAZ-Avmg3fA","UCbbz3_jH582xS93hxszPvjQ","UCmt4OVC6o7WYGI1Cw4aIQQg","UCs9pt6HOHWTZc6Ju6ZofOpQ","UCF49IVUlpV1kZVA14vfivwQ","UCmGVAcHMaM-xmffSNxF2dyA","UCHkkUuVWTSwN82IHIhxq_jg","UCLNgu_OupwoeESgtab33CCw","UCJJOPBQ9KITlzGyxwWxgswg","UCRtyLX-ej-H1PSiaw8g9aIA","UCV5vCi3jPJdURZwAOO_FNfQ","UCrv269YwJzuZL3dH5PCgxUw","UCqwCM44EbcLK5rUeWjBbmiA","UCbx6pClCMGeTTWydbGR9zzA","UCyWDmyZRjrGHeKF-ofFsT5Q","UCho-XTOszUf8vxjy0bm20lA","UC_gSotrFVZ_PiAxo3fTQVuQ","UCvKo-PpKHkbYO2xhKWH6mow","UCnrE7PkiyVPP5ZTMqo3QW-Q","UC0XiDgtbFR8ohoGlstuFgGQ","UCtuqcXfY_wJQzeTKHn67wkw","UC9z7EZAbkphEMg0SP7rw44A","UCxJDH_2HXzwUtT62HgWJqCg","UC_T_YxgUApnjCn3qM-T0-hA","UCVZomfn1f2mugJwd3AW58-g","UCDmyxGV9gw4ZfrL6iVkfiRA","UC4178V769P2ckA65-em0JYQ","UCsCkqoXvLwM1b-FXKovEo8Q","UCGhI9Oy4Le2pY7zuDXU8Mlw","UCfFLQTIFphzroMfsMYjtBcQ","UCiqJJdLFUaWLpTeuNmmJTXA","UCsIlJ9eYylZQcyfMOPNUz9w","UC4_ctkkj65dorWrooMhApeA","UCN4M6rqfhk3NhsJOF3IoTgA","UCb9R0TyctlF9i8PhQ7Ffv9g","UCJu_ihulI-4GNeLYbIyLViw","UCzq1iSqvuXIGeNeUvETfSKQ","UCM_-69pwiy8VGNB6kobm9Mw","UCHkYrJ2Fbe7pBjEZvkFzi3A","UCyjzaMkXTTp9P20UZbxDH6w","UC70G73qumyIXJ57r84JpAHg","UCTS_bRqS7oO4y9gYviOFNYw","UC68GPKqwj-F6acTMYxZb0bA","UC9Wesh1nf7vtrMHNF7DtUog","UCHCOMqChQNT35GezGrd1cvg","UCJx74HaacAjDZk8LPdOfUFQ","UCYdXHOv7srjm-ZsNsTcwbBw","UCrc3XCtBGtWErZUVVvn15jQ","UC6EyGxVgmTGt27_U9c_oz9g","UCUmHIdrEgCRUN1DdmaJmndg","UCb9q9pJVg-FNM6jVEyJfXKQ","UC_wp-1vWJxrB2tzJ3yT618g","UCIVhUjqW-sOZiBUE7Un9Bkw","UCKb8u1n-zGfwIgv1-nyjKNw","UC5fHBGiBdRN5MWMHEGFcZNw","UCgNg3vwj3xt7QOrcIDaHdFg","UCuD1cRmH2Dl0HW-gFQ3Aluw","UCJWCJCWOxBYSi5DhCieLOLQ","UC_voeHE6JFumgTW6juXnQXg","UCAQHQEO4QpI5dXtr3vLoFCg","UCTiL1q9YbrVam5nP2xzFTWQ","UC8HUh8-5afcpHNnrD8-ZOrA","UC8AvcEE8l8mHs-rZTXoynVQ","UCLrI-dOLyDbRnPyUeWadsOg","UCyfXrFVGvMxuLZbslH276fg","UC_m-yurHhUUypqIBgH-w8Bw","UC7pp40MU_6rLK5pvJYG3d0Q","UCR9Gcq0CMm6YgTzsDxAxjOQ","UCBFq0WddUlytySF-RsRXgGA","UC-yewGHQbNFpDrGM0diZOLA","UCrmZwuKSnPtwOVX5Uq4J4NA","UCd0f7Dor1gjTA2Tloepit2A","UC11OPzwn5Wt0-LN3rARunmg","UCPKT_csvP72boVX0XrMtagQ","UC6DicDItkLQ7N4ag1JS5mqg","UC9XF2nKk5rhKptbCmRv1MOg","UCpts-8H1DqUaGmUkFhbXMQQ","UC1X9HTMhyL4UpmjgkrN41oQ","UCMpAklXQxme_wZi3sdHdHVQ","UCVZlxkKqlvVqzRJXhAGq42Q","UCKuphhWsSpVkfOivxdTpupw","UC8q23MpiyWjv9vd4r85oj1A","UCzQUP1qoWDoEbmsQxvdjxgQ","UCJRT8RpG8V7XDOAWgH41hhA","UCxH0sQJKG6Aq9-vFIPnDZ2A","UCi5_jmhcvmj3cyo9JHh6UnA","UCZSr5B0l07JXK2FIeWA0-jw","UCPzFLpOblZEaIx2lpym1l1A","UClb90NQQcskPUGDIXsQEz5Q","UCrT7Pzf3xo52RQ2IN8QrQsA","UC_QywfFAjVkJzLNVBu6lFJw","UCR1D15p_vdP3HkrH8wgjQRw","UCCamVhi5wQkjdnXHJJSjmNw","UCNv0zmezIa_tuN9vUc3_Ziw","UCCeNgCnvIig20KToD_bkS6A","UCx1sDANGlyYQtVcfxp1mt3w","UC-8QAzbLcRglXeN_MY9blyw","UC4uQyE3rm7Ou6MyZmQDvV0w","UCAk3t7WHs2zjsZpopox8Taw","UCwfbruHSdAmxTjv3sn0A_Ow","UCRSSEcNnFKURWw1NZ7DpRCg","UCpCSAcbqs-sjEVfk_hMfY9w","UCRxAgfYexGLlu1WHGIMUDqw","UC4TjXPVIYz9Z13SB3vxKuZQ","UC9yt3wz-6j19RwD5m5f6HSg","UC9K9r4Wh9OO18BZP4KP9vGQ","UCeuZuscpnYmdWj83TvZLdmA","UCW5YeuERMmlnqo4oq8vwUpg","UC9Jqt2iEMVufQUSBX9JwVXQ","UCMdEvelZ3uNkK2ZEmehU7Cg","UCwnKziETDbHJtx78nIkfYug","UC5aqukzSeAj9etVpQpct88A","UChZyTBG-zrTgTnO-tAMNAwA","UCl4l2tOcEw3oNmjcy6zDPjw","UCFSoDSLxgbeHhEzAO8UZqAQ","UCBlAJEg-PKoRoHcyhiAopRg","UCNcfteaeJ_0cphvCRYCanxA","UCyPZmjEThQK5O3JuZfrPdiA","UCXLdDPcQD0BWjb00fGdFFYg","UCh4nQjfLEajxoyxQaHhxP-A","UCD2VuGlPSfBDFGKhxviv1Zg","UCeLFL5kXWuv66Uh9tWJYi2A","UCvBqzzvUBLCs8Y7Axb-jZew","UC4FrvWBLhbOkpgOHj-jz6Ww","UCQHofQeCmh7naz8OBJRVr7A","UCy7Jb0LIMV_hLlUu6ODgJfQ","UCL_mnuQunm9hWkHRULllDmg","UC5g-f-g4EVRkqL8Xs888BLA","UCV5XKnvPwdQ19dbQRDHljFw","UCOkeiADGXFF6l7LofqDGVJg","UCkr2vordfEQw9_sB8pvrGyA","UC_RhBfwbg5029C5JL6uAtyw","UCI1smBJHIjec3HFkveM8CnA","UCAL3JXZSzSm8AlZyD3nQdBA","UCMpizQXRt817D0qpBQZ2TlA","UCdjsUXJ3QawK4O5L1kqqsew","UC2RAJCLDzNkQqS29OKitO_Q","UC20-LI-TfGtmuhMTm4EaQ6g","UCRcgy6GzDeccI7dkbbBna3Q","UCo_SOjF6L5Z-8TKnnF7jNlQ","UC8wlElarIOIlpc6-iozPuFw","UCyIwb9HDNyMAk4mRZuEZViA","UC7081EskiIK2jU3NaC7RNAw","UCfVFSjHQ57zyxajhhRc7i0g","UCFKDEp9si4RmHFWJW1vYsMA","UCTWT9LtF8tXmd3qXNEoqYvA","UC4boMCGWnrun23L4GIFArWg","UCd6Za0CXVldhY8fK8eYoIuw","UCMqG0kLgrRv9tODTDG12oZA","UCVPdg3L3kV-dNHDuLoceIjA","UCIcR5StUvA7_pPHoAFLmZaA","UCaDY8WjYWy36bnt0RVzSklw","UCZ9x-z3iOnIbJxVpm1rsu2A","UCil1jHLyIDQvHiRNk-c527g","UCnPbcv9O37e39-813WETb4g","UC8fRRPQ2IOF2XQWi_sSooEw","UC1SPkZIRegQ1uk48qoPLz5Q","UCDsElQQt_gCZ9LgnW-7v-cQ","UCT8M_hDfTRjUbs8hwahZyBA","UCCa794oAhys-HzkqdfmnjdQ","UCSsz5GO1rQjzp1RND7QtEjg","UCw_5mH4DbNdRaEAFMZQKM7w","UCc4LYGedt3x4CUbpgp6yvfg","UC3iyY2U3ElFzSqTqNKrktMw","UCkq0EtBOVSp1d1XNzTsaBRQ","UCttOBQS6RSh8avmR8vcrB8A","UCKmkpoEqg1sOMGEiIysP8Tw","UCEMO63P_-1O622to7cTujpA","UCre8_q4wMsG1k72HvGaRcdw","UCwzwODzBxzW_Cg1LrZWauyw","UClyJhX1nDsn9763Hu76jFRg","UC5TaZWeRgdN7klKM60Hj6rQ","UCVeW9qkBjo3zosnqUbG7CFw","UC4ADK57DRGhb6aVOF0Y7GLg","UCYy9EGb3fvmUSgMVfJ7KXJw","UCciQ8wFcVoIIMi-lfu8-cjQ","UC4wP5oo0WDLweCHQ1dJ8pvw","UCKOzVzkcGLbBvuCwOjXepmg","UCnAXmHktR1Meag47jGcE2Fg","UCdJdEguB1F1CiYe7OEi3SBg","UC02Z6oIaU0LS3H_7YxUUdSA","UCXSF1F_RFRUVNXX4QmB6vmw","UCla6APLHX6W3FeNLc8PYuvg","UCYO_jab_esuFRV4b17AJtAw","UCp68_FLety0O-n9QU6phsgw","UCTjPBE9BNsmv44wgxWEy2zw","UCwnjkBGhMfrNjDBA3BjwVeA","UCt1yPG0cdfkZ4NsPb-bwCeg","UC5NO8MgTQKHAWXp6z8Xl7yQ","UCO8DQrSp5yEP937qNqTooOw","UCC9JHVPm-4P5QDp9vk8EH-A","UCEcMWs6GudljuLw0-Umf97A","UConVfxXodg78Tzh5nNu85Ew","UC7Ucs42FZy3uYzjrqzOIHsw","UCRlEFn0L2G_DktbyvN0AZ5A","UChFuWQsaR5dirv3enu4iYfQ","UCNu7GSRF7Y10OIWHQHpAx1g","UCDrekHmOnkptxq3gUU0IyfA","UCTqcKb3T1QVbOHT8LIFs3xg","UClhh5-EvD2-GcWygukxNB6A","UC9OVdKgPs1_WCIHCGrvXYHA","UCZDA1kA3y3EIg25BpcHSpwQ","UCollJ7NlBKaRr3BV2xKOULA","UCwO_xoYm2vjhu4kZSxFO5mA","UCpfOW3vhZbPMsPHa8TGjL1Q","UCIyOOcACiAA0x9hBUVTHDCg","UCpVdq9gLew6E76BmfB2GJ0w","UCBPJadZcoH51lJBtG3hASzQ","UCL1dOKbCD1XpuYkD1NH-0Jg","UC1WBcg8BxpKelqOOxzmwL8w","UC24lkOxZYna9nlXYBcJ9B8Q","UCk_foUwmaHeFhmAZMnEHQsw","UCJQYmLGU1RUcQuHTF9fS4dQ","UCtqcl4Ee9_FF2a2dcmnCj-A","UCErON4Z0YyiVHKNtx4BvLfg","UCMrMVIBtqFW6O0-MWq26gqw","UCiDwN3t58UND5lei76A6zfg","UCrIOuPmqRLVmHKNGldGf2Kw","UCMOqf8ab-42UUQIdVoKwjlQ","UCbWcXB0PoqOsAvAdfzWMf0w","UCb012o6ysXUCMpRrWBgcG9Q","UCkW7X4j1drqxit0RtQpYHtA","UCBWgHZy-2BlgzS7cH2z29FA","UCt2yxX9jhtBEapmep_K468A","UCp1orOGJwZvjLAvckyxC4Nw","UCFHMw64uu66VKPXq5gh29IQ","UCsf7sdo6rwl-Iggw_wervfA","UCHqIGJlZLsEjEtDadlIvKNQ","UClY084mbGLK_SLlOfgizjow","UCeBsH3tGrOp_vhzsQhA3L8g","UCytTwa2RqjYiOpjuyETybJQ","UCcYzLCs3zrQIBVHYA1sK2sw","UC1e24dS8kS5-jS4XZ5NzrnA","UC9-y-6csu5WGm29I7JiwpnA","UCJ-qLG1bdWVrHM-Hu2W73CQ","UC4woSp8ITBoYDmjkukhEhxg","UCoxcjq-8xIDTYp3uz647V5A","UCj8WNi9Z3k3_OeGt2BojqvA","UClH-MDH7gPS5u4O5zt7krWw","UCFtc3XdXgLFwhlDajMGK69w","UCuftdXePz6z73Wsg8Ao5lTg","UCbM5aiq-du38a05SfseMTPg","UCHSI8erNrN6hs3sUK6oONLA","UCEmIh0BMufql-HxKrKuAANQ","UC9Nfk6H4VxJTBnYnUu3Jc6g","UCE2IKH8vYeRHLgaxFu0Paxw","UCXi_-ZgBkZ4_zOFG9aqNu0A","UCJjwPiERvyOQkq6L5-mWJ8w","UC97MH-AkRpW5CZPi7nomRCw","UCHnyfMqiRRG1u-2MsSQLbXA","UC8jpoK1BqQhDh6HDGFnM_DA","UC2Stn8atEra7SMdPWyQoSLA","UCDLSaWsECz93uRk8m7ZtN5A","UCrGZCgKfpPANtEG0bHESUOA","UCOnnmKlDZltHAqJLz-XIpGA","UCEruUEWGkyONusgF_NzE0Tg","UCuKAMWP_iGWAXQEZJ1lyxCg","UCOjI5_rvIQYDnAPuW5OJt5w","UCjr2bPAyPV7t35MvcgT3W8Q","UC7_GyvwHQWruXTndYHy_Q3w","UCxdOC7z42O2fxeBje5QXpQQ","UC1bMdy0JTGprmCbun6xLxjw","UCGK3xwxFRFvYyXAtDBShlMQ","UC4HCNJ7E9opoyNgS_rqVocw","UCQVC2a-sGrZ8kAF0oGOS4Lg"]
                toDo = test.length
                test.forEach((subID, i) => {
                    tasks = [...tasks, {
                        instance: instances[i] ? instances[i].instance : instances[i % instances.length].instance,
                        channelID: subID,
                        interval: 0.682
                    }]
                })
                concurrency = tasks.length < 11 ? 10 : (tasks.length / 200 > 1 ? 30 : 20)
                tasks.forEach(task => SUBqueue.add(task))
            }
        }
    }

    $: initialize($store)
</script>

<br>
total: {tasks.length}<br>
toDo: {toDo}<br>
inProgress: {inProgress}<br>
success: {finished}<br>
failedRequests: {failedCount}<br>
<hr>
concurrency: {concurrency}<br>
Total requests made: {requestMade}
<hr>
{#key subscriptions}
    {#each subscriptions as s}
        {#if s.latestVideos && s.latestVideos[0]}
            {s.author}: {new Date(s.latestVideos[0].published*1000).toLocaleString()}<br>
        {:else}
            {s.author}: no new videos<br>
        {/if}
    {/each}
{/key}