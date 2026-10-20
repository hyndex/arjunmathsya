// Investor narrative + printable brief copy.
// Source: docs/editing-pack-2026-10-20.md (sections 08–09). Earlier sources: docs/legacy-source/investors.txt,
// pitch.txt and investor-brief.txt. Shared product/proof data stays in @/data/products and @/data/portfolio — import it.
import { contactHref } from './site';
import type { ProductId } from './products';

export const HERO = {
  eyebrow: 'Investors / OEMs / Incubators',
  title: ['A focused first proof.', 'A connected growth path.'],
  lead: 'Mathsya is developing automotive Edge AI across embedded battery and charging intelligence, EV power hardware and connected vehicle software. Our entry strategy is one observable problem, one accountable buyer and an agreed measure of value.',
  stage:
    'Architecture, use cases and proof of concept planning. Product capabilities, roadmap scopes and commercial models are proposed; measured results will be identified when available.',
};

export const AT_A_GLANCE = [
  { k: 'Founder', v: 'Arjun Amuthan · Bengaluru, India' },
  { k: 'Products', v: 'Battery & Charging AI, PMG vehicle software and the Evo Core power platform' },
  { k: 'First proof', v: 'A proposed 12–16 week PMG software PoC, once partner, approved data and test access are agreed' },
  { k: 'Next step', v: 'An OEM, BMS, power-system or fleet partner with an accountable problem owner and approved signal or test access' },
];

/** The three actions, offered near the top and at the end of the page. */
export const ACTIONS = {
  brief: { label: 'Read the investor brief', href: '/investors/brief' },
  invest: { label: 'Discuss the investment', href: contactHref('investor') },
  pilot: { label: 'Discuss an OEM pilot', href: contactHref('oem-pilot') },
};

export type ChapterId = 'problem' | 'first-application' | 'portfolio' | 'value' | 'business' | 'proof' | 'founder' | 'next-ask' | 'evidence';

/** Story order from the editing pack: problem, first application, products, benefits, adoption and revenue, proof, founder, next ask. */
export const CHAPTERS: { id: ChapterId; n: string; nav: string; kicker: string }[] = [
  { id: 'problem', n: '01', nav: 'Problem', kicker: 'The problem' },
  { id: 'first-application', n: '02', nav: 'First application', kicker: 'The first application' },
  { id: 'portfolio', n: '03', nav: 'Products', kicker: 'The products' },
  { id: 'value', n: '04', nav: 'Benefits', kicker: 'The benefits' },
  { id: 'business', n: '05', nav: 'Revenue', kicker: 'Adoption and revenue' },
  { id: 'proof', n: '06', nav: 'Proof', kicker: 'The proof plan' },
  { id: 'founder', n: '07', nav: 'Founder', kicker: 'The founder' },
  { id: 'next-ask', n: '08', nav: 'Next ask', kicker: 'The next ask' },
  { id: 'evidence', n: '09', nav: 'Evidence', kicker: 'Evidence milestones' },
];

// ---------- 01 Problem ----------
export const PROBLEM = {
  title: 'Make module evidence useful to a decision.',
  lead: 'Charging readiness, battery-health guidance and power-system investigations depend on more than an isolated signal. We are exploring where local behavioural insight, vehicle context and outcome verification improve an existing workflow.',
  stations: [
    { k: 'Module signal', body: 'A battery reports its condition. A charger reports a session. A power module reports its operating behaviour.' },
    { k: 'Existing baseline', body: 'BMS estimation, diagnostics and validated control already act on these signals. They are the reference any new insight is measured against.' },
    { k: 'The decision', body: 'Is the battery ready for the morning departure after a long, warm drive? Is a warmer power module a new operating condition, a cooling issue or a component trend?', gap: true },
    { k: 'The evidence', body: 'When a repeat issue appears across releases or vehicles, quality and service teams need comparable evidence and a way to verify the correction.' },
  ],
  gapLabel: 'Where linked context is tested',
};

