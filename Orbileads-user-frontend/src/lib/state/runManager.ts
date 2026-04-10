import { tools } from '../data/tools'
import { createId } from '../utils/id'
import { readRuns, readRecentTools, writeRecentTools, writeRuns, type RecentToolRecord } from './runStorage'
import type { RunRecord } from '../../types/run'
import type { ToolRecord } from '../../types/tool'

export type ToolInputValues = Record<string, string | number | boolean>

export function createDefaultValues(tool: ToolRecord) {
  const values: ToolInputValues = {}

  for (const section of tool.inputSections) {
    for (const field of section.fields ?? []) {
      if (field.defaultValue !== undefined) {
        values[field.name] = field.defaultValue
      } else if (field.type === 'checkbox') {
        values[field.name] = false
      } else {
        values[field.name] = ''
      }
    }
  }

  return values
}

export function buildTaskSummary(tool: ToolRecord, values: ToolInputValues) {
  const mainFields = (tool.inputSections[0]?.fields ?? []).slice(0, 2)
  const parts = mainFields
    .map((field) => values[field.name])
    .filter((value) => value !== '' && value !== false && value !== undefined)
    .map((value) => String(value))

  return parts.length > 0 ? parts.join(' | ') : `Run ${tool.name}`
}

export function recordRecentTool(tool: ToolRecord) {
  const entry: RecentToolRecord = {
    toolId: tool.id,
    toolSlug: tool.slug,
    toolName: tool.name,
    platformSlug: tool.platformSlug,
    platformName: tool.platformName,
    viewedAt: new Date().toISOString(),
  }

  const existing = readRecentTools().filter((item) => item.toolId !== tool.id)
  writeRecentTools([entry, ...existing].slice(0, 8))
}

function updateRun(nextRun: RunRecord) {
  const runs = readRuns()
  const updated = runs.map((run) => (run.id === nextRun.id ? nextRun : run))
  writeRuns(updated)
}

export function startMockRun(tool: ToolRecord, values: ToolInputValues) {
  const now = new Date().toISOString()
  const run: RunRecord = {
    id: createId('run'),
    toolId: tool.id,
    toolSlug: tool.slug,
    toolName: tool.name,
    platformSlug: tool.platformSlug,
    platformName: tool.platformName,
    taskSummary: buildTaskSummary(tool, values),
    inputs: values,
    status: 'Running',
    startedAt: now,
    finishedAt: null,
    durationSeconds: null,
    resultCount: 0,
    mockCost: 0,
  }

  writeRuns([run, ...readRuns()])
  recordRecentTool(tool)

  const durationSeconds = 2 + Math.floor(Math.random() * 2)
  const resultCount =
    tool.resultRange.min +
    Math.floor(Math.random() * (tool.resultRange.max - tool.resultRange.min + 1))
  const cost = Number((0.22 + Math.random() * 1.48).toFixed(2))

  if (typeof window !== 'undefined') {
    window.setTimeout(() => {
      updateRun({
        ...run,
        status: 'Succeeded',
        finishedAt: new Date().toISOString(),
        durationSeconds,
        resultCount,
        mockCost: cost,
      })
    }, durationSeconds * 1000)
  }

  return run
}

export function getRuns() {
  return [...readRuns()].sort(
    (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
  )
}

export function getRunsForTool(toolId: string) {
  return getRuns().filter((run) => run.toolId === toolId)
}

export function getActorStats(toolId: string) {
  const toolRuns = getRunsForTool(toolId)
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

export function getAverageResults() {
  const completed = getRuns().filter((run) => run.status === 'Succeeded')
  if (completed.length === 0) {
    return 0
  }
  const sum = completed.reduce((total, run) => total + run.resultCount, 0)
  return Math.round(sum / completed.length)
}

export function getSuggestedTools() {
  return tools.slice(0, 4)
}
