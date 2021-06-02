import { writable } from 'svelte/store'

export const chosen = writable(null)

export const peers = writable({})
export const party = writable(null)
export const actions = writable(null)
export const searchQuery = writable(null)