// get list of instances from api.invidious.io
export const getInstances = async () => {
    let parsedInstances = []
    let instancesRequest = await fetch('https://api.invidious.io/instances.json?pretty=0')
    let allInstances = await instancesRequest.json()

    allInstances.forEach(instance => {
        if(instance[1].type === 'https' && instance[1].monitor && instance[1].monitor.statusClass === 'success') {
            const name = instance[0]
            const { flag, uri, openRegistrations, lastChannelRefreshedAt } = instance[1]
            // const version = instance[1].software.version.split('-')[1] || ''

            parsedInstances = [...parsedInstances, [ name, {
                flag,
                uri: uri[uri.length-1] !== '/' ? `${uri}/` : uri,
                openRegistrations,
                lastChannelRefreshedAt,
                // version,
                enabled: true
            }]]
        }
    })
    return parsedInstances
}

// input: parsedInstances, output: chosen
export const chooseInstance = instances => {
    console.log(instances)
    if(!instances || instances.length < 1) return 'oops something went wrong'
    let filteredInstances = []
    for(let i of instances) {
        if(i[1].enabled) filteredInstances.push(i[1].uri)
    }
    if(!filteredInstances.length) return 'no valid instances'
    console.log(filteredInstances)
    return filteredInstances[Math.floor(Math.random()*filteredInstances.length)]
}

//save parameter to localStorage
export const saveLocal = async (instances, theme) => {
    localStorage.instances = JSON.stringify(instances)
    if(instances) localStorage.lastUpdate = new Date().toJSON()
    localStorage.theme = theme
}