// ---------- 02 First application ----------
export const FIRST_APPLICATION = {
  title: 'Start with a battery or charging decision.',
  lead: 'Agree a specific readiness, health or investigation problem with an OEM, supplier or fleet owner. Establish the current baseline, obtain approved signals and test a bounded implementation before extending the application.',
  cases: ['Charging readiness', 'Battery-health guidance', 'Power-system investigations'],
  steps: [
    { n: '01', title: 'An observable problem', body: 'A readiness, health or investigation case with an accountable engineering or service owner.', commit: 'Accountable owner' },
    { n: '02', title: 'An existing baseline', body: 'Current detection, readiness or investigation effort, and the cost of the issue.', commit: 'Measured baseline' },
    { n: '03', title: 'A bounded implementation', body: 'Approved signals and controlled testing before any permitted vehicle action or wider deployment.', commit: 'Controlled test' },
    { n: '04', title: 'A paid next step', body: 'Acceptance against the agreed gate, then integration responsibility, pricing and willingness to adopt.', commit: 'Paid program' },
  ],
  rule: 'Commitment rises one step at a time, and only after the step before has met its gate.',
};

// ---------- 03 Products ----------
export const PORTFOLIO = {
  title: 'Three products with separate adoption paths.',
  lead: 'Battery & Charging AI is embedded module software. Evo Core is power hardware plus embedded software. PMG is vehicle software with optional OEM and fleet services. Each product can be evaluated independently and connected through approved interfaces as its evidence develops.',
};

/** Adoption-path comparison rows. Phases align across products so the paths can be compared side by side. */
export const ADOPTION_PHASES = ['Where it runs', 'First proof', 'Gate to pass', 'Expands to'] as const;
export const ADOPTION: Record<ProductId, { steps: [string, string, string, string]; hardwareGates?: boolean }> = {
  battery: {
    steps: [
      'Suitable BMS, module or adjacent vehicle compute, alongside the validated BMS.',
      'A separately scoped model work package on partner battery data, compared with existing estimation.',
      'Held-out estimation error, useful and false alerts, and runtime resource evidence.',
      'Approved insight shared with PMG and/or Evo Core, or licensed as a standalone embedded runtime.',
    ],
  },
  pmg: {
    steps: [
      'Suitable gateway, telematics or central vehicle compute, with defined offline behaviour.',
      'A proposed 12–16 week software PoC on one vehicle workflow, after partner, data and test access are agreed.',
      'A measured value case: usefulness, intervention behaviour and economics against the agreed baseline.',
      'Further vehicle workflows, and optional cloud services for authorized OEM and fleet learning.',
    ],
  },
  evo: {
    steps: [
      'A vehicle power-electronics location defined by the reference program.',
      'A reference program: vehicle scope, power ratings, interfaces, retained functions and responsibilities.',
      'Bench proof of interfaces, operating modes, timing and fault response, plus a bottom-up cost comparison.',
      'Gen 2 and Gen 3 extensions, each only after the previous generation’s evidence. No committed dates.',
    ],
    hardwareGates: true,
  },
};

// ---------- 04 Benefits ----------
export const VALUE = {
  title: 'Measure customer outcomes and organizational value.',
  lead: 'Evaluate useful readiness, clearer guidance and informed service planning for customers. For OEMs and partners, evaluate investigation effort, repeat issues, reusable integration and full lifecycle cost. Compare against the existing workflow and include errors, false alerts and the cost of adoption.',
};

// ---------- 05 Adoption and revenue ----------
export const BUSINESS = {
  title: 'Match revenue to the product.',
};

export type OfferingId = 'battery' | 'pmg' | 'cloud' | 'evo';
export type BuyerId = 'bms' | 'oem' | 'fleet' | 'power';

/** Commercial model table (editing pack), plus the buyer nodes each offering maps to (portfolio-to-market diagram). */
export const COMMERCIAL: { id: OfferingId; offering: string; short: string; tone: ProductId; buyer: string; buyers: BuyerId[]; entry: string; expansion: string }[] = [
  { id: 'battery', offering: 'Battery & Charging AI', short: 'Battery & Charging AI', tone: 'battery', buyer: 'Battery or BMS supplier and OEM', buyers: ['bms', 'oem'], entry: 'Scoped integration', expansion: 'Embedded-runtime licensing and support' },
  { id: 'pmg', offering: 'PMG vehicle software', short: 'PMG vehicle software', tone: 'pmg', buyer: 'OEM vehicle platform and fleet program', buyers: ['oem', 'fleet'], entry: 'Program integration', expansion: 'Embedded licensing and support' },
  { id: 'cloud', offering: 'Optional PMG cloud services', short: 'Optional PMG cloud services', tone: 'pmg', buyer: 'OEM quality or service organization and fleet', buyers: ['oem', 'fleet'], entry: 'Authorized workflow', expansion: 'Enterprise subscription or services' },
  { id: 'evo', offering: 'Evo Core', short: 'Evo Core', tone: 'evo', buyer: 'OEM and EV power-system partner', buyers: ['oem', 'power'], entry: 'Paid engineering', expansion: 'Hardware supply and program software or support' },
];
export const COMMERCIAL_NOTE = 'Proposed commercial path for each offering. Pricing and terms follow buyer validation.';

