// /evo-core page copy. Sources: docs/editing-pack-2026-10-20.md (section 06), docs/legacy-source/evo-core.txt, public/assets/Evo-Core-Program-Overview.md
// and the shared data in @/data/portfolio (GENERATIONS, MATRIX, HARDWARE_GATES) + @/data/products (PRODUCTS.evo).
// No ratings, kW figures, dates or results: the architecture is proposed, not released.
import type { EvoFocus } from '@/components/three/EvoCoreScene';
import type { GenId, MatrixCell } from '@/data/portfolio';

export const EVO_META = {
  title: 'Evo Core · EV power hardware and embedded software',
  description:
    'Evo Core is Mathsya’s proposed EV power platform: OBC, DC/DC, EVCC and HV distribution under common control with Edge AI supervision, on a Gen 1–3 roadmap.',
};

export const EVO_HERO = {
  eyebrow: 'Evo Core · EV power hardware + embedded software',
  lines: ['Power brought together.', 'Intelligence built in.'],
  lead: 'Evo Core is a proposed EV power-hardware and embedded-software platform. It explores common control across defined charging, conversion and distribution functions, with supervisory intelligence for operating context and module behaviour.',
  roadmapNote: 'Generations are a proposed roadmap with no committed release dates.',
  sheetNote: 'Schematic concept illustration · not a production design',
};

/* ---------------------------------------------------------------- exploded view */

export type RelationId = 'control' | 'physical' | 'interface';

/** The three relationships an element can have with Evo Core. Never conflate them. */
export const RELATIONS: { id: RelationId; label: string; members: string[]; body: string }[] = [
  {
    id: 'control',
    label: 'Shares control',
    members: ['OBC', 'DC/DC', 'EVCC', 'HV'],
    body: 'Proposed to run under one common control foundation: shared compute, operating modes and diagnostics. The supervisory AI observes through it and does not take control.',
  },
  {
    id: 'physical',
    label: 'May be physically integrated',
    members: ['OBC', 'DC/DC', 'EVCC', 'HV', 'CTRL'],
    body: 'Could share one housing and its cooling. That is a separate packaging decision, taken only on prototype evidence.',
  },
  {
    id: 'interface',
    label: 'External interface',
    members: ['BMS', 'PMG', 'Cooling', 'Diagnostics', 'Charging station', 'LV network'],
    body: 'Stay outside Evo Core and connect through defined interfaces. Their power stages, sensing and protection do not move inside.',
  },
];

export type EvoFunction = {
  id: EvoFocus;
  n: string;
  code: string;
  name: string;
  role: string;
  what: string;
  proposal: string;
  control: string;
  physical: string;
  interfaces: string;
  proof: string;
};

