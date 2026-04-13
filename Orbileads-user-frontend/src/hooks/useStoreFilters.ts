import { useMemo, useState } from 'react'
import type { PlatformRecord } from '../types/platform'
import type { ToolRecord } from '../types/tool'

type FilterCategory = 'All' | PlatformRecord['category']

export function useStoreFilters(platforms: PlatformRecord[], tools: ToolRecord[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All')

  const filteredPlatforms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return platforms.filter((platform) => {
      const matchesFilter = activeFilter === 'All' || platform.category === activeFilter
      if (!matchesFilter) {
        return false
      }

      if (!query) {
        return true
      }

      const toolNames = tools
        .filter((tool) => tool.platformSlug === platform.slug)
        .map((tool) => tool.name)
        .join(' ')

      return [platform.name, platform.category, platform.description, toolNames]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [activeFilter, platforms, searchTerm, tools])

  return {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filteredPlatforms,
    clearFilters() {
      setSearchTerm('')
      setActiveFilter('All')
    },
  }
}