export const BUYERS: { id: BuyerId; label: string; detail?: string }[] = [
  { id: 'bms', label: 'Battery & BMS suppliers' },
  { id: 'oem', label: 'OEMs', detail: 'incl. quality & service organizations' },
  { id: 'fleet', label: 'Vehicle platforms & fleets' },
  { id: 'power', label: 'EV power-system partners' },
];

// ---------- 06 Proof ----------
export const PROOF = {
  title: 'Release the next commitment against evidence.',
  lead: 'The proposed PMG software PoC follows four gates over 12–16 weeks after partner, approved data and test access are agreed: define the baseline, connect the system, evaluate controlled workflows and decide the next stage. Battery model work and Evo Core hardware use separate scopes and evidence gates.',
  batteryNote: 'Battery model development is scoped separately from the PMG PoC, as its own work package with held-out evaluation.',
  workstreams: [
    { k: 'Software / data', title: 'Runtime and evaluation', body: 'Model work, signal integration, edge runtime, versioned evidence and controlled tests.' },
    { k: 'Hardware / bench', title: 'Reference and bench proof', body: 'Supplier-interface access, control feasibility, prototype planning and bottom-up cost evidence.' },
    { k: 'Buyer / adoption', title: 'Commercial evaluation', body: 'Acceptance criteria, pricing and a clear ownership and support model.' },
  ],
};

// ---------- 07 Founder ----------
export const FOUNDER = {
  title: 'A perspective built across vehicle systems.',
  lead: 'Founder Arjun Amuthan brings automotive engineering experience spanning vehicle programs, connected services, telematics hardware, validation and EV power electronics. Mathsya brings these disciplines together around useful module, vehicle and organizational outcomes.',
  name: 'Arjun Amuthan',
  initials: 'AA',
  role: 'Founder, Mathsya Connected Services',
  location: 'Bengaluru, India',
  disciplines: ['Vehicle programs', 'Connected services', 'Telematics hardware', 'Validation', 'EV power electronics'],
};

// ---------- 08 Next ask ----------
export const NEXT_ASK = {
  title: 'Choose the first partner program.',
  lead: 'We are seeking an OEM, BMS, power-system or fleet partner with an accountable problem owner and approved signal or test access. The next funding discussion should align engineering, data, bench work and commercial evaluation to an agreed acceptance milestone and a costed work plan.',
  sought: [
    { k: 'Partner', body: 'An OEM, BMS, power-system or fleet partner with an accountable problem owner.' },
    { k: 'Access', body: 'Approved signal or test access, with permissions and integration responsibility agreed.' },
    { k: 'Work plan', body: 'Engineering, data, bench work and commercial evaluation, costed against the milestone.' },
    { k: 'Milestone', body: 'An agreed acceptance milestone for the first application.' },
  ],
  result: 'A measurable first application',
};

// ---------- 09 Evidence ----------
/** One structured evidence section: what the first proof must establish, and the milestone that produces each item. */
export const EVIDENCE = {
  title: 'What the first proof must establish.',
  lead: 'An agreed buyer problem and baseline; a useful end-to-end demonstration; measured error and runtime behaviour; the complete adoption cost; and a validated route to a paid program. Pricing, market sizing and a funding amount will follow a sourced, bottom-up plan.',
  milestones: [
    { step: 'Agree one problem, partner, approved data, baseline and acceptance gate.', establishes: 'An agreed buyer problem and baseline' },
    { step: 'Run the proposed 12–16 week PMG software PoC once access is agreed.', establishes: 'A useful end-to-end demonstration, with measured error and runtime behaviour' },
    { step: 'Scope battery model development and Evo Core hardware as separate work packages.', establishes: 'Evidence for each product against its own gates' },
    { step: 'Validate willingness to adopt, pricing and a costed paid follow-on program.', establishes: 'The complete adoption cost and a validated route to a paid program' },
  ],
};

