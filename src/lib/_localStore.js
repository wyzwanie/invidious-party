
import { writable as internal, get } from 'svelte/store'

function writable(key, initialValue) {
  const store = internal(initialValue)
  const { subscribe, set } = store
  const json = typeof(localStorage) != 'undefined' ? localStorage.getItem(key) : null

  if(json) set(JSON.parse(json))

  function updateStorage(key, value) {
    if (typeof(localStorage) == 'undefined')
      return

    localStorage.setItem(key, JSON.stringify(value))
  }

  return {
    set(value) {
      updateStorage(key, value)
      set(value)
    },
    update(cb) {
      const value = cb(get(store))

      updateStorage(key, value)
      set(value)
    },
    subscribe
  }
}

export const consent = writable('consent', false)
export const nick = writable('name', false)
export const instances = writable('instances', [])
export const instancesUpdatedAt = writable('instancesUpdatedAt', null)

export const SUBs = writable('SUBs', [])
export const SUBsCID = writable('SUBsCID', null)
export const SUBcache = writable('SUBcache', [])
export const SUBcacheCID = writable('SUBcacheCID', null)
export const SUBsUpdatedAt =  writable('SUBsUpdatedAt', null)
export const SUBcacheUpdatedAt = writable('SUBcacheUpdatedAt', null)
export const SUBsRefreshedAt = writable('SUBsRefreshedAt', null)

export const settings = writable('settings', {
    theme: 'dark',
    accent: '#todo'
})