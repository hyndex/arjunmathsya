// The three product roles. Source: legacy site (index, platform, product pages, program overviews).
export type ProductId = 'battery' | 'evo' | 'pmg';

/** Honest maturity scale. Only steps the source material supports are ever marked reached. */
export const STAGES = ['Concept', 'Proposed architecture', 'PoC planning', 'Under evaluation', 'Validated result', 'Commercially released'] as const;

export const PRODUCTS = {
  battery: {
    id: 'battery',
    name: 'Battery & Charging AI',
    short: 'Battery AI',
    role: 'Embedded Module Intelligence',
    kind: 'Embedded module software',
    level: '01 / Module intelligence',
    href: '/battery-ai',
    accent: 'var(--p-battery)',
    accentInk: 'var(--p-battery-ink)',
    tint: 'var(--p-battery-bg)',
    stage: 'Architecture & PoC planning',
    stageIndex: 2, // reached: Concept, Proposed architecture; working on PoC planning
    summary:
      'Embedded intelligence for battery health trends, charge-session behaviour, thermal context and accessible cell patterns. Designed to work alongside a validated BMS and share approved insights with the vehicle.',
    runsOn: 'Suitable BMS, module or adjacent vehicle compute',
    commercial: 'Paid integration or a scoped proof of concept, followed by embedded-runtime licensing and program support where technical value and buyer demand are established.',
    buyers: 'Battery and BMS suppliers, OEMs',
    notThis: 'Not a battery pack, and not a replacement for BMS sensing, balancing or protection.',
  },
  evo: {
    id: 'evo',
    name: 'Evo Core',
    short: 'Evo Core',
    role: 'EV Power Hardware & Embedded Software',
    kind: 'Power hardware + embedded software',
    level: '01 / Power hardware',
    href: '/evo-core',
    accent: 'var(--p-evo)',
    accentInk: 'var(--p-evo-ink)',
    tint: 'var(--p-evo-bg)',
    stage: 'Architecture & hardware planning',
    stageIndex: 1,
    summary:
      'EV power hardware and embedded software for shared control, defined power conversion and distribution functions, and supervisory intelligence. Its proposed Gen 1–3 roadmap expands only as engineering and commercial evidence supports it.',
    runsOn: 'Vehicle power-electronics location, defined by the reference program',
    commercial: 'Paid engineering, then hardware supply and program software or support.',
    buyers: 'OEMs and EV power-system partners',
    notThis: 'Not a released product. Generations are a proposed roadmap with no committed release dates.',
  },
  pmg: {
    id: 'pmg',
    name: 'Proactive Mobility Guardian',
    short: 'PMG',
    role: 'Vehicle Software & Optional Services',
    kind: 'Vehicle software + optional cloud / SaaS',
    level: '02 / Vehicle intelligence',
    href: '/pmg',
    accent: 'var(--p-pmg)',
    accentInk: 'var(--p-pmg-ink)',
    tint: 'var(--p-pmg-bg)',
    stage: 'Architecture & PoC planning',
    stageIndex: 2,
    summary:
      'Vehicle software that combines module insights with journey, customer and service context. PMG prepares permitted recommendations and checks their outcomes; optional cloud services support authorized OEM and fleet learning.',
    runsOn: 'Suitable gateway, telematics or central vehicle compute',
    commercial: 'Program integration, embedded-software licensing and support, with optional enterprise subscriptions or services where recurring organizational value is demonstrated.',
    buyers: 'OEMs, vehicle platforms and fleets',
    notThis: 'Not a hardware product, and not an unrestricted controller. Validated control and safety functions keep their authority.',
  },
} as const;

export const PRODUCT_LIST = [PRODUCTS.battery, PRODUCTS.pmg, PRODUCTS.evo];

/** What each product does and does not do. Engineering boundaries from the source FAQs and overviews. */
export const BOUNDARIES = [
  {
    product: 'battery' as ProductId,
    does: [
      'Evaluates health / state-estimation trends with confidence and data-quality checks',
      'Interprets charge-session behaviour and readiness within permitted operating limits',
      'Flags thermal and accessible cell-level patterns for review',
      'Shares approved insight with PMG and/or Evo Core',
    ],
    doesNot: [
      'Replace the BMS — sensing, balancing, operating limits and protection keep defined ownership',
      'Create independently controlled charging paths for each cell',
      'Claim battery-life or range gains — those are outcomes a pilot must measure',
    ],
  },
  {
    product: 'evo' as ProductId,
    does: [
      'Proposes OBC, DC/DC, EVCC and HV distribution functions under a common control foundation (Gen 1)',
      'Adds Edge AI supervision of module health with separate proof obligations',
      'Connects to BMS, PMG, cooling and diagnostics through defined interfaces',
    ],
    doesNot: [
      'Imply that shared control equals physical integration in one housing',
      'Assume a shared enclosure lowers cost or qualification effort',
      'Commit release dates, ratings or production specifications',
    ],
  },
  {
    product: 'pmg' as ProductId,
    does: [
      'Runs on suitable gateway, telematics or central vehicle compute',
      'Combines module events with vehicle, journey and customer context',
      'Prepares permitted recommendations and verifies the result',
      'Defines local behaviour for missing data and lost connectivity',
    ],
    doesNot: [
      'Control everything in the car — validated control and safety functions stay authoritative',
      'Require the cloud for its defined local behaviour',
      'Require replacing every module before adoption',
    ],
  },
] as const;
