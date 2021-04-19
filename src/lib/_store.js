import { writable } from 'svelte/store'

export const store = writable({})
export const chosen = writable(null)
export const SUBs = writable([])
export const ipfs = writable(null)