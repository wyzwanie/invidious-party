// get list of instances from api.invidious.io
export const getInstances = async () => {
    let parsedInstances = []
    let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
    let allInstances = await instancesRequest.json()

    allInstances.forEach(instance => {
        if(instance[1].type === 'https' && instance[1].monitor && instance[1].monitor.statusClass === 'success') {
            const name = instance[0]
            const { flag, uri, openRegistrations, lastChannelRefreshedAt, stats } = instance[1]

            parsedInstances = [...parsedInstances, [ name, {
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
    console.log(filteredInstances)
    return filteredInstances[Math.floor(Math.random()*filteredInstances.length)]
}

//save parameter to localStorage
export const saveLocal = async data => {
    const { instances, theme, rss } = data
    if(instances) localStorage.instances = JSON.stringify(instances)
    if(instances || rss) localStorage.lastUpdate = new Date().toJSON()
    if(theme) localStorage.theme = theme
    if(rss) localStorage.rss = rss
}