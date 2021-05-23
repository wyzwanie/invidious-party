import { writable } from 'svelte/store'

export const chosen = writable(null)

export const peers = writable({})
export const party = writable(false)
export const actions = writable(false)
// export const idsToNames = writable({})