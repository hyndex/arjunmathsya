// /platform copy. Sources: docs/editing-pack-2026-10-20.md (section 03) and docs/legacy-source/platform.txt (+ battery-ai.txt,
// evo-core.txt, pmg.txt where a relationship is described there). Shared facts (PRODUCTS, BENEFITS, BOUNDARIES) are imported.
import { BOUNDARIES, PRODUCTS, type ProductId } from '@/data/products';

const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
/** First 'does not' boundary of a product, as a sentence (single source: BOUNDARIES). */
const doesNot = (id: ProductId) => `Does not ${lcFirst(BOUNDARIES.find((b) => b.product === id)!.doesNot[0])}.`;

export const PLATFORM_META = {
  title: 'The connected technology platform',
  description:
    'How Battery & Charging AI, Evo Core and PMG connect: module intelligence, vehicle software and optional OEM and fleet learning, through approved interfaces.',
};

export const PLATFORM_HERO = {
  eyebrow: 'The Mathsya platform / three levels of value',
  title: ['Local intelligence.', 'Connected outcomes.'],
  lead: 'Mathsya’s portfolio connects three levels of value. Module intelligence interprets behaviour. Vehicle software adds operating and customer context. Authorized organizational services help engineering and service teams learn from verified outcomes.',
  stage: 'Architecture and PoC planning · development-stage program',
};

/** The three levels in words. Product names are linked to their pages where they appear. */
export const LEVELS = [
  {
    n: '01',
    title: 'Module intelligence',
    body: 'Battery & Charging AI evaluates battery behaviour on suitable BMS or adjacent compute. Evo Core combines defined EV power functions with common control and supervisory insight. Other modules can contribute approved events and operating information.',
  },
  {
    n: '02',
    title: 'Vehicle intelligence',
    body: 'PMG combines selected module insights with vehicle, journey and customer context. It prepares reviewable recommendations, requests only permitted actions and checks the result.',
  },
  {
    n: '03',
    title: 'Organizational learning',
    note: 'Optional',
    body: 'Optional OEM and fleet services can compare authorized evidence across vehicles and versions, support investigations and track whether a correction reduced the repeat issue.',
  },
] as const;

export const ARCH_NOTES = {
  adoption:
    'A partner can start with one product and one application. The connected portfolio is an expansion path; it does not require replacing every vehicle module or adopting all products together.',
  boundary:
    'Real-time control, protection and permitted actuator authority remain defined by the validated vehicle architecture. Model output is a reviewable input to an approved decision process.',
};

/* ---------- Signature: 3-level architecture ---------- */

export type ArchSelection = 'all' | 'battery' | 'evo' | 'pmg' | 'cloud';

export const ARCH_LEVELS = [
  { n: '01', title: 'Module intelligence & power hardware' },
  { n: '02', title: 'Vehicle intelligence' },
  { n: '03', title: 'Organizational learning', note: 'Optional' },
] as const;

export const ARCH_NODES = {
  battery: { level: '01 / Module intelligence', name: 'Battery & Charging AI', role: 'Health, charge readiness and thermal context', kind: 'Software / embedded AI' },
  evo: { level: '01 / Power hardware', name: 'Evo Core', role: 'Integrated control, power conversion and supervision', kind: 'Hardware + embedded software' },
  other: { level: '01 / Other vehicle modules', name: 'Approved interfaces', role: 'Thermal, connected functions and future module AI', kind: 'Partner / future applications' },
  bms: { name: 'Validated BMS & existing control', role: 'Sensing, balancing, operating limits and protection keep defined ownership' },
  pmg: { level: '02 / Vehicle software', name: 'Proactive Mobility Guardian', role: 'Vehicle context · permitted recommendations · verified outcomes', kind: 'Vehicle software', adds: 'Adds journey, customer and service intent' },
  safety: { name: 'Validated control & safety functions', role: 'Keep their authority' },
  cloud: { level: '03 / Organizational learning', name: 'Optional OEM & fleet services', role: 'Authorized evidence · quality investigations · service learning', kind: 'Cloud / SaaS options' },
} as const;

