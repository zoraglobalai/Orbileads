export type PlatformCategory = 'Local Business' | 'Video' | 'Professional' | 'Social Media'

export type PlatformIconKey = 'google-maps' | 'youtube' | 'linkedin' | 'instagram'

export type PlatformRecord = {
  id: string
  slug: string
  name: string
  category: PlatformCategory
  iconKey: PlatformIconKey
  description: string
  longDescription: string
  pageTitle: string
  pageSubtitle: string
  pageIntro: string
  recommendedDescription?: string
}
