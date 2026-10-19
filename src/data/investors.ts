// Investor narrative + printable brief copy.
// Sources: docs/legacy-source/investors.txt, pitch.txt (12 chapters + "Evidence needed" notes), investor-brief.txt,
// app.js (audiences), public/assets/Mathsya-Investor-Brief.md, public/resources/Mathsya-Pitch-Deck-Source.md.
// Shared product/proof data stays in @/data/products and @/data/portfolio — import it, do not copy it here.
import { contactHref } from './site';
import type { ProductId } from './products';

export const HERO = {
  eyebrow: 'Investors / OEMs / Incubators',
  title: ['A focused first proof.', 'A connected growth path.'],
  lead: 'Mathsya is developing automotive Edge AI as a product portfolio: Battery & Charging AI at module level, Evo Core in EV power hardware and PMG across vehicle software and optional cloud services.',
  stage: 'architecture, use cases and PoC planning · commercial terms remain to be validated',
};

/** Hero fact sheet. Every line is sourced; "Not claimed" restates the claim rules for a reader. */
export const AT_A_GLANCE = [
  { k: 'Founder', v: 'Arjun Amuthan · Bengaluru, India' },
  { k: 'Portfolio', v: 'Battery & Charging AI, PMG and Evo Core, with engineering tools as an enabling track' },
  { k: 'First proof', v: 'A proposed 12–16 week PMG software PoC, starting once partner, approved data and test access are agreed' },
  { k: 'Next step', v: 'A partner-defined problem with approved data and measurable acceptance criteria' },
  { k: 'Not claimed', v: 'Revenue, customer contracts, validated pricing, market size or a funding amount' },
];

export type ChapterId = 'thesis' | 'problem' | 'opportunity' | 'portfolio' | 'entry' | 'business' | 'proof' | 'partner' | 'founder' | 'milestone';

export const CHAPTERS: { id: ChapterId; n: string; nav: string; kicker: string }[] = [
  { id: 'thesis', n: '01', nav: 'Thesis', kicker: 'The thesis' },
  { id: 'problem', n: '02', nav: 'Problem', kicker: 'The problem' },
  { id: 'opportunity', n: '03', nav: 'Opportunity', kicker: 'The opportunity' },
  { id: 'portfolio', n: '04', nav: 'Portfolio', kicker: 'The portfolio' },
  { id: 'entry', n: '05', nav: 'Entry', kicker: 'The entry strategy' },
  { id: 'business', n: '06', nav: 'Business', kicker: 'The business model' },
  { id: 'proof', n: '07', nav: 'Proof', kicker: 'The proof roadmap' },
  { id: 'partner', n: '08', nav: 'Investment', kicker: 'The investment & partnership opportunity' },
  { id: 'founder', n: '09', nav: 'Founder', kicker: 'The founder & execution' },
  { id: 'milestone', n: '10', nav: 'Milestone', kicker: 'The next milestone' },
];

/**
 * Evidence register — the pitch's "Evidence needed for this slide" notes, rewritten for a public reader.
 * Every claim is proposed and its evidence is defined; none is established yet, so every status is "Open".
 */