export const ARCH_CONNECTORS = {
  batteryEvo: 'Approved battery insight',
  signals: 'Approved signals & diagnostics',
  requests: 'Permitted requests only',
  boundary: 'Vehicle boundary',
  boundaryNote: 'Local operation does not depend on the cloud',
};

export const ARCH_OPTIONS: { id: ArchSelection; label: string; color: string }[] = [
  { id: 'all', label: 'Whole platform', color: 'var(--c-ink)' },
  { id: 'battery', label: 'Battery & Charging AI', color: 'var(--p-battery)' },
  { id: 'evo', label: 'Evo Core', color: 'var(--p-evo-ink)' },
  { id: 'pmg', label: 'PMG', color: 'var(--p-pmg)' },
  { id: 'cloud', label: 'Optional cloud services', color: 'var(--c-slate)' },
];

type Link = { to: string; text: string };
export const ARCH_EXPLAIN: Record<ArchSelection, { title: string; href?: string; where: string; links: Link[]; boundary: string }> = {
  all: {
    title: 'The whole platform',
    where: 'Three products at two levels inside the vehicle, plus optional services outside it.',
    links: [
      { to: 'Module → vehicle', text: 'Battery & Charging AI, Evo Core and other approved module interfaces send health and context events to PMG through the approved vehicle network.' },
      { to: 'Module ↔ module', text: 'Battery & Charging AI can share approved insight with Evo Core.' },
      { to: 'Vehicle → control', text: 'PMG requests only permitted actions; validated control and safety functions keep their authority.' },
      { to: 'Vehicle → learning', text: 'PMG can share authorized, relevant evidence with optional OEM and fleet services.' },
    ],
    boundary: 'Module products can be evaluated independently. The cloud adds learning without becoming a prerequisite for local operation.',
  },
  battery: {
    title: 'Battery & Charging AI',
    href: '/battery-ai',
    where: 'Embedded software on suitable BMS or adjacent module compute, alongside a validated BMS.',
    links: [
      { to: 'Validated BMS', text: 'Reads permitted voltage, current, temperature and history from an agreed pack and reference system.' },
      { to: 'PMG', text: 'Provides approved health and charging-readiness insight; PMG adds departure intent and vehicle context.' },
      { to: 'Evo Core', text: 'Can share approved insight with Evo Core, which provides power and thermal coordination interfaces.' },
    ],
    boundary: `${doesNot('battery')} A first pilot can use existing module hardware.`,
  },
  evo: {
    title: 'Evo Core',
    href: '/evo-core',
    where: 'EV power hardware plus embedded software, at the vehicle power-electronics location defined by the reference program.',
    links: [
      { to: 'BMS, cooling & diagnostics', text: 'Connects through defined interfaces; validated protection and fault containment remain part of the architecture.' },
      { to: 'Battery & Charging AI', text: 'Receives approved battery insight. Sharing compute with the Battery AI runtime is a later option with its own feasibility and validation.' },
      { to: 'PMG', text: 'Its supervisory AI flags reviewable changes in power and thermal behaviour; PMG adds vehicle history and journey context.' },
    ],
    boundary: `${doesNot('evo')} Generations are a proposed roadmap with no committed release dates.`,
  },
  pmg: {
    title: 'Proactive Mobility Guardian',
    href: '/pmg',
    where: 'Vehicle software on suitable gateway, telematics or central compute.',
    links: [
      { to: 'Level 01 modules', text: 'Receives health and context events from Battery & Charging AI, Evo Core or other modules through approved interfaces, and can start with existing module data.' },
      { to: 'Validated control', text: 'Prepares permitted recommendations and action requests; validated control and safety functions keep their authority.' },
      { to: 'Optional services', text: 'Links verified outcomes to OEM and fleet services when they are used, sharing authorized, relevant evidence only.' },
    ],
    boundary: `${doesNot('pmg')} Adopting PMG does not require every module to be replaced.`,
  },
  cloud: {
    title: 'Optional OEM & fleet services',
    where: 'Off-vehicle software, used only where an OEM or fleet chooses it.',
    links: [
      { to: 'PMG', text: 'Receives authorized vehicle evidence and compares relevant events across permitted vehicles and versions.' },
      { to: 'Quality & service teams', text: 'Supports investigations and service decisions, and tracks whether a correction reduced the repeat behaviour.' },
    ],
    boundary: 'Adds learning, but is not a prerequisite for local operation. Access, consent, retention and data ownership must be agreed.',
  },
};

