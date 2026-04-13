import { storePlatforms, storeTools, type StorePlatform, type StoreTool } from './storeData'

export type ToolFormValues = Record<string, string | number | boolean>

export function getPlatformBySlug(platformSlug: string | undefined) {
  if (!platformSlug) {
    return null
  }

  return storePlatforms.find((platform) => platform.slug === platformSlug) ?? null
}

export function getPlatformTools(platformSlug: string | undefined) {
  if (!platformSlug) {
    return []
  }

  return storeTools.filter((tool) => tool.platformSlug === platformSlug)
}

export function getToolBySlugs(platformSlug: string | undefined, toolSlug: string | undefined) {
  if (!platformSlug || !toolSlug) {
    return null
  }

  return (
    storeTools.find((tool) => tool.platformSlug === platformSlug && tool.slug === toolSlug) ?? null
  )
}

export function getToolById(toolId: string) {
  return storeTools.find((tool) => tool.id === toolId) ?? null
}

export function getPlatformRoute(platformSlug: string) {
  return `/store/${platformSlug}`
}

export function getToolRoute(platformSlug: string, toolSlug: string) {
  return `/store/${platformSlug}/${toolSlug}`
}

export function getDefaultToolValues(tool: StoreTool): ToolFormValues {
  const values: ToolFormValues = {}

  for (const section of tool.formSections) {
    for (const field of section.fields) {
      if (field.defaultValue !== undefined) {
        values[field.name] = field.defaultValue
        continue
      }

      if (field.type === 'checkbox') {
        values[field.name] = false
        continue
      }

      values[field.name] = ''
    }
  }

  return values
}

export function formatDateTime(dateString: string | null) {
  if (!dateString) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function formatDateTimeLong(dateString: string | null) {
  if (!dateString) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function formatRelativeTime(dateString: string | null) {
  if (!dateString) {
    return 'No activity yet'
  }

  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

export function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return '-'
  }

  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function buildTaskSummary(tool: StoreTool, values: ToolFormValues) {
  const primaryFields = tool.formSections[0]?.fields.slice(0, 2) ?? []
  const parts = primaryFields
    .map((field) => values[field.name])
    .filter((value) => value !== '' && value !== false && value !== undefined)
    .map((value) => String(value))

  if (parts.length === 0) {
    return `Run ${tool.name}`
  }

  return parts.join(' • ')
}

export function getSuggestedPlatforms() {
  return storePlatforms.slice(0, 4)
}

export function getToolPreviewTools(platform: StorePlatform) {
  return platform.toolSlugs
    .map((toolSlug) => getToolBySlugs(platform.slug, toolSlug))
    .filter((tool): tool is StoreTool => tool !== null)
}
