import type { RunStatus } from './run'

export type ActorRecord = {
  toolId: string
  toolName: string
  platformName: string
  totalRuns: number
  lastRunStarted: string | null
  lastRunStatus: RunStatus | null
  lastRunDuration: number | null
}