/** Gen 1 proposed scope, function by function (hotspots of the exploded view). */
export const FUNCTIONS: EvoFunction[] = [
  {
    id: 'obc',
    n: '01',
    code: 'OBC',
    name: 'Onboard charging',
    role: 'Charging path',
    what: 'Converts AC grid power to charge the high-voltage battery.',
    proposal:
      'Bring OBC operating modes and diagnostics under the common control foundation. The power stage is retained, adapted or developed according to the reference design; ratings and topology are set with the reference program.',
    control: 'Operating modes, timing and diagnostics coordinated by common control.',
    physical: 'Its power stage could share the housing and cooling with DC/DC — a packaging decision, not an assumption.',
    interfaces: 'Charge port and AC supply; charging stays within the limits the existing BMS permits.',
    proof: 'Bench proof of operating modes, interface timing and fault response.',
  },
  {
    id: 'dcdc',
    n: '02',
    code: 'DC/DC',
    name: 'Low-voltage conversion',
    role: 'Low-voltage supply path',
    what: 'Supplies the vehicle’s low-voltage network from the high-voltage battery.',
    proposal:
      'Share mode coordination, diagnostic services and reusable embedded software with the other power functions. Retain, adapt or develop the power stage against the approved reference architecture and available supplier interfaces.',
    control: 'Mode coordination and diagnostic services shared with OBC and distribution.',
    physical: 'Could share housing, cooling, isolation and connectors with OBC — each evaluated on a prototype.',
    interfaces: 'The low-voltage network and its loads; high-voltage supply through the distribution paths.',
    proof: 'Bench: modes and fault response. Prototype: cooling, packaging and EMC.',
  },
  {
    id: 'evcc',
    n: '03',
    code: 'EVCC',
    name: 'Charging communication',
    role: 'Charging-session link',
    what: 'Handles communication with the charging station during a charging session.',
    proposal:
      'Coordinate session communication with OBC behaviour and charging readiness under common control. DC-session support is a later option that needs its own compatible interfaces and power hardware.',
    control: 'Session state shared with the power functions it coordinates.',
    physical: 'May share the housing with the power functions — a separate packaging decision.',
    interfaces: 'The charging station, through the vehicle charge port.',
    proof: 'Bench proof of interface timing. Every added charging function needs its own qualification.',
  },
  {
    id: 'hv',
    n: '04',
    code: 'HV',
    name: 'HV distribution',
    role: 'High-voltage junction',
    what: 'Junction and protection paths for the high-voltage connections.',
    proposal:
      'Coordinate distribution and junction functions with the conversion stages, retained, adapted or developed against the approved reference architecture.',
    control: 'Status and diagnostics coordinated with the conversion functions.',
    physical: 'Could share the housing; isolation and connector design decide whether it should.',
    interfaces: 'The high-voltage battery and the loads defined by the reference vehicle. Battery protection stays with the validated BMS.',
    proof: 'Bench proof of fault response; isolation and EMC on a prototype.',
  },
  {
    id: 'control',
    n: '05',
    code: 'CTRL',
    name: 'Common control',
    role: 'Shared control foundation',
    what: 'Shared compute, operating modes and diagnostics for the defined power functions.',
    proposal:
      'The first integration step: controller and interface commonization. Review shared compute, mode coordination, diagnostic services and reusable embedded software, and keep real-time and supervisory responsibilities defined.',
    control: 'The foundation the power functions share.',
    physical: 'Shared compute is reviewed first; where it is housed is a separate packaging decision.',
    interfaces: 'The existing BMS and its permitted limits, PMG vehicle software, vehicle cooling and diagnostics.',
    proof: 'Hardware commonization must earn its cost case: controller/interface count, BOM, NRE and validation effort.',
  },
  {
    id: 'ai',
    n: '06',
    code: 'AI',
    name: 'Supervisory intelligence',
    role: 'Supervisory layer',
    what: 'Embedded Edge AI that evaluates module health. It supervises; it is not real-time control.',
    proposal:
      'Compare accessible power, temperature, cooling-command and operating-mode trends, with hardware and software versions, and flag a reviewable change in module behaviour.',
    control: 'Reads through common control. Real-time control and protection keep their validated authority.',
    physical: 'Runs on the common-control compute only if measured compute and latency limits allow it.',
    interfaces: 'PMG adds vehicle history and journey context, then routes a permitted notification or service recommendation.',
    proof: 'Useful insight within measured compute and latency limits; detection lead time on known cases and false alerts.',
  },
];

export const ASSEMBLY = {
  title: 'Gen 1 proposed scope',
  body: 'Six functions, and three relationships to Evo Core that are never treated as the same thing:',
};

/* ---------------------------------------------------------------- generations */

export type Domain = 'power' | 'battery' | 'software' | 'vehicle' | 'mixed';
export type ScopeStatus = 'core' | 'retained' | 'option';
export type LinkChange = 'defined' | 'extended' | 'option';

export const DOMAINS: { id: Exclude<Domain, 'mixed'>; label: string }[] = [
  { id: 'power', label: 'Power functions' },
  { id: 'battery', label: 'Battery context' },
  { id: 'software', label: 'Connected software' },
  { id: 'vehicle', label: 'Vehicle systems' },
];
export const SCOPE_STATUS: { id: ScopeStatus | 'interface'; label: string }[] = [
  { id: 'core', label: 'Core proposed scope' },
  { id: 'retained', label: 'Retained foundation' },
  { id: 'interface', label: 'External interface' },
  { id: 'option', label: 'Option · needs validation' },
];
export const LINK_CHANGE: Record<LinkChange, string> = {
  defined: 'Defined interface',
  extended: 'Extended relationship',
  option: 'Option · needs validation',
};

