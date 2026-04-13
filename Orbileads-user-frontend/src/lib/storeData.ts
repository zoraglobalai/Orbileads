export type StoreCategory = 'Local Business' | 'Professional' | 'Social Media' | 'Video'

export type IconKey = 'google-maps' | 'linkedin' | 'instagram' | 'youtube'

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox'

export type ToolFieldOption = {
  label: string
  value: string
}

export type ToolField = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  min?: number
  step?: number
  options?: ToolFieldOption[]
  defaultValue?: string | number | boolean
  helpText?: string
}

export type ToolFormSection = {
  id: string
  title: string
  description?: string
  collapsible?: boolean
  fields: ToolField[]
}

export type StorePlatform = {
  id: string
  slug: string
  name: string
  category: StoreCategory
  description: string
  longDescription: string
  metadata: {
    toolCount: string
    status: string
  }
  iconKey: IconKey
  toolSlugs: [string, string]
}

export type StoreTool = {
  id: string
  slug: string
  platformSlug: string
  platformName: string
  category: StoreCategory
  iconKey: IconKey
  name: string
  shortDescription: string
  detailDescription: string
  outputExample: string
  typeLabel: string
  statusLabel: string
  resultLabel: string
  formSections: ToolFormSection[]
}

const languageOptions: ToolFieldOption[] = [
  { label: 'English', value: 'English' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Spanish', value: 'Spanish' },
]

const limitOptions: ToolFieldOption[] = [
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '250', value: '250' },
]

const sortOptions: ToolFieldOption[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Most viewed', value: 'most_viewed' },
  { label: 'Newest', value: 'newest' },
]

export const storePlatforms: StorePlatform[] = [
  {
    id: 'platform-google-maps',
    slug: 'google-maps',
    name: 'Google Maps',
    category: 'Local Business',
    description: 'Find local business leads by keyword, category, and location.',
    longDescription:
      'Explore local business discovery tools built for geographic prospecting, category research, and contact collection from Google Maps.',
    metadata: {
      toolCount: '2 tools',
      status: 'Ready to use',
    },
    iconKey: 'google-maps',
    toolSlugs: ['business-scraper', 'contact-extractor'],
  },
  {
    id: 'platform-linkedin',
    slug: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional',
    description: 'Discover professional leads by company, title, and industry.',
    longDescription:
      'Use professional lead discovery tools to find decision-makers, teams, and candidate profiles by company, function, and market.',
    metadata: {
      toolCount: '2 tools',
      status: 'Ready to use',
    },
    iconKey: 'linkedin',
    toolSlugs: ['company-employee-scraper', 'profile-search'],
  },
  {
    id: 'platform-instagram',
    slug: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    description: 'Find creator and business leads from profiles and audience engagement.',
    longDescription:
      'Research Instagram creators, businesses, and audience conversations through focused lead discovery tools built for social prospecting.',
    metadata: {
      toolCount: '2 tools',
      status: 'Ready to use',
    },
    iconKey: 'instagram',
    toolSlugs: ['profile-scraper', 'comment-extractor'],
  },
  {
    id: 'platform-youtube',
    slug: 'youtube',
    name: 'YouTube',
    category: 'Video',
    description: 'Explore channels and creators through keyword and content-based discovery.',
    longDescription:
      'Find channel and video-led opportunities with tools that surface creators, topics, and high-intent content discovery signals.',
    metadata: {
      toolCount: '2 tools',
      status: 'Ready to use',
    },
    iconKey: 'youtube',
    toolSlugs: ['channel-scraper', 'video-keyword-scraper'],
  },
]

