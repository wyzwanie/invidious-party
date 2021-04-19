// get list of instances from api.invidious.io
export const getInstances = async () => {
    let parsedInstances = []
    let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
    let allInstances = await instancesRequest.json()

    allInstances.forEach(instance => {
        if(instance[1].type === 'https' && instance[1].monitor && instance[1].monitor.statusClass === 'success') {
            const name = instance[0]
            const { flag, uri, openRegistrations, lastChannelRefreshedAt, stats } = instance[1]

            if(name) parsedInstances = [...parsedInstances, [ name, {
                flag,
                uri: uri[uri.length-1] !== '/' ? `${uri}/` : uri,
                openRegistrations,
                lastChannelRefreshedAt,
                version: (stats && stats.software) ? stats.software.version.split('-')[1] : '',
                enabled: true
            }]]
        }
    })
    return parsedInstances
}

// input: parsedInstances, output: chosen
export const chooseInstance = instances => {
    if(!instances || instances.length < 1) return 'oops something went wrong'
    let filteredInstances = []
    for(let i of instances) {
        if(i[1].enabled) filteredInstances.push(i[0])
    }
    if(!filteredInstances.length) return 'no valid instances'
    return filteredInstances[Math.floor(Math.random()*filteredInstances.length)]
}

//save parameter to localStorage
export const saveLocal = async data => {
    const { instances, theme, rss, subscriptions } = data
    if(instances) localStorage.instances = JSON.stringify(instances)
    if(instances || rss) localStorage.lastUpdate = new Date().toJSON()
    if(theme) localStorage.theme = theme
    if(rss) localStorage.rss = rss
    if(subscriptions) localStorage.subscriptions = JSON.stringify(subscriptions)
}

//input: chosen instance, output: version
export const getVersion = (chosen, instances) => {
    // console.log(chosen)
    // console.log(instances)
    // $store.instances[$store.instances.findIndex(x => w[0] === $chosen)][1].version
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
export const getAuthorThumbnail = (chosen, authorThumbnails) => {
    const link = authorThumbnails[authorThumbnails.findIndex(x => x.width == 100)].url
    console.log(link)
    const extracted = link.split('/')[4]
    return `https://${chosen}/ggpht/ytc/${extracted}`
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))