/**
 * Classification of each GENERATIONS[gen].integrated / .connected entry (same order as the shared lists).
 * Text stays single-sourced in @/data/portfolio; this only adds colour domain, status and what changed.
 */
export const GEN_SCOPE: Record<
  GenId,
  {
    integrated: { domain: Domain; status: ScopeStatus; isNew?: boolean }[];
    connected: { domain: Domain; change: LinkChange; note: string }[];
    newNote?: string;
  }
> = {
  gen1: {
    integrated: [
      { domain: 'power', status: 'core' },
      { domain: 'power', status: 'core' },
      { domain: 'power', status: 'core' },
      { domain: 'power', status: 'core' },
      { domain: 'power', status: 'core' },
    ],
    connected: [
      { domain: 'battery', change: 'defined', note: 'BMS interface. Sensing, balancing and protection stay with the validated BMS.' },
      { domain: 'software', change: 'defined', note: 'Connected software layer.' },
      { domain: 'vehicle', change: 'defined', note: 'Selected thermal interfaces and defined diagnostics.' },
    ],
    newNote: 'The first proposed architecture: all five scope items establish the foundation.',
  },
  gen2: {
    integrated: [
      { domain: 'power', status: 'retained' },
      { domain: 'battery', status: 'core', isNew: true },
      { domain: 'battery', status: 'core', isNew: true },
      { domain: 'battery', status: 'core', isNew: true },
      { domain: 'power', status: 'option', isNew: true },
    ],
    connected: [
      { domain: 'battery', change: 'extended', note: 'BMS interface becomes limited coordination; ownership does not move.' },
      { domain: 'vehicle', change: 'extended', note: 'Selected interfaces become coordinated thermal orchestration.' },
      { domain: 'software', change: 'extended', note: 'Adds journey and service context.' },
    ],
  },
  gen3: {
    integrated: [
      { domain: 'mixed', status: 'retained' },
      { domain: 'power', status: 'core', isNew: true },
      { domain: 'power', status: 'option', isNew: true },
      { domain: 'power', status: 'option', isNew: true },
      { domain: 'power', status: 'core', isNew: true },
    ],
    connected: [
      { domain: 'power', change: 'option', note: 'Stays external; supervisory functions only as a validated option.' },
      { domain: 'vehicle', change: 'extended', note: 'Wider coordinated interfaces.' },
      { domain: 'software', change: 'extended', note: 'Adds authorized OEM learning services.' },
    ],
  },
};

/* ---------------------------------------------------------------- matrix */

export const MATRIX_KINDS: { kind: MatrixCell['kind']; label: string }[] = [
  { kind: 'core', label: 'Core scope' },
  { kind: 'extension', label: 'Proposed extension' },
  { kind: 'retained', label: 'Retained foundation' },
  { kind: 'interface', label: 'External interface' },
  { kind: 'owned', label: 'BMS-owned' },
  { kind: 'option', label: 'Option · needs validation' },
  { kind: 'future', label: 'Future option' },
];

/* ---------------------------------------------------------------- integration */

export type Layer = 'control' | 'power' | 'housing' | 'all';
export const INTEGRATION_LEAD =
  'First establish control ownership and approved interfaces. Evaluate shared compute and software, then retained or new power functions. Assess cooling, isolation, connectors, housing and repairability. Verify modes, timing, fault response and the complete cost of realization and qualification.';
export const INTEGRATION_STEPS: { n: string; title: string; body: string; layer: Layer; decides: string }[] = [
  {
    n: '01',
    title: 'Control commonization',
    body: 'Establish control ownership and approved interfaces, then evaluate shared compute, mode coordination, diagnostic services and reusable embedded software. Real-time and supervisory responsibilities stay defined.',
    layer: 'control',
    decides: 'Control board + supervisory layer',
  },
  {
    n: '02',
    title: 'Power & interfaces',
    body: 'Evaluate retained or new power functions: OBC, DC/DC and distribution are retained, adapted or developed against the reference architecture and available supplier interfaces.',
    layer: 'power',
    decides: 'Power stages, distribution, EVCC',
  },
  {
    n: '03',
    title: 'Physical realization',
    body: 'Assess cooling, isolation, connectors, housing and repairability. A shared housing does not by itself prove a lower cost or simpler qualification.',
    layer: 'housing',
    decides: 'Housing, cooling plate, lid',
  },
  {
    n: '04',
    title: 'System evidence',
    body: 'Verify modes, timing, fault response, thermal behaviour and EMC, and the complete cost of realization and qualification.',
    layer: 'all',
    decides: 'The complete assembly, on test',
  },
];

