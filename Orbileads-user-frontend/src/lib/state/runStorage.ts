import type { RunRecord } from '../../types/run'

export type RecentToolRecord = {
  toolId: string
  toolSlug: string
  toolName: string
  platformSlug: string
  platformName: string
  viewedAt: string
}

const RUNS_STORAGE_KEY = 'orbileads-runs'
const RECENT_TOOLS_STORAGE_KEY = 'orbileads-recent-tools'
const STORE_EVENT = 'orbileads-product-data-change'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback
  }
  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(STORE_EVENT))
}

export function readRuns() {
  return readValue<RunRecord[]>(RUNS_STORAGE_KEY, [])
}

export function writeRuns(runs: RunRecord[]) {
  writeValue(RUNS_STORAGE_KEY, runs)
}

export function readRecentTools() {
  return readValue<RecentToolRecord[]>(RECENT_TOOLS_STORAGE_KEY, [])
}

export function writeRecentTools(items: RecentToolRecord[]) {
  writeValue(RECENT_TOOLS_STORAGE_KEY, items)
}

export function subscribeToRunStorage(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  window.addEventListener(STORE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(STORE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