/** Which nodes / paths light up for each selection. Paths: battery-pmg, evo-pmg, other-pmg, pmg-cloud, battery-evo, signals, requests. */
export const ARCH_RELATIONS: Record<ArchSelection, { nodes: string[]; paths: string[] }> = {
  all: { nodes: ['battery', 'evo', 'other', 'bms', 'pmg', 'safety', 'cloud'], paths: ['battery-pmg', 'evo-pmg', 'other-pmg', 'pmg-cloud', 'battery-evo', 'signals', 'requests'] },
  battery: { nodes: ['battery', 'bms', 'pmg', 'evo'], paths: ['battery-pmg', 'battery-evo', 'signals'] },
  evo: { nodes: ['evo', 'bms', 'battery', 'pmg'], paths: ['evo-pmg', 'battery-evo', 'signals'] },
  pmg: { nodes: ['pmg', 'battery', 'evo', 'other', 'safety', 'cloud'], paths: ['battery-pmg', 'evo-pmg', 'other-pmg', 'pmg-cloud', 'requests'] },
  cloud: { nodes: ['cloud', 'pmg'], paths: ['pmg-cloud'] },
};

export const ARCH_LEGEND = [
  { swatch: 'concept', label: 'Mathsya concept' },
  { swatch: 'reference', label: 'Reference vehicle system' },
  { swatch: 'interface', label: 'Approved data / recommendation interface' },
  { swatch: 'future', label: 'Optional / future' },
] as const;

/* ---------- Observe → Interpret → Coordinate → Verify ---------- */

export const INTEGRATION_STATIONS = [
  { label: 'Module', detail: 'Existing sensing & control' },
  { label: 'Edge model', detail: 'Suitable module compute' },
  { label: 'PMG', detail: 'Approved vehicle network' },
  { label: 'Outcome', detail: 'Permitted action, checked locally' },
  { label: 'Learning', detail: 'Quality or fleet services · optional' },
] as const;

export const INTEGRATION_STEPS = [
  {
    id: 'observe',
    verb: 'Observe',
    title: 'Observe the module',
    body: 'Use approved signals and diagnostics from existing sensing and control. Define what is available, at what quality and for which operating conditions.',
    stations: [0],
    carries: 'approved signals',
    tagLabel: 'Defines',
    tags: ['Signal availability', 'Signal quality', 'Operating conditions'],
  },
  {
    id: 'interpret',
    verb: 'Interpret',
    title: 'Evaluate on the edge',
    body: 'Run a bounded model on suitable compute. Retain confidence, version and evidence; compare its usefulness with deterministic and model-based methods.',
    stations: [1],
    carries: 'insight + confidence',
    tagLabel: 'Retains',
    tags: ['Confidence', 'Model version', 'Evidence', 'Comparison with existing methods'],
  },
  {
    id: 'coordinate',
    verb: 'Coordinate',
    title: 'Coordinate with PMG',
    body: 'Exchange health and context events through the approved vehicle network. PMG combines module information with journey, customer and service intent.',
    stations: [2],
    carries: 'health & context event',
    tagLabel: 'Adds',
    tags: ['Journey', 'Customer intent', 'Service intent'],
  },
  {
    id: 'verify',
    verb: 'Verify',
    title: 'Verify and learn',
    body: 'Request only permitted actions. Check outcomes locally and share authorized, relevant evidence with quality or fleet services.',
    stations: [3, 4],
    carries: 'outcome + evidence',
    tagLabel: 'Requires',
    tags: ['Permitted actions only', 'Local outcome check', 'Authorized evidence'],
  },
] as const;

/* ---------- Product roles ---------- */