export const PROOF_OBLIGATIONS = {
  title: 'Common control and AI supervision have separate proof obligations.',
  tracks: [
    {
      k: 'Common control',
      body: 'Hardware commonization must earn its cost case.',
      measures: 'Controller/interface count · BOM · NRE · validation effort · software reuse · variant cost',
    },
    {
      k: 'AI supervision',
      body: 'The model must separately demonstrate useful insight within measured compute and latency limits.',
      measures: 'Runtime resources · detection lead time on known cases · false alerts',
    },
  ],
  base: 'Validated protection and fault containment remain part of the architecture.',
};

/* ---------------------------------------------------------------- engineering ledger */

export type GateNo = '01' | '02' | '03' | '04';
export const ENGINEERING: { id: string; title: string; assume: string; outside: string; evidence: string; gates: GateNo[] }[] = [
  {
    id: 'eng-power',
    title: 'Power-stage & interface assumptions',
    assume:
      'OBC, DC/DC and distribution power stages are retained, adapted or developed according to the reference design and the supplier interfaces available. Ratings, topology and packaging are defined with the reference program — none are stated here.',
    outside:
      'A connected interface does not move a power stage, its sensing or its protection into Evo Core. DC-session support and V2L/V2G need their own compatible interfaces and power hardware; shared software alone does not provide bidirectional power.',
    evidence: 'Agreed vehicle scope, power ratings, interfaces, retained functions and responsibilities.',
    gates: ['01'],
  },
  {
    id: 'eng-thermal',
    title: 'Thermal & packaging considerations',
    assume:
      'Housing, cooling, isolation, connectors and mechanical integration are evaluated before anything is combined. One housing is a separate packaging decision; Gen 3 shared compute or packaging stays subject to feasibility.',
    outside:
      'Vehicle cooling — pumps, fans and thermal controllers — connects through defined interfaces. Battery/power thermal orchestration is a proposed Gen 2 extension, not a Gen 1 assumption.',
    evidence: 'Power-stage realization, cooling and packaging on a prototype; controlled thermal tests before Gen 2 coordination; system thermal evidence before Gen 3.',
    gates: ['03'],
  },
  {
    id: 'eng-bms',
    title: 'BMS ownership & protection boundaries',
    assume:
      'Evo Core works with the existing BMS and its permitted limits. Gen 2 proposes limited coordination: approved battery information and supervisory decisions shared with the power platform.',
    outside: 'Cell sensing, balancing and protection keep defined BMS ownership in every generation. Shared software does not replace cell-monitor hardware.',
    evidence: 'Responsibilities agreed at the reference stage; battery data and runtime proof before any Gen 2 coordination.',
    gates: ['01'],
  },
  {
    id: 'eng-safety',
    title: 'Safety & fault containment',
    assume:
      'Validated protection and fault containment remain part of the architecture. Real-time control and supervisory responsibilities stay defined: the Edge AI supervises module health and does not take real-time control.',
    outside:
      'Validated motor-drive control and protection stay outside. Inverter supervisory functions are a Gen 3 option, and Gen 3 is not a commitment to replace every vehicle controller.',
    evidence: 'Bench proof of operating modes, interface timing and fault response; mixed-function timing, isolation and fault-containment tests before any wider integration.',
    gates: ['02'],
  },
  {
    id: 'eng-emc',
    title: 'EMC & qualification requirements',
    assume: 'Every proposed scope is subject to reference-vehicle feasibility, the safety architecture and qualification. Vehicle-level qualification is partner-defined.',
    outside:
      'Integration is not assumed to reduce qualification work. Each added charging or bidirectional function carries its own qualification, and its cost is counted in the business case.',
    evidence: 'EMC on the prototype, system thermal/EMC evidence for Gen 3, and partner-defined vehicle integration, qualification and lifecycle readiness.',
    gates: ['03', '04'],
  },
];

