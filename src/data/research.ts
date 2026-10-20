// /research copy. Sources: docs/editing-pack-2026-10-20.md (section 11: program leads), docs/legacy-source/research.txt (programs, pilots, value, proof gate, boundary),
// modules.js "connected functions & telematics" (signal vocabulary), investors.txt (engineering-tools adoption path).
// Program names, stages and summaries come from PROGRAMS in @/data/portfolio.

export const RESEARCH_HERO = {
  eyebrow: 'Research & enabling programs',
  title: 'Connecting engineering decisions to better evidence.',
  lead: 'Mathsya’s supporting programs bring engineering decisions, validation evidence and vehicle learning together. Each progresses against a defined problem, its own proof gate and the resources needed to establish value.',
  note: 'Concepts, workflow design and exploratory research. None of these programs is a released product or tool.',
};

/* ---------------------------------------------------------------- 01 / Product Neural Chain */

export type ChainStageId = 'requirements' | 'architecture' | 'cost' | 'reuse' | 'validation' | 'field';

export type ChainStage = {
  id: ChainStageId;
  label: string;
  role: string; // what this stage holds
  support: string; // proposed decision support
  owner: string; // who reviews the recommendation
};

/** Lifecycle order, left to right. */
export const CHAIN_STAGES: ChainStage[] = [
  {
    id: 'requirements',
    label: 'Requirements',
    role: 'Scope, constraints and acceptance criteria for one product family.',
    support: 'When a requirement changes, show the architecture choices, tests and field observations linked to it, so the change can be assessed before it is accepted.',
    owner: 'Requirements owner',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    role: 'Design options and the decisions that fix them.',
    support: 'Place comparable earlier decisions, and the evidence behind them, next to the option being chosen.',
    owner: 'System architect',
  },
  {
    id: 'cost',
    label: 'Cost',
    role: 'Cost evidence for design options and proposed changes.',
    support: 'Link each accepted change to its cost evidence, so the cost impact of the change can be reviewed afterwards.',
    owner: 'Cost engineering owner',
  },
  {
    id: 'reuse',
    label: 'Reuse',
    role: 'Existing designs and test evidence that could serve again.',
    support: 'Flag candidate reuse opportunities. A reuse counts only once the design owner confirms it.',
    owner: 'Design owner',
  },
  {
    id: 'validation',
    label: 'Validation',
    role: 'Tests and results that show whether a decision holds.',
    support: 'Trace each test result to the requirement and design decision it verifies, so the evidence can be found and reused.',
    owner: 'Validation lead',
  },
  {
    id: 'field',
    label: 'Field learning',
    role: 'What vehicles in service reveal about earlier decisions.',
    support: 'Return a field observation to the requirements and design decisions it concerns, instead of leaving it in a separate report.',
    owner: 'Quality / field engineering owner',
  },
];

/** Directed information flows between stages. A flow to an earlier stage is evidence returning. */
export const CHAIN_LINKS: { from: ChainStageId; to: ChainStageId; carries: string }[] = [
  { from: 'requirements', to: 'architecture', carries: 'Scope, constraints and acceptance criteria' },
  { from: 'requirements', to: 'validation', carries: 'Acceptance criteria to verify' },
  { from: 'architecture', to: 'cost', carries: 'Design options to be costed' },
  { from: 'architecture', to: 'validation', carries: 'Design decisions to test' },
  { from: 'reuse', to: 'architecture', carries: 'Existing designs and their evidence' },
  { from: 'reuse', to: 'cost', carries: 'Established costs of reusable designs' },
  { from: 'cost', to: 'requirements', carries: 'Cost impact of a proposed change' },
  { from: 'validation', to: 'reuse', carries: 'Verified evidence that can be reused' },
  { from: 'validation', to: 'field', carries: 'Validated behaviour to compare with field data' },
  { from: 'field', to: 'requirements', carries: 'Field observations that question a requirement' },
  { from: 'field', to: 'reuse', carries: 'In-service behaviour of reused designs' },
];

export const NEURAL_CHAIN = {
  number: '01',
  title: 'Engineering decisions with connected memory',
  lead: 'An enabling program connecting requirements, architecture, cost, reuse, validation and field feedback to support reviewable product lifecycle decisions. A first pilot should measure decision time, evidence reuse and the value of confirmed changes.',
  pilot: 'One product family and a small set of lifecycle decisions, with known source documents and decision owners.',
  value: ['Decision time', 'Reusable evidence', 'Confirmed reuse opportunities', 'Cost impact of accepted changes'],
  gate: 'Traceable recommendations and verified changes must support a better engineering decision than the existing workflow.',
};

/* ---------------------------------------------------------------- 02 / Engineering Intelligence */

export type InvestigationStep = {
  id: string;
  label: string;
  short: string; // compact label for narrow screens
  evidence: string;
  responsibility: string;
  assist: string; // what the proposed assistance does
};

