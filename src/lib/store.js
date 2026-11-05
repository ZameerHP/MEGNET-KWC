import { useSyncExternalStore } from 'react'

/* Tiny global store (no extra dependency). */
const state = {
  loaderDone: false,
  handoff: false, // true once the hero magnet has "landed" in the Shop card
  lenis: null,
  menuOpen: false,
  activeType: 'photo',
  tier: 'high', // 'high' | 'low' | 'none' (WebGL capability)
}
const listeners = new Set()

export const store = {
  get: () => state,
  set(patch) {
    let changed = false
    for (const k in patch) if (state[k] !== patch[k]) { state[k] = patch[k]; changed = true }
    if (changed) listeners.forEach((l) => l())
  },
  subscribe(l) { listeners.add(l); return () => listeners.delete(l) },
}

export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state), () => selector(state))
}
