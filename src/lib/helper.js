// get list of instances from api.invidious.io
export const getInstances = async (ynst = undefined) => {
    let parsedInstances = []
    let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
    let allInstances = await instancesRequest.json()

    allInstances.forEach(instance => {
        const version = instance[1]?.stats?.software?.version.split('-')[0]
        if(version) {
            const newEnough = new Date(version.replaceAll('.', '-')) > new Date('2021-04-30')
            if(newEnough) {

                const metadata = instance[1]?.stats?.metadata
                const name = instance[0]
                const { flag, uri } = instance[1]
                if(ynst) {
                    const index = ynst.findIndex(x => x[0] === name)
                }

                parsedInstances = [...parsedInstances, [ name, {
                    name,
                    successRequests: ynst ? ynst[index].successRequests : 0,
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
        }
    })
    return parsedInstances
}

// input: instances store , output: chosen
export const chooseInstance = instances => {
    if(!instances || instances.length < 1) return 'oops something went wrong'
    let filteredInstances = []
    for(let i of instances) {
        const total = i[1].successRequests + i[1].failedRequests
        const successRatio = total > 0 ? i[1].successRequests / total : 0
        if(i[1].enabled) {
            if(total > 0) {
                if(successRatio > 0.3) filteredInstances.push(i[0])
                else if(total === 1) filteredInstances.push(i[0])
            } else {
                filteredInstances.push(i[0])
            }
        }
    }
    if(!filteredInstances.length) return 'no valid instances'
    return filteredInstances[Math.floor(Math.random()*filteredInstances.length)]
}

//input: instances store, current chosen, request status, output: updated instances store
export const instanceRequestStatus = (instances, chosen, status) => {
    const index = instances.findIndex(x => x[0] === chosen)
    if(index < 0) return false
    if(status === 'fail') {
        instances[index][1].failedRequests++
        instances[index][1].lastFailedRequest = new Date().getTime()
    }
    if(status === 'ok') instances[index][1].successRequests++
    return instances
}

//input: 123456, output: 123.45K
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

export function howLongAgo(timestamp) {
    let diff = Math.floor(new Date().getTime()/1000) - timestamp
    let part = 0
    let prefix = ''
    let suffix = ''

    if(diff > 0) {
        prefix = ''
        suffix = ' ago'
    } else {
        prefix = 'in '
        suffix = ''
    }

    diff = Math.abs(diff)
  
    if(diff < 2) return `${prefix}a moment${suffix}`
    if(diff < 5) return `${prefix}moments${suffix}`
    if(diff < 60) return `${prefix}${diff} seconds${suffix}`
  
    if(diff < 120) `${prefix}a minute${suffix}`
    if(diff < 3600) {
        while (diff >= 60) { diff -= 60; part += 1 }
        return `${prefix}${part} minutes${suffix}`
    }
  
    if(diff < 7200) return `${prefix}an hour${suffix}`
    if(diff < 86400) {
        while (diff >= 3600) { diff -= 3600; part += 1 }
        return `${prefix}${part} hours${suffix}`
    }
  
    if(diff < 172800) return `${prefix}a day${suffix}`
    if(diff < 604800) {
        while (diff >= 172800) { diff -= 172800; part += 1 }
        return `${prefix}${part} days${suffix}`
    }
  
    if(diff < 1209600) return `${prefix}a week${suffix}`
    if(diff < 2592000) {
        while (diff >= 604800) { diff -= 604800; part += 1 }
        return `${prefix}${part} weeks${suffix}`
    }
  
    if(diff < 5184000) return `${prefix}a month${suffix}`
    if(diff < 31536000) {
      while (diff >= 2592000) { diff -= 2592000; part += 1 }
      return `${prefix}${part} months${suffix}`
    }

    if(diff < 6307200) return `${prefix}a year${suffix}`
    if(diff < Infinity) {
        while (diff >= 31536000) { diff -= 31536000; part += 1}
        return `${prefix}${part} years${suffix}`
    }
  }


export const getAuthorThumbnail = (chosen, authorThumbnails) => {
    const link = authorThumbnails[authorThumbnails.findIndex(x => x.width == 100 || x.width == 88)].url
    const extracted = link.split('/')[4]
    return extracted ? `https://${chosen}/ggpht/ytc/${extracted}` : ''
}

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
    const pattern = /^([A-Za-z0-9_\-]{12,})$/
    return pattern.test(playlistID)
}

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
        this.what
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
        // if(this.failedCount > 20) return this.abort()
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
            this.emit('start', this.url)
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

export const filterTable = {
    'most views': (a, b) => b.viewCount - a.viewCount,
    'least views': (a, b) => a.viewCount - b.viewCount,
    shortest: (a, b) => a.lengthSeconds - b.lengthSeconds,
    longest: (a, b) => b.lengthSeconds - a.lengthSeconds,
    newest: (a, b) => b.published - a.published,
    oldest: (a, b) => a.published - b.published
}