export type Evidence = { claim: string; evidence: string; status: 'Open' };
export const EVIDENCE: Record<ChapterId | 'battery' | 'pmg' | 'evo', Evidence> = {
  thesis: {
    claim: 'Edge AI proven in one module can repeat across vehicle programs.',
    evidence: 'A confirmed first application and a named buyer. Until then, the platform is presented as a direction rather than a shipped product.',
    status: 'Open',
  },
  problem: {
    claim: 'Linked context can improve specific readiness, health and investigation decisions.',
    evidence: 'A partner baseline: today’s readiness, investigation time and the attributable cost of the chosen issue.',
    status: 'Open',
  },
  opportunity: {
    claim: 'One module insight can create both customer and OEM value.',
    evidence: 'A comparison with existing methods covering error, false alerts, overrides and verified outcomes. No battery-life, range or savings figure is stated before it is measured.',
    status: 'Open',
  },
  portfolio: {
    claim: 'Three product roles, each with its own adoption path.',
    evidence: 'A clear record of what exists today, what is planned and what belongs to a future generation.',
    status: 'Open',
  },
  battery: {
    claim: 'Battery AI adds useful insight alongside a validated BMS.',
    evidence: 'Held-out batteries and conditions, independent reference measurements, false-alert rates and runtime resource evidence.',
    status: 'Open',
  },
  pmg: {
    claim: 'PMG turns a module insight into a verified vehicle outcome.',
    evidence: 'A demonstration of one end-to-end case: permissions, offline behaviour and an acknowledged outcome.',
    status: 'Open',
  },
  evo: {
    claim: 'Evo Core can evolve through a Gen 1–3 roadmap.',
    evidence: 'A reference program that sets ratings, costs and timing, with shared control, power-stage integration and connected interfaces kept distinct.',
    status: 'Open',
  },
  entry: {
    claim: 'One narrowly scoped wedge can open a paid program.',
    evidence: 'A sourced, bottom-up market model built from eligible programs, volumes, attainable share and validated prices.',
    status: 'Open',
  },
  business: {
    claim: 'Each product can carry its own revenue model.',
    evidence: 'Validated pricing, support ownership, customer willingness to pay and unit economics. A proposed model is not booked revenue.',
    status: 'Open',
  },
  proof: {
    claim: 'Capital can be released against evidence gates.',
    evidence: 'Agreed work packages, engineering/data/test ownership, acceptance criteria and the investment each gate requires.',
    status: 'Open',
  },
  partner: {
    claim: 'A scoped partnership and milestone funding can deliver the first measurable application.',
    evidence: 'A funding amount and use of funds set from an agreed, costed plan, plus demo evidence and sourced market figures.',
    status: 'Open',
  },
  founder: {
    claim: 'Execution can be built around the first partner program.',
    evidence: 'Approved team biographies and execution commitments, published only once confirmed.',
    status: 'Open',
  },
  milestone: {
    claim: 'The first proof decides whether to narrow, extend or scale.',
    evidence: 'Each milestone below accepted against its agreed gate, with the complete adoption cost measured.',
    status: 'Open',
  },
};

// ---------- 01 Thesis ----------
export const THESIS = {
  title: ['Prove value in a module.', 'Repeat across programs.'],
  lead: 'Start with a defined module or vehicle problem, approved signals and a business baseline. Evaluate Edge AI usefulness, false alerts, compute needs and net value. Extend the approach as integration and commercial evidence support it.',
  statement: 'Mathsya develops automotive Edge AI that connects module behaviour to customer and OEM outcomes. The portfolio keeps module AI, vehicle software and EV power hardware as separate products.',
  pathsTitle: 'One useful module, several ways to expand',
  pathsIntro: 'The proposed entry is a narrowly scoped module or vehicle problem. Repeatable local intelligence can become an embedded product; PMG connects it to a broader vehicle and organizational workflow.',
  paths: [
    { k: 'The entry', title: 'Battery / charging insight', product: 'battery' as ProductId, body: 'Start with available signals, a known problem and a measured baseline. Define a buyer and an acceptance gate before extending the application.' },
    { k: 'The connection', title: 'PMG vehicle software', product: 'pmg' as ProductId, body: 'Join the module result to readiness, service or quality decisions. Test embedded licensing and optional organization-level services.' },
    { k: 'The hardware path', title: 'Evo Core integration', product: 'evo' as ProductId, body: 'Develop power commonization through a separate hardware program. Expand generations when integration and commercial evidence support them.' },
  ],
};

// ---------- 02 Problem ----------
export const PROBLEM = {
  title: 'Signals need a useful decision.',
  lead: 'Charging readiness, battery-health guidance and power-system investigations can benefit from linked operating and vehicle context. Start with a specific issue and compare against today’s workflow.',
  stations: [
    { k: 'Module signal', body: 'A battery knows its operating state. A charger knows its session. A power module knows its temperature.' },
    { k: 'Existing baseline', body: 'BMS estimation, diagnostics and validated control already act on these signals. They are the reference any new insight is measured against.' },
    { k: 'The decision', body: 'Is the battery ready for the morning departure after a long, warm drive? Is a warmer power module a new operating condition, a cooling issue or a component trend?', gap: true },
    { k: 'The evidence', body: 'When a repeat issue appears across releases or vehicles, quality and service teams need comparable evidence and a way to verify the correction.' },
  ],
  gapLabel: 'Where linked context is tested',
  firstCases: ['Charging readiness', 'Battery-health guidance', 'Power-system investigations'],
  baselineNote: 'Mathsya does not assume existing BMS or diagnostic systems lack intelligence. The question for a pilot is narrower: whether, for one named issue, vehicle, journey and service context improves the decision over today’s workflow.',
};

