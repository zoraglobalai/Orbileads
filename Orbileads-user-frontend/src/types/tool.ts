import type { PlatformCategory, PlatformIconKey } from './platform'

export type ToolFieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date'

export type ToolFieldOption = {
  label: string
  value: string
}

export type ToolFieldRecord = {
  id: string
  name: string
  label: string
  type: ToolFieldType
  placeholder?: string
  required?: boolean
  defaultValue?: string | number | boolean
  options?: ToolFieldOption[]
  min?: number
  step?: number
  multipleRows?: boolean
  addLabel?: string
  bulkEditLabel?: string
  suffix?: string
  helperText?: string
}

export type ToolSectionRecord = {
  id: string
  title: string
  description?: string
  collapsible?: boolean
  fields?: ToolFieldRecord[]
  contentLines?: string[]
}

export type ToolTabContent = {
  overview: string
  bestUseCases: string[]
  outputFields: string[]
  exampleWorkflow: string
}

export type ToolRunOption = {
  label: string
  value: string
}

export type ToolRecord = {
  id: string
  slug: string
  platformSlug: string
  platformName: string
  platformCategory: PlatformCategory
  iconKey: PlatformIconKey
  name: string
  actorLabel: string
  storeDescription: string
  platformCardDescription: string
  platformHighlights: string[]
  toolRouteDescription: string
  toolRouteButtonLabel: string
  detailTitle: string
  slugLabel: string
  detailDescription: string
  startButtonLabel: string
  secondaryButtonLabel: string
  metadata: {
    rating: string
    favorites: string
    runs: string
    users: string
    maintainedBy?: string
    permissionsLabel?: string
  }
  introParagraphs: string[]
  infoTab: ToolTabContent
  inputSections: ToolSectionRecord[]
  runOptions: ToolRunOption[]
  footerActions: string[]
  resultRange: {
    min: number
    max: number
  }
}