// ---------- Resources ----------
/** Download sizes are read from the files at build time (see investors.astro). */
export const RESOURCES = {
  title: 'A source for the investor conversation.',
  lead: 'The website and these resources share the same product roles, benefits, generation roadmap and proof gates.',
  featured: [
    {
      n: '01',
      kind: 'Investor & partner brief',
      title: 'The concise company view',
      body: 'A printable summary for a first OEM, incubator or investor discussion.',
      href: '/investors/brief',
      meta: 'Web page · Print / save PDF',
      action: 'Read the brief',
      download: false,
    },
    {
      n: '02',
      kind: 'Editable pitch source',
      title: 'Turn the story into slides',
      body: 'Slide narratives in the same order as this page, suggested visuals, the evidence to add before pitching numbers, and a five-minute sequence.',
      href: '/resources/Mathsya-Pitch-Deck-Source.md',
      meta: 'Markdown',
      action: 'Download source',
      download: true,
    },
  ],
  files: [
    { title: 'Team handoff', body: 'Page structure, content rules, hosting, domain and contact requirements, and acceptance checks.', href: '/resources/Mathsya-Team-Handoff.md' },
    { title: 'Battery & Charging AI overview', body: 'Product role, capabilities to evaluate, benefits to validate, first proof and commercial path.', href: '/assets/Battery-AI-Program-Overview.md' },
    { title: 'PMG program overview', body: 'Embedded runtime, optional cloud services, the worked example, first proof and authority.', href: '/assets/PMG-Program-Overview.md' },
    { title: 'Evo Core program overview', body: 'Gen 1–3 scopes, how integration works, outcomes to validate and hardware gates.', href: '/assets/Evo-Core-Program-Overview.md' },
    { title: 'Investor brief (text)', body: 'The printable brief as plain Markdown, for notes and email.', href: '/assets/Mathsya-Investor-Brief.md' },
  ],
};

// ---------- Printable brief (/investors/brief) ----------
export const BRIEF = {
  date: 'October 2026',
  title: 'Mathsya Connected Services',
  subtitle: 'Automotive Edge AI from module behaviour to customer and OEM value',
  facts: [
    { k: 'Founder', v: 'Arjun Amuthan · Bengaluru, India' },
    { k: 'Current stage', v: 'Architecture, use cases and proof of concept planning' },
  ],
  opportunity:
    'Battery, charging and power-system signals can support more useful decisions when they are interpreted in context and linked to a verified outcome. Mathsya starts with one observable customer or engineering problem and an existing workflow against which to measure value.',
  products: [
    {
      product: 'battery' as ProductId,
      name: 'Battery & Charging AI',
      body: 'Proposed embedded software for health trends, charging readiness, thermal context and accessible cell patterns, alongside a validated BMS.',
      path: 'Paid integration, embedded-runtime licensing and program support.',
    },
    {
      product: 'pmg' as ProductId,
      name: 'PMG',
      body: 'Proactive Mobility Guardian connects selected module insights with vehicle, journey and customer context. It prepares permitted recommendations and checks their outcomes. Optional cloud services extend authorized OEM and fleet learning.',
      path: 'Embedded licensing and optional enterprise services.',
    },
    {
      product: 'evo' as ProductId,
      name: 'Evo Core',
      body: 'A proposed EV power platform combining common control, defined power conversion and distribution functions, and supervisory intelligence. Gen 1 establishes charging and power functions; Gen 2 explores battery and thermal extensions; Gen 3 explores wider energy coordination and optional inverter supervision. Hardware scopes and release dates depend on reference-program evidence.',
      path: 'Paid engineering, then hardware supply and program software or support.',
    },
  ],
  benefits:
    'Useful charging readiness, clearer health or thermal guidance and informed service planning for customers. Focused investigation evidence, repeat-issue learning, reusable integration and a complete cost case for OEMs and partners.',
  firstProof:
    'Agree one problem, a buyer, approved data, a baseline and an acceptance gate. A proposed 12–16 week PMG software PoC begins after access is agreed. Battery model development and Evo Core hardware require separately scoped work packages. Compare useful outcomes, error, false alerts, runtime needs and total adoption cost.',
  partnership:
    'An accountable OEM, BMS, power-system or fleet problem owner; approved signal and test access; and milestone-based resources or funding for a measurable first application. Pricing, market size, funding amount and commercial terms require an agreed bottom-up plan.',
  founder: 'Arjun Amuthan brings automotive engineering experience across vehicle programs, connected services, telematics hardware, validation and EV power electronics.',
  stageNote:
    'This is a development-stage overview. Proposed benefits and generation scopes require validation; measured performance and commercial results will be identified explicitly.',
};