// ---------- 03 Opportunity ----------
export const OPPORTUNITY = {
  title: 'Value at three levels: the module, the vehicle and the organization.',
  lead: 'Operating signals, health trends and events carry more value when they are interpreted in context and linked to a decision. Mathsya’s direction connects module intelligence, vehicle and customer experience, and organizational outcomes across engineering, quality, warranty and service.',
  outcomes: {
    customer: {
      title: 'Customer outcomes',
      body: 'Useful readiness and charging guidance, clearer battery/thermal context and better-informed service planning.',
      measure: 'Verified outcomes, false alerts and customer overrides.',
    },
    oem: {
      title: 'OEM outcomes',
      body: 'Evidence-led investigations, repeat-issue learning and a credible commonization cost case.',
      measure: 'Investigation time, recurrence, reusable software and complete program cost.',
    },
  },
  note: 'No achieved battery-life, range, warranty or savings percentages are claimed. Comparisons are made against existing methods and include data, integration, compute, validation and support costs.',
};

// ---------- 04 Portfolio ----------
export const PORTFOLIO = {
  title: 'Three product roles, each with a separate adoption path.',
  lead: 'Battery & Charging AI is embedded module software. PMG is vehicle software with optional cloud/SaaS services. Evo Core is EV power hardware plus embedded software. A customer can begin with one product; the connected architecture is the expansion path, not a requirement to buy the whole portfolio.',
  connectNote: 'Module products can be evaluated independently. PMG connects selected products through approved vehicle interfaces; the cloud adds learning without becoming a prerequisite for local operation.',
};

