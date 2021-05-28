// get list of instances from api.invidious.io
export const getInstances = async (ynst = undefined) => {
    let parsedInstances = []
    let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
    let allInstances = await instancesRequest.json()

    allInstances.forEach(instance => {
        try {
            const version = instance[1].stats.software.version.split('-')[0]
            const newEnough = new Date(version) > new Date('2021-04-30')

            if(version && newEnough) {
                const metadata = instance[1].stats.metadata
                const name = instance[0]
                const { flag, uri } = instance[1]
    
                if(ynst) {
                    const index = ynst.findIndex(x => x[0] === name)
                }
                parsedInstances = [...parsedInstances, [ name, {
                    name,
                    failedRequests: ynst ? ynst[index].failedRequests : 0,
                    lastFailedRequest: ynst? ynst[index].lastFailedRequest : new Date().getTime(),
                    enabled: ynst ? ynst[index].enabled : true,
                    data: {
                        flag,
                        uri: uri[uri.length-1] !== '/' ? `${uri}/` : uri,
                        metadata,
                        version,
                    },
                    refreshedAt: new Date().getTime()
                }]]
            }
        } catch(e) {
            console.log(instance[0], e)
        }
    })
    return parsedInstances
}

// input: parsedInstances, output: chosen
export const chooseInstance = instances => {
    if(!instances || instances.length < 1) return 'oops something went wrong'
    let filteredInstances = []
    for(let i of instances) {
        // console.log(i[1].failedRequests)
        // console.log(i[1].enabled && i[i].failedRequests < 11)
        if(i[1].enabled && i[1].failedRequests <11) filteredInstances.push(i[0])
    }
    if(!filteredInstances.length) return 'no valid instances'
    return filteredInstances[Math.floor(Math.random()*filteredInstances.length)]
}

//save parameter to localStorage
export const saveLocal = async storeObject => {
    const { instances, theme, subscriptions, SUBcache, consent } = storeObject
    if(consent) localStorage.consent = consent
    if(instances) {
        localStorage.instances = JSON.stringify(instances)
        localStorage.lastInstancesUpdate = new Date().getTime()
    }
    if(subscriptions) localStorage.subscriptions = JSON.stringify(subscriptions)
    if(theme) localStorage.theme = theme
    if(SUBcache) localStorage.SUBcache = JSON.stringify(SUBcache)
    localStorage.lastStoreUpdate = new Date().getTime()
}

export const convertCount = count => {
    if(Math.floor(count/1000) < 1000) return `${(count/1000).toFixed(2)}K`
    if(Math.floor(count/1000000) < 1000) return `${(count/1000000).toFixed(2)}M`
    if(Math.floor(count/1000000000) < 1000) return `${(count/1000000000).toFixed(2)}G`
    else return count
}

export const secToMin = seconds => {
    let minutes = seconds / 60
    let newMinutes = Math.floor(minutes)
    let newSeconds = Math.round((minutes - newMinutes) * 60)
    newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds
    return `${newMinutes}:${newSeconds}`
}

export const howLongAgo = timestamp => {
    const now = Math.floor(new Date().getTime()/1000)
    const diff = now - timestamp

    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    let result
    
    if(diff < 30) result = `just then`
    else if(diff < minute) result = `${diff} seconds ago`
    else if(diff < 2 * minute) result = `$a minute ago`
    else if(diff < hour) result = `${Math.floor(diff / minute)} minutes ago`
    else if(Math.floor(diff / hour) == 1) result = `1 hour ago`
    else if(diff < (day * 2)) result = `${Math.floor(diff / hour)} hours ago`
    // else if(diff < day * 2) result = 'yesterday'
    else if(diff < month * 2) result = `${Math.floor(diff / day)} days ago`
    // else if(diff < 2 * month) result = `last month`
    else if(diff < year) result = `${Math.floor(diff / month)} months ago`
    else if(diff < year * 2) result = `${Math.floor(diff / month)} months ago`
    else if(diff < year * 100) result = `${Math.floor(diff / year)} years ago`

    return result
}

export const getAuthorThumbnail = (chosen, authorThumbnails) => {
    const link = authorThumbnails[authorThumbnails.findIndex(x => x.width == 100 || x.width == 88)].url
    const extracted = link.split('/')[4]
    return extracted ? `https://${chosen}/ggpht/ytc/${extracted}` : ''
}

// export const getQueryString = (field, url) => {
//     const href = url ? url : window.location.href;
//     const reg = new RegExp( '[?&]' + field + '=([^]*)', 'i' );
//     const string = reg.exec(href);
//     return string ? string[1] : null;
// }

export const log = (fromQ, msg, env) => env === 'dev' ? console.log(fromQ, msg) : ''
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const validateVideoID = videoID => {
    const pattern = /^([A-Za-z0-9_\-]{11})$/
    return pattern.test(videoID)
}
export const validateChannelID = channelID => {
    const pattern = /^([A-Za-z0-9_\-]{24})$/
    return pattern.test(channelID)
}
export const validatePlaylistID = playlistID => {
    const pattern = /^([A-Za-z0-9_\-]{34})$/
    return pattern.test(playlistID)
}
// export const sortThings = (a, b) => {
//     if (a > b) return 1
//     else if (a < b) return -1
//     else if (a === b) return 0
// }


import { EventEmitter } from 'events'

export class Fetcher extends EventEmitter {
    constructor(instance, url) {
        super()
        this.instance = instance
        this.url = url
        this.controller = undefined
        this.signal = undefined
        this.failedCount = 0
        this.running = false
    }

    abort() {
        if(this.controller) {
            this.controller.abort()
            this.signal = undefined
            this.controller = undefined
        }
        this.running = false
    }

    async go() {
        this.running = true
        if(this.failedCount > 10) return this.abort()
        if(!this.instance) return this.abort()
        if(this.instance === 'no valid instances' || this.instance === 'oops something went wrong') {
            this.failedCount++
            this.emit('err', this.instance)
            return this.abort()
        }
        if(this.controller === undefined) {
            this.controller = new AbortController()
            this.signal = this.controller.signal
        } else {
            return this.abort()
        }
        
        try {
            this.emit('start')
            const id = setTimeout(() => this.abort(), 5000)
            const req = await fetch(`https://${this.instance}/api/v1${this.url}`, { signal: this.signal })
            const res = await req.json()
            clearTimeout(id)

            this.signal = undefined
            this.controller = undefined
            this.running = false
            this.emit('ok', res)
            return res
        } catch(err) {
            this.failedCount++
            this.signal = undefined
            this.controller = undefined
            this.running = false
            this.emit('err', err)
            return err
        }
    }
}


export const instanceFailedRequest = (instances, chosen) => {
    const index = instances.findIndex(x => x[0] === chosen)
    if(index < 0) return false
    instances[index][1].failedRequests++
    instances[index][1].lastFailedRequest = new Date().getTime()
    return instances
}