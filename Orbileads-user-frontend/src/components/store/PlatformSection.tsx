import PlatformCard from './PlatformCard'
import type { PlatformRecord } from '../../types/platform'

type PlatformSectionProps = {
  platforms: Array<{
    platform: PlatformRecord
    toolNames: string[]
  }>
  onExplore: (platformSlug: string) => void
}

function PlatformSection({ platforms, onExplore }: PlatformSectionProps) {
  return (
    <section>
      <div>
        <h2 className="text-[30px] font-semibold tracking-tight text-slate-950">Platforms</h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Select a lead source to explore the tools available for that channel.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {platforms.map(({ platform, toolNames }) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            toolNames={toolNames}
            onExplore={() => onExplore(platform.slug)}
          />
        ))}
      </div>
    </section>
  )
}

export default PlatformSection
