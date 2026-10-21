// /about copy. Sources: docs/editing-pack-2026-10-20.md (section 11), docs/legacy-source/about.txt (hero, vision, founder, approach), index.txt (module signals),
// platform.txt (engineering principles, portfolio relationships), battery-ai.txt (baseline), pmg.txt (measures),
// investor-brief.txt (founder line, next milestone), Mathsya-Pitch-Deck-Source.md slide 11.
// Founder facts are limited to the verified experience line; the founder is not named on the site (owner's decision,
// 21 October 2026). No employers, dates, degrees, team members or partners.

export const ABOUT_HERO = {
  eyebrow: 'About Mathsya · Bengaluru, India',
  lead: 'Mathsya Connected Services is developing automotive Edge AI that connects module behaviour to vehicle decisions and organizational learning. Our portfolio spans Battery & Charging AI, PMG vehicle software and the Evo Core power platform.',
};

export const COLOPHON = [
  { term: 'Company', detail: 'Mathsya Connected Services' },
  { term: 'Based in', detail: 'Bengaluru, India' },
  { term: 'Stage', detail: 'Development-stage portfolio; benefits and roadmap are proposed' },
  { term: 'Work', detail: 'Automotive Edge AI across module software, vehicle software and EV power hardware' },
];

export const CONTENTS = [
  { id: 'vision', label: 'Vision' },
  { id: 'edge-ai', label: 'Edge AI' },
  { id: 'founder', label: 'Founder' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'approach', label: 'Approach' },
  { id: 'direction', label: 'Direction' },
];

export const VISION = {
  title: 'Make vehicle intelligence useful and measurable.',
  body: 'The opportunity begins inside automotive modules: operating signals, health trends and events can carry more value when they are interpreted in context and linked to a useful decision.',
  terms: [
    { term: 'Useful', detail: 'Linked to a decision someone already makes: a charging plan, a service recommendation, an engineering investigation.' },
    { term: 'Measurable', detail: 'Compared with today’s estimation, diagnostics and workflows, counting false alerts, overrides and the complete cost of adoption.' },
  ],
};

export const EDGE = {
  title: 'Edge AI reads module signals where they are produced.',
  signals: [
    { module: 'Battery', line: 'A battery knows its operating state.' },
    { module: 'Charger', line: 'A charger knows its session.' },
    { module: 'Power module', line: 'A power module knows its temperature.' },
  ],
  body: 'Mathsya’s direction is to interpret those signals locally, connect them to the vehicle’s needs and preserve evidence that helps engineering and service.',
  baseline: 'Conventional BMS estimation, diagnostics and protection already perform important work. The question is where data-driven inference can add useful, measurable insight.',
  principles: [
    { label: 'Local operation', title: 'Edge inference first', body: 'Evaluate selected functions within the vehicle. Optional cloud learning adds value when available; connectivity loss has a defined local behaviour.' },
    { label: 'Validated control', title: 'Respect existing limits', body: 'Protection, real-time control and permitted actuator authority belong to the validated vehicle architecture. Model output is not an unrestricted control command.' },
    { label: 'Evidence & adoption', title: 'Prove incremental value', body: 'Measure the improvement over existing methods, including false alerts, resource needs, integration, validation and support costs.' },
  ],
};

export const FOUNDER = {
  title: 'A perspective built across vehicle systems.',
  experience: 'The founder brings automotive engineering experience spanning vehicle programs, connected services, telematics hardware, validation and EV power electronics.',
  purpose: 'Our approach begins with a useful problem, approved interfaces and measurable acceptance criteria.',
  execution: 'The first partner program will be staffed around the engineering and evaluation skills that program requires.',
};

/* ---------------------------------------------------------------- Disciplines → portfolio map */

export type DisciplineId = 'programs' | 'connected' | 'validation' | 'power';
export type PortfolioId = 'pmg' | 'ei' | 'battery' | 'evo';

export const DISCIPLINES: { id: DisciplineId; label: string }[] = [
  { id: 'programs', label: 'Vehicle programs' },
  { id: 'connected', label: 'Connected services & telematics hardware' },
  { id: 'validation', label: 'Validation' },
  { id: 'power', label: 'EV power electronics' },
];

export const PORTFOLIO_NODES: { id: PortfolioId; label: string; role: string; swatch: string }[] = [
  { id: 'pmg', label: 'Proactive Mobility Guardian', role: 'Vehicle software', swatch: 'var(--p-pmg)' },
  { id: 'ei', label: 'Engineering Intelligence', role: 'Engineering program', swatch: '#1c9aaa' },
  { id: 'battery', label: 'Battery & Charging AI', role: 'Module software', swatch: 'var(--p-battery)' },
  { id: 'evo', label: 'Evo Core', role: 'Power hardware + embedded software', swatch: 'var(--p-evo)' },
];

