import type { PlatformRecord } from '../../types/platform'

export const platforms: PlatformRecord[] = [
  {
    id: 'platform-google-maps',
    slug: 'google-maps',
    name: 'Google Maps',
    category: 'Local Business',
    iconKey: 'google-maps',
    description: 'Find local business leads by keyword, category, and location.',
    longDescription:
      'Use Google Maps tools to identify businesses by category, city, or region and collect structured records for sales research, outreach, and market discovery.',
    pageTitle: 'Google Maps Tools',
    pageSubtitle:
      'Extract local business data, business listings, and contact-ready leads using location-based search tools.',
    pageIntro:
      'Use Google Maps tools to identify businesses by category, city, or region and collect structured records for sales research, outreach, and market discovery.',
    recommendedDescription: 'Best for local business discovery and contact collection.',
  },
  {
    id: 'platform-youtube',
    slug: 'youtube',
    name: 'YouTube',
    category: 'Video',
    iconKey: 'youtube',
    description: 'Explore videos, channels, and creators through keyword-driven discovery.',
    longDescription:
      'Use YouTube tools to explore creator ecosystems, identify channels in a niche, and collect content-level discovery data for partnerships, marketing, and research.',
    pageTitle: 'YouTube Tools',
    pageSubtitle:
      'Discover creators, videos, and channels through keyword and content-based search workflows.',
    pageIntro:
      'Use YouTube tools to explore creator ecosystems, identify channels in a niche, and collect content-level discovery data for partnerships, marketing, and research.',
  },
  {
    id: 'platform-linkedin',
    slug: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional',
    iconKey: 'linkedin',
    description: 'Discover professionals, teams, and decision-makers by company, role, and industry.',
    longDescription:
      'Use LinkedIn tools to discover people by company, role, industry, and profile URL for prospecting, hiring research, and outreach preparation.',
    pageTitle: 'LinkedIn Tools',
    pageSubtitle:
      'Research professionals, companies, and decision-makers through profile and employee-focused tools.',
    pageIntro:
      'Use LinkedIn tools to discover people by company, role, industry, and profile URL for prospecting, hiring research, and outreach preparation.',
    recommendedDescription: 'Best for B2B prospecting and decision-maker research.',
  },
  {
    id: 'platform-instagram',
    slug: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    iconKey: 'instagram',
    description: 'Identify creators, brands, and engagement opportunities through profile and audience data.',
    longDescription:
      'Use Instagram tools to discover profile-level insights, identify creators, and explore audience activity from posts, profiles, and comments.',
    pageTitle: 'Instagram Tools',
    pageSubtitle:
      'Find creators, profiles, pages, and audience engagement signals using Instagram scraping workflows.',
    pageIntro:
      'Use Instagram tools to discover profile-level insights, identify creators, and explore audience activity from posts, profiles, and comments.',
  },
]
