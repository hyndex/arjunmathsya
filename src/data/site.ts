// Site-wide facts. Edit here, not in components.
export const SITE = {
  name: 'Mathsya Connected Services',
  shortName: 'Mathsya',
  tagline: 'Intelligence inside. Value beyond.',
  location: 'Bengaluru, India',
  /** Short company description (footer, structured data). */
  description:
    'Mathsya Connected Services is developing automotive Edge AI across battery and charging intelligence, coordinated EV power hardware and vehicle software. Our direction connects module behaviour to useful vehicle decisions and evidence for engineering, quality and service.',
  /** Sitewide development-stage statement: shown once, in the investor page's status summary. Elsewhere use short stage labels. */
  stage:
    'Mathsya is developing its product architecture and planning focused proofs of concept. Capabilities, generation scopes and benefits described here are proposed unless a measured result is explicitly identified.',
  stageNote: 'Development-stage portfolio · Proposed benefits and roadmap',
  conceptNote: 'Vehicle and component visuals are schematic concept renders, not production designs or prototypes.',
  /**
   * Public business inbox. Leave empty until an approved address exists.
   * Empty = the contact page prepares, copies and downloads drafts locally and never offers to send.
   */
  contactEmail: '',
};

export type NavItem = { label: string; href: string; description?: string };

export const TECHNOLOGIES = [
  { id: 'battery', label: 'Battery & Charging AI', href: '/battery-ai', description: 'Embedded module intelligence alongside the validated BMS' },
  { id: 'pmg', label: 'Proactive Mobility Guardian', href: '/pmg', description: 'Vehicle software with optional OEM & fleet services' },
  { id: 'evo', label: 'Evo Core', href: '/evo-core', description: 'EV power hardware & embedded software, Gen 1–3 roadmap' },
] as const;

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Platform', href: '/platform' },
  // "Technologies" dropdown is rendered between Platform and Explorer
  { label: 'Vehicle Explorer', href: '/explore' },
  { label: 'Research', href: '/research' },
  { label: 'Investors', href: '/investors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** Enquiry categories. `aliases` keep legacy ?topic= links from the previous site working. */
export const TOPICS = [
  { id: 'oem-pilot', label: 'OEM pilot discussion', aliases: ['Portfolio / integration'] },
  { id: 'battery', label: 'Battery / BMS integration', aliases: ['Battery & Charging AI'] },
  { id: 'evo', label: 'Evo Core hardware collaboration', aliases: ['Evo Core collaboration'] },
  { id: 'pmg', label: 'PMG software pilot', aliases: ['PMG pilot'] },
  { id: 'research', label: 'Research & engineering programs', aliases: ['Engineering tools'] },
  { id: 'partnership', label: 'Strategic partnership', aliases: ['General partnership'] },
  { id: 'investor', label: 'Investor enquiry', aliases: ['Investment discussion'] },
  { id: 'general', label: 'General business discussion', aliases: [] },
] as const;

export type TopicId = (typeof TOPICS)[number]['id'];
export const contactHref = (topic: TopicId) => `/contact?topic=${topic}`;

/** Public, indexable routes (sitemap + internal link checks). */
export const ROUTES = [
  '/',
  '/explore',
  '/platform',
  '/battery-ai',
  '/pmg',
  '/evo-core',
  '/research',
  '/investors',
  '/investors/brief',
  '/about',
  '/contact',
  '/privacy',
];