/** Adoption-path comparison rows (b). Phases align across products so the paths can be compared side by side. */
export const ADOPTION_PHASES = ['Where it runs', 'First proof', 'Gate to pass', 'Expands to'] as const;
export const ADOPTION: Record<ProductId, { steps: [string, string, string, string]; hardwareGates?: boolean }> = {
  battery: {
    steps: [
      'Suitable BMS, module or adjacent vehicle compute, alongside the validated BMS.',
      'A separately scoped model work package on partner battery data, compared with existing estimation.',
      'Held-out state-estimation error, actionable and false alerts, and runtime resource evidence.',
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

// ---------- 05 Entry strategy ----------
export const ENTRY = {
  title: ['Choose the buyer.', 'Prove the first wedge.'],
  lead: 'Select one buyer, an observable high-value problem, available data and a current baseline. Prove it through a scoped pilot, then seek a paid program before expanding across modules or generations.',
  steps: [
    { n: '01', title: 'A costly, observable problem', body: 'Agree a charging-readiness, health or investigation case with an accountable engineering or service owner.', commit: 'Accountable owner' },
    { n: '02', title: 'An existing baseline', body: 'Measure current detection, readiness, investigation effort and the complete cost of the issue.', commit: 'Measured baseline' },
    { n: '03', title: 'A bounded implementation', body: 'Use approved data and controlled testing before any permitted vehicle action or wider deployment.', commit: 'Controlled test' },
    { n: '04', title: 'A paid next step', body: 'Seek acceptance against the agreed gate and validate integration responsibility, pricing and willingness to adopt.', commit: 'Paid program' },
  ],
  rule: 'Commitment rises one step at a time, and only after the step before has met its gate.',
};

// ---------- 06 Business model ----------
export const BUSINESS = {
  title: 'Match the revenue model to the product.',
  lead: 'Battery AI: integration and embedded licensing. PMG: vehicle-software licensing and optional SaaS/enterprise services. Evo Core: paid engineering, hardware supply and program software/support.',
};

export type OfferingId = 'battery' | 'pmg' | 'cloud' | 'evo' | 'tools';
export type BuyerId = 'bms' | 'oem' | 'fleet' | 'power' | 'eng';

/** The legacy commercial model table, plus the buyer nodes each offering maps to (for the portfolio-to-market diagram). */
export const COMMERCIAL: {
  id: OfferingId;
  offering: string;
  short: string;
  tone: ProductId | 'neutral';
  buyer: string;
  buyers: BuyerId[];
  entry: string;
  entryShort: string;
  expansion: string;
  expansionShort: string;
}[] = [
  {
    id: 'battery',
    offering: 'Battery & Charging AI',
    short: 'Battery & Charging AI',
    tone: 'battery',
    buyer: 'Battery/BMS supplier or OEM',
    buyers: ['bms', 'oem'],
    entry: 'Paid integration/PoC',
    entryShort: 'Paid integration / PoC',
    expansion: 'Embedded-runtime licensing and program support.',
    expansionShort: 'Runtime licensing + program support',
  },
  {
    id: 'pmg',
    offering: 'PMG embedded software',
    short: 'PMG embedded',
    tone: 'pmg',
    buyer: 'OEM, vehicle platform or fleet program',
    buyers: ['oem', 'fleet'],
    entry: 'Scoped vehicle workflow',
    entryShort: 'Scoped vehicle workflow',
    expansion: 'Program or per-vehicle licensing, subject to agreed deployment terms.',
    expansionShort: 'Program or per-vehicle licensing',
  },
  {
    id: 'cloud',
    offering: 'PMG cloud services',
    short: 'PMG cloud services',
    tone: 'pmg',
    buyer: 'OEM quality/service organization or fleet',
    buyers: ['oem', 'fleet'],
    entry: 'Authorized evidence workflow',
    entryShort: 'Authorized evidence workflow',
    expansion: 'Enterprise subscription/services where recurring value is proven.',
    expansionShort: 'Enterprise subscription / services',
  },
  {
    id: 'evo',
    offering: 'Evo Core',
    short: 'Evo Core',
    tone: 'evo',
    buyer: 'OEM or EV power-system partner',
    buyers: ['oem', 'power'],
    entry: 'Paid engineering/reference program',
    entryShort: 'Paid engineering / reference program',
    expansion: 'Hardware supply and embedded-software/support terms.',
    expansionShort: 'Hardware supply + software / support',
  },
  {
    id: 'tools',
    offering: 'Engineering tools',
    short: 'Engineering tools',
    tone: 'neutral',
    buyer: 'Engineering and validation teams',
    buyers: ['eng'],
    entry: 'Focused workflow pilot',
    entryShort: 'Focused workflow pilot',
    expansion: 'Enterprise tooling/services, as an enabling track.',
    expansionShort: 'Enterprise tooling / services',
  },
];
export const COMMERCIAL_NOTE = 'Proposed adoption paths. No booked revenue, signed customer contract or validated price is claimed.';

export const BUYERS: { id: BuyerId; label: string; detail?: string }[] = [
  { id: 'bms', label: 'Battery & BMS suppliers' },
  { id: 'oem', label: 'OEMs', detail: 'incl. quality & service organizations' },
  { id: 'fleet', label: 'Vehicle platforms & fleets' },
  { id: 'power', label: 'EV power-system partners' },
  { id: 'eng', label: 'Engineering & validation teams' },
];

export const ECONOMICS = {
  title: 'Net value includes the whole adoption cost.',
  plus: ['Attributable issue cost avoided', 'Engineering / service time saved', 'Measured energy value'],
  minus: 'Integration, runtime, validation, operation and support cost',
  result: 'Net value to validate',
  note: 'Avoid double-counting the same benefit across products.',
};

/** Figures the next proof must establish. Deliberately left blank: none is presented as traction. */
export const OPEN_NUMBERS = [
  { k: 'Buyer interviews', how: 'Documented with named problem owners and the cost of their issue.' },
  { k: 'Addressable reference programs', how: 'Eligible vehicle programs and their volumes, each one named.' },
  { k: 'Pricing', how: 'Validated with buyers, including who owns integration and support.' },
  { k: 'Unit economics', how: 'Runtime, integration, validation and support cost per program or vehicle.' },
  { k: 'TAM / SAM / SOM', how: 'Bottom-up: eligible programs × volumes × attainable share × validated price.' },
  { k: 'Funding ask', how: 'Set gate by gate from an agreed, costed plan, with the use of funds.' },
];

// ---------- 07 Proof roadmap ----------
export const PROOF = {
  title: 'Four software gates beside a separate hardware path.',
  lead: 'A proposed 12–16 week PMG software PoC starts after partner, approved data and test access are agreed. Battery AI model development and Evo Core hardware require separately scoped work packages.',
  /** The investor-page reading of each PMG_POC gate (legacy investors.txt), shown beneath the shared gate copy. */
  gateLens: [
    'Problem, buyer, signal access, permissions and an agreed acceptance gate.',
    'Read-only data path, vehicle context, policy checks and a reviewable bench integration.',
    'Replay and controlled tests, false alerts, model/runtime needs and traceable outcomes.',
    'Incremental value, complete costs and a buyer-led discussion about paid expansion.',
  ],
  batteryNote: 'Battery AI model development is scoped separately from the PMG PoC, as its own work package with held-out evaluation.',
  workstreams: [
    { k: 'Software / data', title: 'Runtime and evaluation', body: 'Model work, signal integration, edge runtime, versioned evidence and controlled tests.' },
    { k: 'Hardware / validation', title: 'Reference and bench proof', body: 'Supplier-interface access, control feasibility, prototype planning and bottom-up cost evidence.' },
    { k: 'Buyer / adoption', title: 'Commercial proof', body: 'Partner discovery, acceptance criteria, pricing and a clear ownership/support model.' },
  ],
};

// ---------- 08 Investment & partnership ----------
export const PARTNER = {
  title: 'A scoped partnership, approved data and milestone-based funding.',
  lead: 'Seek a scoped OEM/BMS/power-system partnership, approved signal/test access and milestone-based funding for the first measurable application. Use evidence from that proof to set the next program and growth decision.',
  audienceLine: 'For strategic OEM partners, incubators and early-stage capital.',
  sought: [
    { k: 'Partner', body: 'A scoped OEM, BMS or power-system partnership with an accountable problem owner.' },
    { k: 'Data', body: 'Approved signal and test access, with permissions and integration responsibility agreed.' },
    { k: 'Team', body: 'Engineering and evaluation skills assembled around the first partner program.' },
    { k: 'Milestone', body: 'Milestone-based funding tied to the gates of the first measurable application.' },
  ],
  result: 'The first measurable application',
};

/** Audience tabs (legacy app.js `audiences`). */
export const AUDIENCES = [
  {
    id: 'strategic',
    tab: 'Strategic / OEM partner',
    label: 'A partner-defined entry point',
    title: 'Bring a use case. Build the proof together.',
    copy: 'A nominated module or vehicle use case, approved data and an agreed business baseline create the foundation for a scoped Edge AI PoC.',
    points: [
      'Compare module and business outcomes against the existing workflow.',
      'Define integration responsibility and acceptance criteria.',
      'Advance to a paid program when technical and commercial gates are met.',
    ],
    chain: ['Nominated use case', 'Scoped PoC + acceptance gate', 'Paid program'],
    cta: { label: 'Discuss an OEM pilot', href: contactHref('oem-pilot') },
  },
  {
    id: 'capital',
    tab: 'Early-stage investor',
    label: 'Capital aligned to technical milestones',
    title: 'Fund evidence that can support a scalable product.',
    copy: 'The next stage develops Edge AI runtime, module integration and validation evidence to test vehicle value, organizational outcomes and a repeatable commercial model.',
    points: [
      'Fund defined work packages and measurable pilot outcomes.',
      'Test the licensing thesis and customer willingness to pay.',
      'Release follow-on capital against integration, value and qualification gates.',
    ],
    chain: ['Defined work package', 'Integration, value & qualification gates', 'Follow-on capital'],
    cta: { label: 'Start an investor enquiry', href: contactHref('investor') },
  },
] as const;

// ---------- 09 Founder & execution ----------
export const FOUNDER = {
  title: 'The founder, and how execution is organized.',
  name: 'Arjun Amuthan',
  initials: 'AA',
  role: 'Founder, Mathsya Connected Services',
  location: 'Bengaluru, India',
  summary: 'Automotive engineering experience spanning vehicle programs, connected services, telematics hardware, validation and EV power electronics.',
  disciplines: ['Vehicle programs', 'Connected services', 'Telematics hardware', 'Validation', 'EV power electronics'],
  execution: [
    { k: 'Team', body: 'Build the first partner program around the engineering and evaluation skills that program requires.' },
    { k: 'Funding', body: 'Align funding to agreed software/data, hardware/bench and buyer/adoption work packages.' },
    { k: 'Disclosure', body: 'Add team biographies and execution commitments only once they are approved. No team members, advisors, partnerships or endorsements are implied.' },
  ],
};

// ---------- 10 Next milestone ----------
export const MILESTONE = {
  title: 'What must be proven before scaling.',
  lead: 'The next investor conversation should add approved demo evidence, validated economics and a costed investment milestone. Each step below names the open evidence it is designed to produce.',
  items: [
    { body: 'Agree one problem, partner, approved data, baseline and acceptance gate.', moves: ['thesis', 'problem', 'partner'] as ChapterId[] },
    { body: 'For a proposed 12–16 week PMG software PoC, build a reviewable integration and evaluate a controlled workflow after access is agreed.', moves: ['opportunity', 'portfolio', 'proof'] as ChapterId[] },
    { body: 'Scope Battery AI model development and Evo Core hardware as separate work packages with their own evidence gates.', moves: ['portfolio', 'proof'] as ChapterId[] },
    { body: 'Validate buyer willingness to adopt, pricing and a costed paid follow-on program.', moves: ['entry', 'business', 'partner'] as ChapterId[] },
  ],
};

// ---------- Resources ----------
/** Sizes in bytes from `wc -c` (October 2026). Update when a file changes. */
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
      body: 'Twelve slide narratives, suggested visuals, the evidence to establish before pitching numbers, and a six-slide five-minute cut.',
      href: '/resources/Mathsya-Pitch-Deck-Source.md',
      meta: 'Markdown',
      bytes: 7369,
      action: 'Download source',
      download: true,
    },
  ],
  files: [
    { title: 'Team handoff', body: 'Page structure, content rules, hosting, domain and contact requirements, and acceptance checks.', href: '/resources/Mathsya-Team-Handoff.md', bytes: 5274 },
    { title: 'Battery & Charging AI overview', body: 'Product role, capabilities to evaluate, benefits to validate, first proof and commercial path.', href: '/assets/Battery-AI-Program-Overview.md', bytes: 2827 },
    { title: 'PMG program overview', body: 'Embedded runtime, optional cloud/SaaS, three candidate workflows, first proof and authority.', href: '/assets/PMG-Program-Overview.md', bytes: 2990 },
    { title: 'Evo Core program overview', body: 'Gen 1–3 scopes, how integration works, outcomes to validate and hardware gates.', href: '/assets/Evo-Core-Program-Overview.md', bytes: 3297 },
    { title: 'Investor brief (text)', body: 'The printable brief as plain Markdown, for notes and email.', href: '/assets/Mathsya-Investor-Brief.md', bytes: 3448 },
  ],
};
export const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

