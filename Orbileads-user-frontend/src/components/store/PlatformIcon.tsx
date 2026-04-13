import type { IconKey } from '../../lib/storeData'

type PlatformIconProps = {
  iconKey: IconKey
  className?: string
}

function PlatformIcon({ iconKey, className = 'h-5 w-5' }: PlatformIconProps) {
  if (iconKey === 'google-maps') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
        <path
          d="M10 17s4.25-4.6 4.25-8.2A4.25 4.25 0 1 0 5.75 8.8C5.75 12.4 10 17 10 17Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="10" cy="8.5" r="1.7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  if (iconKey === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
        <path
          d="M4.5 7.2h3v8.3h-3zM6 4.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM9.4 7.2h2.9v1.2c.5-.9 1.6-1.5 3-1.5 2.2 0 3.2 1.4 3.2 4v4.6h-3V11c0-1.1-.4-1.8-1.5-1.8-1 0-1.6.7-1.6 1.8v4.5h-3z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    )
  }

  if (iconKey === 'instagram') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
        <rect x="4" y="4" width="12" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13.6" cy="6.4" r=".8" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <path
        d="M16 6.4c0-1-.8-1.8-1.8-1.8H5.8C4.8 4.6 4 5.4 4 6.4v7.2c0 1 .8 1.8 1.8 1.8h8.4c1 0 1.8-.8 1.8-1.8V6.4ZM8.4 7.7l4.5 2.3-4.5 2.3V7.7Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default PlatformIcon
