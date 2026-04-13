export type RunStatus = 'Running' | 'Succeeded'

export type RunRecord = {
  id: string
  toolId: string
  toolSlug: string
  toolName: string
  platformSlug: string
  platformName: string
  taskSummary: string
  inputs: Record<string, string | number | boolean>
  status: RunStatus
  startedAt: string
  finishedAt: string | null
  durationSeconds: number | null
  resultCount: number
  mockCost: number
}