// ---------- Printable brief (/investors/brief) ----------
export const BRIEF = {
  date: 'October 2026',
  title: ['Intelligence inside.', 'Value beyond.'],
  lead: 'Automotive Edge AI across module software, connected vehicle intelligence and coordinated EV power hardware.',
  facts: [
    { k: 'Founder', v: 'Arjun Amuthan · Bengaluru' },
    { k: 'Current stage', v: 'Architecture, use cases & PoC planning' },
    { k: 'Next step', v: 'A partner-defined problem with approved data and measurable acceptance criteria' },
  ],
  problem:
    'Module signals become more valuable when interpreted in context and linked to a useful decision. Mathsya’s direction starts with one battery, charging or power-system problem, connects it to vehicle and customer needs, and preserves evidence for service and OEM quality. Existing estimation, diagnostics and control form the baseline.',
  portfolio: [
    {
      product: 'battery' as ProductId,
      kind: 'Module software',
      name: 'Battery & Charging AI',
      body: 'Embedded intelligence for health/state-estimation evaluation, charging readiness, thermal context and available cell-level patterns, alongside the validated BMS.',
      adoption: 'Paid integration and embedded-runtime licensing.',
    },
    {
      product: 'pmg' as ProductId,
      kind: 'Vehicle software / optional SaaS',
      name: 'PMG',
      body: 'Proactive Mobility Guardian joins selected module insight with journey and customer context, permitted recommendations and verified outcomes. Optional cloud services extend authorized OEM/fleet learning.',
      adoption: 'Vehicle-software licensing and optional enterprise/cloud services.',
    },
    {
      product: 'evo' as ProductId,
      kind: 'Power hardware + software',
      name: 'Evo Core',
      body: 'A coordinated EV power platform with common control and AI supervision. The proposed roadmap progresses from charging/power to battery/thermal and wider energy coordination.',
      adoption: 'Paid engineering, hardware supply and program software/support.',
    },
  ],
  gens: [
    { body: 'OBC, DC/DC, EVCC, HV distribution and common control.' },
    { body: 'Battery-state context, AI and broader thermal/charging options.' },
    { body: 'Wider energy supervision and optional inverter coordination.' },
  ],
  integration:
    'Common control, physical power-stage integration and connected interfaces are distinct decisions. BMS sensing/protection, real-time controls and qualification retain defined ownership. Generations have no committed release dates.',
  founder:
    'Founder Arjun Amuthan brings an automotive engineering background spanning vehicle programs, connected services, telematics hardware, validation and EV power electronics. Funding should align to agreed software/data, hardware/bench and buyer/adoption work packages. The funding amount, market sizing and commercial terms require a sourced, bottom-up plan.',
  disclaimer:
    'Development-stage public overview. Architecture, generation scopes, benefits and commercial models are proposed. Production qualification, customer contracts and measured benefit claims are not established in this brief.',
};