export const ROLE_ROWS: { id: ProductId | 'cloud'; product: string; what: string; where: string; who: string; path: string }[] = [
  {
    id: 'battery',
    product: PRODUCTS.battery.name,
    what: 'Health trends, state-estimation evaluation and charging context.',
    where: `${PRODUCTS.battery.kind}; ${lcFirst(PRODUCTS.battery.runsOn)}.`,
    who: `${PRODUCTS.battery.buyers}.`,
    path: 'Scoped engineering and embedded-runtime licensing.',
  },
  {
    id: 'evo',
    product: PRODUCTS.evo.name,
    what: 'Shared control, defined power functions and AI supervision.',
    where: `${PRODUCTS.evo.kind}; ${lcFirst(PRODUCTS.evo.runsOn)}.`,
    who: `${PRODUCTS.evo.buyers}.`,
    path: 'Paid development, supply and program software / support options.',
  },
  {
    id: 'pmg',
    product: PRODUCTS.pmg.short,
    what: 'Connects module insight to vehicle and customer context.',
    where: `Vehicle software; ${lcFirst(PRODUCTS.pmg.runsOn)}.`,
    who: `${PRODUCTS.pmg.buyers}.`,
    path: 'Integration and embedded-software licensing.',
  },
  {
    id: 'cloud',
    product: 'PMG cloud services',
    what: 'Authorized fleet evidence, quality workflows and service learning.',
    where: 'Optional off-vehicle software.',
    who: 'OEM or fleet organizations.',
    path: 'SaaS subscription or enterprise terms after the value case is proven.',
  },
];
export const ROLES_CAPTION = 'Proposed product roles and commercial paths; production specifications and pricing are not released.';

/* ---------- Independent adoption ---------- */

export const ADOPTION_LEAD =
  'A partner can start with one product and one application. The connected portfolio is an expansion path; it does not require replacing every vehicle module or adopting all products together.';

export const ADOPTION_ROUTES: { id: ProductId; start: string; who: string; first: string; later: string }[] = [
  {
    id: 'battery',
    start: 'Start with Battery & Charging AI',
    who: 'Battery and BMS suppliers, OEMs',
    first: 'One pack, one useful health or charging question, approved test data. A first pilot can use existing module hardware.',
    later: 'Make approved module insight available to PMG and/or Evo Core.',
  },
  {
    id: 'pmg',
    start: 'Start with a PMG vehicle workflow',
    who: 'OEMs, vehicle platforms and fleets',
    first: 'One valuable vehicle workflow, starting from existing module data and approved vehicle interfaces.',
    later: 'Battery AI and Evo Core add portfolio-specific capabilities as each is independently validated.',
  },
  {
    id: 'evo',
    start: 'Start with an Evo Core reference architecture',
    who: 'OEMs and power-system partners',
    first: 'Vehicle scope, power ratings, interfaces, retained functions and responsibilities, defined with the reference program.',
    later: 'Connect to the BMS, PMG, cooling and diagnostics through defined interfaces.',
  },
];
export const ADOPTION_EXPANSION = {
  title: 'Connected architecture',
  body: 'The expansion path, not a requirement. Each connection is added when its own evidence supports it.',
};

/* ---------- Deployment ---------- */

export const DEPLOYMENT_LOCATIONS: { n: string; id: ProductId | 'cloud'; place: string; runs: string; detail: string }[] = [
  {
    n: '1',
    id: 'battery',
    place: 'BMS or adjacent module compute',
    runs: 'Battery & Charging AI runtime',
    detail: 'Placement follows measured latency, memory, compute and isolation needs.',
  },
  {
    n: '2',
    id: 'evo',
    place: 'Vehicle power-electronics location',
    runs: 'Evo Core hardware and embedded software',
    detail: 'Ratings, topology, packaging and qualification are defined with the reference program.',
  },
  {
    n: '3',
    id: 'pmg',
    place: 'Gateway, telematics unit or central computer',
    runs: 'PMG vehicle runtime',
    detail: 'Suitable vehicle compute, selected for the reference architecture.',
  },
  {
    n: '4',
    id: 'cloud',
    place: 'Optional cloud',
    runs: 'PMG cloud services',
    detail: 'Off-vehicle, permission-governed and optional.',
  },
];

