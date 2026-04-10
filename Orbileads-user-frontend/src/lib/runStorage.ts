import type { StorePlatform, StoreTool } from './storeData'
import type { ToolFormValues } from './toolHelpers'
import { buildTaskSummary } from './toolHelpers'

export type RunStatus = 'Queued' | 'Succeeded'

export type ToolRunRecord = {
  id: string
  toolId: string
  toolSlug: string
  toolName: string
  platformSlug: string
  platformName: string
  taskSummary: string
  inputValues: ToolFormValues
  status: RunStatus
  startedAt: string
  finishedAt: string | null
  durationSeconds: number | null
  resultCount: number
  usageCost: number
}

export type ToolViewRecord = {
  toolId: string
  toolSlug: string
  toolName: string
  platformSlug: string
  platformName: string
  viewedAt: string
}

type ToolUsageStats = {
  totalRuns: number
  lastRunStarted: string | null
  lastRunStatus: RunStatus | null
  lastRunDuration: number | null
}

const RUNS_STORAGE_KEY = 'orbileads-mock-runs'
const RECENT_TOOLS_STORAGE_KEY = 'orbileads-mock-recent-tools'
const PRODUCT_DATA_EVENT = 'orbileads-product-data-change'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStorageValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback
  }

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

function writeStorageValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(PRODUCT_DATA_EVENT))
}

export function subscribeToProductData(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  window.addEventListener(PRODUCT_DATA_EVENT, callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener(PRODUCT_DATA_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function readToolRuns() {
  const runs = readStorageValue<ToolRunRecord[]>(RUNS_STORAGE_KEY, [])
  return runs.sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime())
}

export function readRecentTools() {
  return readStorageValue<ToolViewRecord[]>(RECENT_TOOLS_STORAGE_KEY, [])
}

export function recordToolView(tool: StoreTool) {
  const current = readRecentTools()
  const viewedAt = new Date().toISOString()

  const nextTools = [
    {
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      platformSlug: tool.platformSlug,
      platformName: tool.platformName,
      viewedAt,
    },
    ...current.filter((item) => item.toolId !== tool.id),
  ].slice(0, 8)

  writeStorageValue(RECENT_TOOLS_STORAGE_KEY, nextTools)
}

export function startToolRun(tool: StoreTool, platform: StorePlatform, inputValues: ToolFormValues) {
  const status: RunStatus = Math.random() > 0.35 ? 'Succeeded' : 'Queued'
  const startedAt = new Date().toISOString()
  const durationSeconds = status === 'Succeeded' ? 18 + Math.floor(Math.random() * 165) : null
  const finishedAt =
    status === 'Succeeded' && durationSeconds !== null
      ? new Date(Date.now() + durationSeconds * 1000).toISOString()
      : null
  const resultCount = 20 + Math.floor(Math.random() * 180)
  const usageCost = Number((0.18 + Math.random() * 1.92).toFixed(2))

  const newRun: ToolRunRecord = {
    id: `run-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    toolId: tool.id,
    toolSlug: tool.slug,
    toolName: tool.name,
    platformSlug: platform.slug,
    platformName: platform.name,
    taskSummary: buildTaskSummary(tool, inputValues),
    inputValues,
    status,
    startedAt,
    finishedAt,
    durationSeconds,
    resultCount,
    usageCost,
  }

  const currentRuns = readToolRuns()
  writeStorageValue(RUNS_STORAGE_KEY, [newRun, ...currentRuns])
  recordToolView(tool)

  return newRun
}

export function getToolUsageStats(toolId: string): ToolUsageStats {
  const toolRuns = readToolRuns().filter((run) => run.toolId === toolId)

  if (toolRuns.length === 0) {
    return {
      totalRuns: 0,
      lastRunStarted: null,
      lastRunStatus: null,
      lastRunDuration: null,
    }
  }

  return {
    totalRuns: toolRuns.length,
    lastRunStarted: toolRuns[0].startedAt,
    lastRunStatus: toolRuns[0].status,
    lastRunDuration: toolRuns[0].durationSeconds,
  }
}

export function getRecentRuns(limit = 5) {
  return readToolRuns().slice(0, limit)
}
