import { useEffect, useState } from 'react'
import {
  createDefaultValues,
  getActorStats,
  getAverageResults,
  getRuns,
  getRunsForTool,
  getSuggestedTools,
  recordRecentTool,
  startMockRun,
  type ToolInputValues,
} from '../lib/state/runManager'
import { readRecentTools, subscribeToRunStorage } from '../lib/state/runStorage'
import type { ToolRecord } from '../types/tool'

export function useRunManager() {
  const [, setTick] = useState(0)

  useEffect(() => subscribeToRunStorage(() => setTick((value) => value + 1)), [])

  return {
    createDefaultValues,
    getRuns,
    getRunsForTool,
    getActorStats,
    getAverageResults,
    getSuggestedTools,
    readRecentTools,
    recordRecentTool,
    startMockRun,
  }
}

export type { ToolInputValues, ToolRecord }