export const INVESTIGATION_STEPS: InvestigationStep[] = [
  {
    id: 'release',
    label: 'Release changes',
    short: 'Release',
    evidence: 'The software and hardware versions in each release, and what changed between them for the connected function under investigation.',
    responsibility: 'Release and quality engineers decide which changes are in scope.',
    assist: 'Collect the release context for the failure, so the investigation starts from what actually changed.',
  },
  {
    id: 'tests',
    label: 'Test evidence',
    short: 'Tests',
    evidence: 'Connected-service test results from both releases, for the affected function.',
    responsibility: 'Validation engineers confirm which results represent the reported failure.',
    assist: 'Line up results from both releases test by test, so a change in behaviour is visible.',
  },
  {
    id: 'logs',
    label: 'Connected system logs',
    short: 'Logs',
    evidence: 'Remote-function events, connectivity transitions and positioning context from the connected system.',
    responsibility: 'Engineers decide which logs are relevant and approved for the investigation.',
    assist: 'Place log events on the same timeline as the test steps and release changes.',
  },
  {
    id: 'investigation',
    label: 'Reviewable investigation',
    short: 'Investigate',
    evidence: 'Behaviour compared across releases, with each likely explanation linked to the evidence behind it.',
    responsibility: 'Engineers own the conclusion. The assistance proposes and shows its evidence; it does not decide.',
    assist: 'Show where behaviour diverges between releases and which evidence supports or contradicts each explanation.',
  },
  {
    id: 'correction',
    label: 'Verified correction',
    short: 'Verify',
    evidence: 'Behaviour after an approved correction, checked against the original failure.',
    responsibility: 'The correction is approved by its owners and re-tested before the investigation closes.',
    assist: 'Compare behaviour after the fix with the failure, and keep the evidence for the next investigation.',
  },
];

export const ENGINEERING_INTELLIGENCE = {
  number: '02',
  title: 'From a release event to a clearer investigation',
  lead: 'An enabling program linking release changes, connected-service tests and system logs to support failure localization and comparison across releases. A first pilot should measure investigation effort and evidence quality against the current workflow.',
  scope: ['Connected functions', 'Remote operations', 'Cellular connectivity', 'GNSS'],
  pilot: 'Select a connected function and representative failures. Compare assisted investigations with the current process.',
  value: ['Failure-localization time', 'Evidence completeness', 'Behaviour after an approved correction'],
  ownership: 'Engineers own the conclusions. Every proposed explanation stays linked to the release, test and log evidence behind it.',
  adoption: 'Proposed adoption: a focused workflow pilot for engineering and validation teams, then enterprise tooling or services if the pilot shows value.',
};

/* ---------------------------------------------------------------- 03 / Solar-assisted auxiliaries */

export type SolarConditionId = 'sunny' | 'cloudy' | 'shaded';

export const SOLAR_CONDITIONS: { id: SolarConditionId; label: string; title: string; body: string; model: string }[] = [
  {
    id: 'sunny',
    label: 'Sunny',
    title: 'Clear sky, vehicle in the open',
    body: 'The most favourable case for collection. Even here, what reaches the load is what remains after conversion and storage losses.',
    model: 'Model the useful energy delivered to the defined load, not the panel’s output.',
  },
  {
    id: 'cloudy',
    label: 'Cloudy',
    title: 'Overcast or changing weather',
    body: 'Collection falls with cloud cover, and the vehicle supply covers more of the load. A daily estimate has to include typical weather, not clear days alone.',
    model: 'Model energy across representative weather, not a single best case.',
  },
  {
    id: 'shaded',
    label: 'Shaded parking',
    title: 'Parked under a roof, building or trees',
    body: 'A parked vehicle may stand in shade for long periods. Collection can fall close to nothing, and the conventional vehicle supply carries the defined load.',
    model: 'Model how often and how long real parking positions are shaded.',
  },
];

export const SOLAR_PATH = [
  { n: 1, label: 'Sunlight', body: 'Daylight reaching the vehicle roof. It varies with weather, shading and parking position.' },
  { n: 2, label: 'Solar collection', body: 'A modest roof panel collects part of that light.' },
  { n: 3, label: 'Power conversion / storage', body: 'Converts and stores the energy. Each step loses some of it.' },
  { n: 4, label: 'Defined auxiliary load', body: 'One specified low-voltage load, agreed before any modeling starts.' },
  { n: 5, label: 'Conventional vehicle backup', body: 'The vehicle’s own supply covers the load whenever solar energy falls short.' },
] as const;

export const SOLAR = {
  number: '03',
  title: 'Use available sunlight. Measure useful energy.',
  lead: 'A separate research track evaluating modest vehicle-integrated solar for a defined low-voltage auxiliary load with conventional vehicle backup. Useful energy, parking exposure, installation, repair and full system cost determine the case. It is separate from the three primary product roles.',
  separate: 'No product, rating or release is implied.',
  technical: {
    label: 'Technical question',
    question: 'Does usable energy meet the load?',
    factors: [
      { term: 'Operating conditions', detail: 'Sunny, cloudy and shaded parking, in the proportions a vehicle actually experiences.' },
      { term: 'Shading & weather', detail: 'How often, and for how long, collection is reduced.' },
      { term: 'Conversion losses', detail: 'Energy lost between the panel and the load.' },
      { term: 'Storage & integration', detail: 'Usable storage, and how it connects to the vehicle’s low-voltage system.' },
      { term: 'Realistic auxiliary demand', detail: 'The load as it is actually used, measured rather than assumed.' },
      { term: 'Technical feasibility', detail: 'Whether the useful energy meets the defined load at all.' },
    ],
  },
  commercial: {
    label: 'Commercial question',
    question: 'Does the installation earn its cost?',
    cost: ['Integration', 'Storage', 'Repair'],
    benefit: 'Reduction in the energy the vehicle supplies to the defined load',
    horizon: 'Both sides are judged over the installation’s lifetime performance.',
  },
  boundary: 'Auxiliary energy coverage alone does not establish attractive payback. A credible prototype should compare measured useful energy with the complete installed cost.',
};

export const RESEARCH_CTA = {
  eyebrow: 'Start a supporting program',
  title: 'Choose one engineering question.\nAgree on the evidence.',
  body: 'Supporting programs begin with a named decision, baseline and owner. Pilot scope follows the strongest technical and business case.',
};