export const storeTools: StoreTool[] = [
  {
    id: 'tool-business-scraper',
    slug: 'business-scraper',
    platformSlug: 'google-maps',
    platformName: 'Google Maps',
    category: 'Local Business',
    iconKey: 'google-maps',
    name: 'Business Scraper',
    shortDescription: 'Extract local business listings by keyword, location, and category.',
    detailDescription:
      'Build a lead list of local businesses from Google Maps using search terms, geography, and operating signals tailored for local prospecting.',
    outputExample: 'Business name, address, phone, website, rating, reviews, and listing URL.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'places',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Define the search you want to run against local business listings.',
        fields: [
          {
            name: 'searchTerms',
            label: 'Search term(s)',
            type: 'textarea',
            placeholder: 'Dentists, roofing companies, real estate agencies',
            required: true,
            helpText: 'Separate multiple searches with commas or line breaks.',
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Mumbai, India',
            required: true,
          },
          {
            name: 'placeLimit',
            label: 'Number of places to extract',
            type: 'number',
            min: 1,
            defaultValue: 50,
            required: true,
          },
          {
            name: 'language',
            label: 'Language',
            type: 'select',
            options: languageOptions,
            defaultValue: 'English',
            required: true,
          },
        ],
      },
      {
        id: 'filters',
        title: 'Search filters & categories',
        collapsible: true,
        fields: [
          {
            name: 'businessCategory',
            label: 'Business category',
            type: 'text',
            placeholder: 'Dental clinic',
          },
          {
            name: 'minimumRating',
            label: 'Minimum rating',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: '3+', value: '3' },
              { label: '4+', value: '4' },
              { label: '4.5+', value: '4.5' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'details',
        title: 'Additional place details',
        collapsible: true,
        fields: [
          {
            name: 'includeHours',
            label: 'Include opening hours',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'includeCoordinates',
            label: 'Include coordinates',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'reviews',
        title: 'Reviews',
        collapsible: true,
        fields: [
          {
            name: 'includeReviews',
            label: 'Include reviews',
            type: 'checkbox',
            defaultValue: false,
          },
          {
            name: 'reviewLimit',
            label: 'Review limit',
            type: 'number',
            min: 0,
            defaultValue: 25,
          },
        ],
      },
      {
        id: 'images',
        title: 'Images',
        collapsible: true,
        fields: [
          {
            name: 'includeImages',
            label: 'Include listing images',
            type: 'checkbox',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'run-options',
        title: 'Run options',
        collapsible: true,
        fields: [
          {
            name: 'deduplicateResults',
            label: 'Deduplicate results',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  {
    id: 'tool-contact-extractor',
    slug: 'contact-extractor',
    platformSlug: 'google-maps',
    platformName: 'Google Maps',
    category: 'Local Business',
    iconKey: 'google-maps',
    name: 'Contact Extractor',
    shortDescription: 'Capture business contacts and website-linked information from local listings.',
    detailDescription:
      'Collect local business contact records with website-linked enrichment and contact-ready details for local lead generation workflows.',
    outputExample: 'Business name, phone number, website, email signals, and city-level contact details.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'contacts',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Configure the business contact extraction query.',
        fields: [
          {
            name: 'businessCategory',
            label: 'Business category',
            type: 'text',
            placeholder: 'Restaurants',
            required: true,
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Delhi, India',
            required: true,
          },
          {
            name: 'businessLimit',
            label: 'Number of businesses',
            type: 'number',
            min: 1,
            defaultValue: 40,
            required: true,
          },
          {
            name: 'includeWebsiteContacts',
            label: 'Include website contacts',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'language',
            label: 'Language',
            type: 'select',
            options: languageOptions,
            defaultValue: 'English',
            required: true,
          },
        ],
      },
      {
        id: 'enrichment',
        title: 'Contact enrichment',
        collapsible: true,
        fields: [
          {
            name: 'includeSocialProfiles',
            label: 'Include social profiles',
            type: 'checkbox',
            defaultValue: false,
          },
        ],
      },
      {
        id: 'website-extraction',
        title: 'Website extraction',
        collapsible: true,
        fields: [
          {
            name: 'crawlWebsitePages',
            label: 'Crawl website pages',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'maxWebsitePages',
            label: 'Max website pages',
            type: 'number',
            min: 1,
            defaultValue: 10,
          },
        ],
      },
      {
        id: 'filters',
        title: 'Business filters',
        collapsible: true,
        fields: [
          {
            name: 'onlyOpenNow',
            label: 'Only open now',
            type: 'checkbox',
            defaultValue: false,
          },
        ],
      },
    ],
  },
  {
    id: 'tool-company-employee-scraper',
    slug: 'company-employee-scraper',
    platformSlug: 'linkedin',
    platformName: 'LinkedIn',
    category: 'Professional',
    iconKey: 'linkedin',
    name: 'Company Employee Scraper',
    shortDescription: 'Find employees inside target companies using title and location filters.',
    detailDescription:
      'Map teams, functions, and decision-makers inside a target company with filters for role, geography, and department-level prospecting.',
    outputExample: 'Employee name, title, company, location, profile link, and headline.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'profiles',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Define the company employee audience you want to collect.',
        fields: [
          {
            name: 'companyName',
            label: 'Company name',
            type: 'text',
            placeholder: 'HubSpot',
            required: true,
          },
          {
            name: 'jobTitleFilter',
            label: 'Job title filter',
            type: 'text',
            placeholder: 'Marketing Manager',
            required: true,
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'United States',
            required: true,
          },
          {
            name: 'resultLimit',
            label: 'Result limit',
            type: 'select',
            options: limitOptions,
            defaultValue: '50',
            required: true,
          },
        ],
      },
      {
        id: 'seniority',
        title: 'Seniority filters',
        collapsible: true,
        fields: [
          {
            name: 'seniority',
            label: 'Seniority',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: 'Manager+', value: 'manager_plus' },
              { label: 'Director+', value: 'director_plus' },
              { label: 'C-level', value: 'c_level' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'department',
        title: 'Department filters',
        collapsible: true,
        fields: [
          {
            name: 'department',
            label: 'Department',
            type: 'text',
            placeholder: 'Sales',
          },
        ],
      },
      {
        id: 'export',
        title: 'Export options',
        collapsible: true,
        fields: [
          {
            name: 'includeProfileUrls',
            label: 'Include profile URLs',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  {
    id: 'tool-profile-search',
    slug: 'profile-search',
    platformSlug: 'linkedin',
    platformName: 'LinkedIn',
    category: 'Professional',
    iconKey: 'linkedin',
    name: 'Profile Search',
    shortDescription: 'Search professional profiles by role, industry, and region.',
    detailDescription:
      'Discover professionals across functions and industries using title-driven search criteria tuned for B2B prospecting workflows.',
    outputExample: 'Profile name, current role, company, location, industry, and profile link.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'profiles',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Set the profile audience you want to discover.',
        fields: [
          {
            name: 'role',
            label: 'Role / title',
            type: 'text',
            placeholder: 'Founder',
            required: true,
          },
          {
            name: 'industry',
            label: 'Industry',
            type: 'text',
            placeholder: 'SaaS',
            required: true,
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Bengaluru',
            required: true,
          },
          {
            name: 'resultLimit',
            label: 'Result limit',
            type: 'select',
            options: limitOptions,
            defaultValue: '50',
            required: true,
          },
        ],
      },
      {
        id: 'keywords',
        title: 'Keywords',
        collapsible: true,
        fields: [
          {
            name: 'keywords',
            label: 'Keyword include list',
            type: 'text',
            placeholder: 'demand generation, pipeline',
          },
        ],
      },
      {
        id: 'company-size',
        title: 'Company size',
        collapsible: true,
        fields: [
          {
            name: 'companySize',
            label: 'Company size',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: '1-10', value: '1_10' },
              { label: '11-50', value: '11_50' },
              { label: '51-200', value: '51_200' },
              { label: '200+', value: '200_plus' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'experience',
        title: 'Experience level',
        collapsible: true,
        fields: [
          {
            name: 'experienceLevel',
            label: 'Experience level',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: 'Mid', value: 'mid' },
              { label: 'Senior', value: 'senior' },
              { label: 'Executive', value: 'executive' },
            ],
            defaultValue: 'any',
          },
        ],
      },
    ],
  },
  {
    id: 'tool-profile-scraper',
    slug: 'profile-scraper',
    platformSlug: 'instagram',
    platformName: 'Instagram',
    category: 'Social Media',
    iconKey: 'instagram',
    name: 'Profile Scraper',
    shortDescription: 'Collect creator and business profiles by username, niche, and location.',
    detailDescription:
      'Find Instagram creators and businesses using niche-led discovery, account filters, and audience-fit signals designed for lead generation.',
    outputExample: 'Handle, bio, followers, category, external links, and contact indicators.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'profiles',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Target a niche, audience segment, or specific profile source.',
        fields: [
          {
            name: 'usernameOrKeyword',
            label: 'Username or niche keyword',
            type: 'text',
            placeholder: 'Fitness coach',
            required: true,
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Dubai',
            required: true,
          },
          {
            name: 'resultLimit',
            label: 'Result limit',
            type: 'select',
            options: limitOptions,
            defaultValue: '50',
            required: true,
          },
          {
            name: 'includeEmail',
            label: 'Include email if available',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'followers',
        title: 'Follower range',
        collapsible: true,
        fields: [
          {
            name: 'followerRange',
            label: 'Follower range',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: '1k - 10k', value: '1k_10k' },
              { label: '10k - 100k', value: '10k_100k' },
              { label: '100k+', value: '100k_plus' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'engagement',
        title: 'Engagement filter',
        collapsible: true,
        fields: [
          {
            name: 'minimumEngagement',
            label: 'Minimum engagement rate',
            type: 'text',
            placeholder: '3%',
          },
        ],
      },
      {
        id: 'profile-options',
        title: 'Profile data options',
        collapsible: true,
        fields: [
          {
            name: 'includeBusinessCategory',
            label: 'Include business category',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  {
    id: 'tool-comment-extractor',
    slug: 'comment-extractor',
    platformSlug: 'instagram',
    platformName: 'Instagram',
    category: 'Social Media',
    iconKey: 'instagram',
    name: 'Comment Extractor',
    shortDescription: 'Extract audience comments and usernames from posts or keyword-led discovery.',
    detailDescription:
      'Capture comment-level audience signals, handles, and conversation filters to identify engaged prospects from Instagram content.',
    outputExample: 'Comment text, username, post link, engagement markers, and filtered keyword matches.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'comments',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Choose the post source or keyword-led discovery input.',
        fields: [
          {
            name: 'postSource',
            label: 'Post URL or keyword',
            type: 'text',
            placeholder: 'https://instagram.com/p/... or fitness tips',
            required: true,
          },
          {
            name: 'commentCount',
            label: 'Number of comments',
            type: 'number',
            min: 1,
            defaultValue: 100,
            required: true,
          },
          {
            name: 'includeUsernames',
            label: 'Include usernames',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'keywords',
        title: 'Comment keyword filter',
        collapsible: true,
        fields: [
          {
            name: 'commentKeyword',
            label: 'Comment keyword',
            type: 'text',
            placeholder: 'interested',
          },
        ],
      },
      {
        id: 'language',
        title: 'Language',
        collapsible: true,
        fields: [
          {
            name: 'language',
            label: 'Language',
            type: 'select',
            options: languageOptions,
            defaultValue: 'English',
          },
        ],
      },
      {
        id: 'deduplication',
        title: 'Deduplication',
        collapsible: true,
        fields: [
          {
            name: 'deduplicateComments',
            label: 'Deduplicate comments',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  {
    id: 'tool-channel-scraper',
    slug: 'channel-scraper',
    platformSlug: 'youtube',
    platformName: 'YouTube',
    category: 'Video',
    iconKey: 'youtube',
    name: 'Channel Scraper',
    shortDescription: 'Discover channels by topic, region, and content filters.',
    detailDescription:
      'Search for channels and creators using niche keywords, regional filters, and content qualifiers built for creator and business lead research.',
    outputExample: 'Channel name, URL, subscribers, region, category, and latest content signals.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'channels',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Search for channels by theme, region, and result volume.',
        fields: [
          {
            name: 'channelKeyword',
            label: 'Channel keyword',
            type: 'text',
            placeholder: 'Real estate investing',
            required: true,
          },
          {
            name: 'region',
            label: 'Country / region',
            type: 'text',
            placeholder: 'United States',
            required: true,
          },
          {
            name: 'resultLimit',
            label: 'Result limit',
            type: 'select',
            options: limitOptions,
            defaultValue: '50',
            required: true,
          },
          {
            name: 'includeChannelLinks',
            label: 'Include channel links',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
      {
        id: 'subscriber-filter',
        title: 'Subscriber filter',
        collapsible: true,
        fields: [
          {
            name: 'subscriberFilter',
            label: 'Subscriber filter',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: '1k+', value: '1k_plus' },
              { label: '10k+', value: '10k_plus' },
              { label: '100k+', value: '100k_plus' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'category-filter',
        title: 'Category filter',
        collapsible: true,
        fields: [
          {
            name: 'channelCategory',
            label: 'Category filter',
            type: 'text',
            placeholder: 'Education',
          },
        ],
      },
      {
        id: 'content-type',
        title: 'Content type',
        collapsible: true,
        fields: [
          {
            name: 'contentType',
            label: 'Content type',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: 'Short-form', value: 'shorts' },
              { label: 'Long-form', value: 'long_form' },
            ],
            defaultValue: 'any',
          },
        ],
      },
    ],
  },
  {
    id: 'tool-video-keyword-scraper',
    slug: 'video-keyword-scraper',
    platformSlug: 'youtube',
    platformName: 'YouTube',
    category: 'Video',
    iconKey: 'youtube',
    name: 'Video / Keyword Scraper',
    shortDescription: 'Find videos and creator opportunities by keyword, region, and sort order.',
    detailDescription:
      'Explore video-led discovery with keyword, region, sorting, and content freshness filters tuned for creator and market prospecting.',
    outputExample: 'Video title, channel name, views, upload date, and creator profile link.',
    typeLabel: 'Lead Tool',
    statusLabel: 'Ready',
    resultLabel: 'videos',
    formSections: [
      {
        id: 'overview',
        title: 'Overview',
        description: 'Set the keyword and result scope for video-led discovery.',
        fields: [
          {
            name: 'keyword',
            label: 'Keyword',
            type: 'text',
            placeholder: 'SaaS product demos',
            required: true,
          },
          {
            name: 'region',
            label: 'Region',
            type: 'text',
            placeholder: 'Global',
            required: true,
          },
          {
            name: 'videoLimit',
            label: 'Number of videos/channels',
            type: 'select',
            options: limitOptions,
            defaultValue: '50',
            required: true,
          },
          {
            name: 'sortBy',
            label: 'Sort by',
            type: 'select',
            options: sortOptions,
            defaultValue: 'relevance',
            required: true,
          },
        ],
      },
      {
        id: 'duration',
        title: 'Duration filter',
        collapsible: true,
        fields: [
          {
            name: 'duration',
            label: 'Duration filter',
            type: 'select',
            options: [
              { label: 'Any', value: 'any' },
              { label: 'Under 4 minutes', value: 'short' },
              { label: '4-20 minutes', value: 'medium' },
              { label: '20+ minutes', value: 'long' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'upload-date',
        title: 'Upload date',
        collapsible: true,
        fields: [
          {
            name: 'uploadDate',
            label: 'Upload date',
            type: 'select',
            options: [
              { label: 'Any time', value: 'any' },
              { label: 'Past week', value: 'week' },
              { label: 'Past month', value: 'month' },
              { label: 'Past year', value: 'year' },
            ],
            defaultValue: 'any',
          },
        ],
      },
      {
        id: 'creator-links',
        title: 'Creator links',
        collapsible: true,
        fields: [
          {
            name: 'includeCreatorLinks',
            label: 'Include creator links',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
    ],
  },
]

export const storeFilterChips: Array<'All' | StoreCategory> = [
  'All',
  'Local Business',
  'Professional',
  'Social Media',
  'Video',
]