/** What each HARDWARE_GATES step closes on this page (links into the engineering ledger). */
export const GATE_CLOSES: Record<GateNo, { label: string; href: string }[]> = {
  '01': [
    { label: 'Power-stage & interface assumptions', href: '#eng-power' },
    { label: 'BMS ownership & protection boundaries', href: '#eng-bms' },
  ],
  '02': [
    { label: 'Safety & fault containment', href: '#eng-safety' },
    { label: 'AI runtime feasibility', href: '#integration' },
  ],
  '03': [
    { label: 'Thermal & packaging', href: '#eng-thermal' },
    { label: 'EMC', href: '#eng-emc' },
    { label: 'Complete cost model', href: '#value' },
  ],
  '04': [{ label: 'Qualification & lifecycle readiness', href: '#eng-emc' }],
};

export const GATES_NOTE =
  'Hardware generations have no committed release dates. The 12–16 week plan elsewhere on the site is a scoped PMG software PoC, not a production-hardware delivery promise.';

export const OVERVIEW_DOC = {
  href: '/assets/Evo-Core-Program-Overview.md',
  title: 'Evo Core program overview',
  body: 'Product role, Gen 1–3 scope, how integration works, outcomes to validate, hardware gates and the proposed commercial path.',
};

/* ---------------------------------------------------------------- value case */

export const VALUE_BLOCKS: { audience: string; title: string; body: string; measure: string }[] = [
  {
    audience: 'Customer value to evaluate',
    title: 'Coordinated operating behaviour',
    body: 'Charging readiness, clearer power and thermal explanations, and useful health or service guidance through approved vehicle interfaces.',
    measure: 'Readiness, energy use in a defined test, false recommendations and service outcomes.',
  },
  {
    audience: 'OEM value to evaluate',
    title: 'A platform that can be reused',
    body: 'Reusable control and diagnostic software, manageable interfaces and variants, better investigation evidence and a complete commonization cost case.',
    measure: 'Controller/interface count, BOM, NRE, validation effort, software reuse and variant cost.',
  },
  {
    audience: 'Service and quality',
    title: 'Context for a power-system event',
    body: 'Link the module observation to operating mode, cooling context and hardware/software version. Compare behaviour after an approved correction.',
    measure: 'Triage time, evidence completeness, no-fault-found outcomes and recurrence.',
  },
];

export const BUSINESS_CASE = {
  audience: 'Business case',
  title: 'The complete cost of integration',
  body: 'Compare the integrated concept with the reference design, and count every cost of adopting it.',
  measured: ['Controller/interface count', 'BOM and NRE', 'Validation and integration effort', 'Software reuse', 'Runtime resources', 'Readiness and energy outcomes', 'Triage time and recurrence'],
  costs: [
    { k: 'Redesign', body: 'Changes to the reference design needed to combine, adapt or replace functions.' },
    { k: 'Tooling', body: 'New or modified tooling for housings, assembly and test.' },
    { k: 'Supplier access', body: 'Access to supplier power stages, interfaces, data and support.' },
    { k: 'Qualification', body: 'Qualification of every changed or added function.' },
    { k: 'Repairability', body: 'What a shared assembly means for diagnosis, replacement and service.' },
    { k: 'Lifecycle support', body: 'Variants, software updates and long-term support across programs.' },
  ],
  verdict: 'Measured net value, rather than controller count alone, decides the next generation.',
  caveat: 'A conceptual shared enclosure is not assumed to lower cost or qualification work — both are measured against the reference design.',
  commercial: 'Proposed commercial path: paid engineering and reference programs, then hardware supply and embedded-software/support terms — after buyer and cost validation.',
};

export const EVO_CTA = {
  eyebrow: 'Build the first proof',
  title: 'Define the reference.\nBuild the first generation.',
  body: 'Agree the power functions, supplier interfaces and proof needed for a credible hardware program.',
};
