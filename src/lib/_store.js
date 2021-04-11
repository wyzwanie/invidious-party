import { writable } from 'svelte/store'

function createStore() {
    const { subscribe, set, update } = writable({})

    return {
        set,
        subscribe,
        // nextChosen: () => update(currentStore => {
        //     let tmpArr = []
        //     if(!Object.)
        //     console.log(currentStore)
        // }),
        nextChosen: () => update(currentStore => {
            const chooseInstance = instances => {
                let tempInstances = []

                if(!instances || !Object.keys(instances).length) return undefined
                Object.keys(instances).forEach(i => {
                    if(instances[i]) tempInstances.push(i)
                })
                if(!tempInstances.length) return 'no valid instances'
                return tempInstances[Math.floor(Math.random()*tempInstances.length)]
            }
            const newStore = {
                instances: currentStore.instances,
                chosen: chooseInstance(currentStore.instances),
                lastUpdate: new Date().toJSON()
            }
            console.log(newStore)
            return newStore
        })
    }
}

// export const store = writable({})
export const store = createStore()
export const chosen = writable()
//next chosen