/** Each link names the product fact that the discipline bears on. */
export const INFORMS: { from: DisciplineId; to: PortfolioId; why: string }[] = [
  { from: 'programs', to: 'pmg', why: 'PMG works at vehicle level, joining module insight with vehicle, customer and service context.' },
  { from: 'programs', to: 'evo', why: 'Evo Core’s ratings, interfaces and responsibilities are defined with a reference vehicle program.' },
  { from: 'connected', to: 'pmg', why: 'PMG is designed to run on suitable gateway, telematics or central vehicle compute.' },
  { from: 'connected', to: 'ei', why: 'Its proposed initial scope covers connected functions: remote operations, cellular connectivity and GNSS.' },
  { from: 'validation', to: 'ei', why: 'Release changes, test evidence and system logs become a reviewable investigation.' },
  { from: 'validation', to: 'battery', why: 'Battery insight has to be compared with validated BMS estimates and independent reference measurements.' },
  { from: 'power', to: 'battery', why: 'Charging readiness and thermal context sit alongside the validated BMS and its permitted limits.' },
  { from: 'power', to: 'evo', why: 'Gen 1 proposes onboard charging, DC/DC, EVCC and HV distribution under a common control foundation.' },
];

export const PORTFOLIO_WHY = {
  title: 'How vehicle-system experience informs the product direction',
  body: [
    'Battery & Charging AI, PMG and Evo Core connect module software, vehicle intelligence and EV power hardware. Engineering tools and selected research support the wider evidence and product lifecycle.',
    'Each product can be evaluated on its own and needs its own technical proof and commercial case. PMG connects selected products through approved vehicle interfaces; the cloud adds learning without becoming a prerequisite for local operation.',
  ],
  note: 'A map of disciplines and the product decisions they inform. It is not a dated career history.',
};

/* ---------------------------------------------------------------- Approach + evidence */

export const APPROACH = {
  title: 'Define the problem. Earn the next stage.',
  steps: [
    { n: '01', label: 'Usefulness', title: 'Start with a real decision', body: 'Choose a vehicle or module problem with an existing workflow, approved data and an outcome a customer or organization values.' },
    { n: '02', label: 'Engineering', title: 'Make the evidence reviewable', body: 'Define interfaces, responsibilities and acceptance criteria. Keep proposed benefits and achieved results clearly identified.' },
    { n: '03', label: 'Adoption', title: 'Build a repeatable value case', body: 'Include integration, validation, runtime and support costs. Extend a program when technical evidence and customer demand support it.' },
  ],
};

export const EVIDENCE = {
  title: 'What will count as evidence',
  intro: 'Validation is where a proposed benefit becomes a result, or does not. Each program is measured against the method it would extend or replace.',
  rows: [
    {
      area: 'Battery & Charging AI',
      baseline: 'Conventional BMS estimation, diagnostics and protection',
      evidence: 'Held-out state-estimation error, actionable alerts, false alerts, customer overrides and independently verified health outcomes',
    },
    {
      area: 'PMG',
      baseline: 'Today’s detection, readiness or investigation performance for one vehicle use case',
      evidence: 'Readiness, recommendation acceptance, false alerts, avoidable repeat diagnosis, investigation time and recurrence',
    },
    {
      area: 'Evo Core',
      baseline: 'The reference design, including redesign, tooling, supplier access, qualification, repairability and lifecycle support',
      evidence: 'Bench proof of interfaces, operating modes, timing and fault response, plus a bottom-up cost comparison',
    },
    {
      area: 'Engineering programs',
      baseline: 'The existing engineering workflow and current investigation process',
      evidence: 'Decision time and reusable evidence; failure-localization time, evidence completeness and behaviour after an approved correction',
    },
  ],
  caption: 'Proposed evaluation measures from the program plans. No measured results, savings, battery-life or range gains are claimed.',
};

/* ---------------------------------------------------------------- Mission + direction */

export const DIRECTION = {
  eyebrow: 'Mission & long-term direction',
  title: 'From module intelligence to customer and OEM value.',
  intro: 'Mathsya’s direction connects three levels of value. Each next level has to be earned with evidence from the one before it.',
  levels: [
    { n: '01', level: 'Module', title: 'Module intelligence', body: 'Interpret module signals locally, with confidence and data-quality checks.', where: 'Battery & Charging AI · Evo Core' },
    { n: '02', level: 'Vehicle', title: 'Vehicle and customer experience', body: 'Join module insight to vehicle, customer and service context through approved interfaces, then check whether a permitted recommendation helped.', where: 'PMG' },
    { n: '03', level: 'Organization', title: 'Organizational outcomes', body: 'Share authorized evidence with engineering, quality, warranty and service teams, optionally and with permission.', where: 'Optional OEM & fleet services · engineering programs' },
  ],
  gates: ['Extend when module evidence and customer demand support it', 'Extend when verified vehicle outcomes and their complete cost support it'],
  next: 'Next milestone: agree one problem, partner, approved data, baseline and acceptance gate.',
};
