export function getPlatformRoute(platformSlug: string) {
  return `/store/${platformSlug}`
}

export function getToolRoute(platformSlug: string, toolSlug: string) {
  return `/store/${platformSlug}/${toolSlug}`
}