export const DEPLOYMENT_INTERFACES = [
  { label: 'Module → PMG', text: 'Health and context events over the approved vehicle network.' },
  { label: 'Sensing → module AI', text: 'Approved signals and diagnostics from existing sensing and control.' },
  { label: 'Evo Core ↔ vehicle', text: 'Defined interfaces to the BMS, cooling and diagnostics.' },
  { label: 'PMG → control', text: 'Permitted action requests; validated functions keep their authority.' },
];

export const RESPONSIBILITIES = {
  local: {
    label: 'On the vehicle · local',
    items: [
      'Interpret module signals with confidence and data-quality checks',
      'Combine module events with vehicle and journey context',
      'Request only permitted actions',
      'Check outcomes locally and preserve focused history',
      'Defined behaviour for missing data and lost connectivity',
    ],
  },
  cloud: {
    label: 'Off the vehicle · optional',
    items: [
      'Compare relevant events across permitted vehicles and versions',
      'Support quality investigations and service decisions',
      'Track whether a correction reduced the repeat behaviour',
      'Manage access, consent, retention and data ownership',
    ],
  },
};

export type Delivery = 'yes' | 'no' | 'optional';
export const HW_SW_COLS = ['Hardware', 'Embedded software', 'Vehicle software', 'Cloud / SaaS'] as const;
export const HW_SW_ROWS: { id: ProductId; product: string; summary: string; cells: [Delivery, Delivery, Delivery, Delivery] }[] = [
  { id: 'evo', product: 'Evo Core', summary: 'Hardware + embedded software', cells: ['yes', 'yes', 'no', 'no'] },
  { id: 'battery', product: 'Battery & Charging AI', summary: 'Embedded software', cells: ['no', 'yes', 'no', 'no'] },
  { id: 'pmg', product: 'PMG', summary: 'Vehicle software + optional SaaS', cells: ['no', 'no', 'yes', 'optional'] },
];

/* ---------- Benefits section (data: BENEFITS in @/data/portfolio) ---------- */

export const BENEFITS_INTRO = 'Follow one decision: choose a candidate scenario to see the module intelligence, the role of PMG and what a pilot should measure.';

/* ---------- Principles, validation, integration ---------- */

export const PRINCIPLES = [
  {
    n: '01',
    label: 'Local operation',
    title: 'Edge inference first.',
    body: 'Evaluate selected functions within the vehicle. Optional cloud learning adds value when available; connectivity loss has a defined local behaviour.',
    require: 'Accuracy, memory, latency, compute and local fallback behaviour, measured on the selected compute.',
  },
  {
    n: '02',
    label: 'Validated control',
    title: 'Respect existing limits.',
    body: 'Real-time control, protection and permitted actuator authority remain defined by the validated vehicle architecture. Model output is a reviewable input to an approved decision process.',
    require: 'Only permitted actions are requested, operating limits are respected and outcomes are checked locally.',
  },
  {
    n: '03',
    label: 'Evidence & adoption',
    title: 'Prove incremental value.',
    body: 'Measure the improvement over existing methods, including false alerts, resource needs, integration, validation and support costs.',
    require: 'Usefulness compared with deterministic and model-based methods and existing diagnostics, on held-out data.',
  },
];

export const INTEGRATION_TERMS = {
  title: 'The deployment architecture follows the vehicle.',
  body: 'The exact network, APIs, compute, memory, latency and diagnostic integration are set during the reference program. Data access and secure update responsibilities need an agreed owner.',
  reference: ['Network', 'APIs', 'Compute', 'Memory', 'Latency', 'Diagnostic integration'],
  owner: ['Data access', 'Secure updates'],
  commercial:
    'Commercial terms follow the same order: paid integration or engineering first; licensing, supply or subscription terms once the value case is measured. Production specifications and pricing are not released.',
};

export const PLATFORM_CTA = {
  title: 'Choose one entry point.\nConnect the value case.',
  body: 'Start with Battery AI, a PMG vehicle workflow or an Evo Core reference architecture.',
};
