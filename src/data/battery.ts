// /battery-ai copy. Sources: docs/editing-pack-2026-10-20.md (section 04), docs/legacy-source/battery-ai.txt, portfolio-data.js (benefits) and
// public/assets/Battery-AI-Program-Overview.md. PRODUCTS.battery, BENEFITS, BENEFIT_NOTE and BOUNDARIES are imported
// from the shared data where they are used — not duplicated here.
import type { BatteryFocus } from '@/components/three/BatteryPackScene';
import { BENEFITS } from '@/data/portfolio';

export const BATTERY_META = {
  title: 'Battery & Charging AI',
  description:
    'Embedded Edge AI for battery health, charging readiness and thermal context, designed to run alongside a validated BMS. Stage: architecture & PoC planning.',
};

export const BATTERY_HERO = {
  eyebrow: 'Battery & Charging AI / Embedded module software',
  title: 'Care for the battery.',
  ruled: 'Prepare for the journey.', // set on a measured rule
  support: 'Understand the battery behind the percentage.',
  lead: 'Battery & Charging AI is a proposed embedded software layer for battery behaviour, health trends, charging readiness and thermal context. It is designed to work alongside a validated Battery Management System and provide useful insight to the module owner, PMG or Evo Core.',
  boundary:
    'The initial product adds intelligence alongside the BMS. Its sensing, balancing, operating limits and protective functions retain defined ownership. AI alone does not create independently controlled charging paths for individual cells.',
  surface: 'What the driver sees',
  below: 'What the battery is doing',
  channels: ['Cell voltages', 'Pack current', 'Temperatures', 'Charging history'],
  output: ['Battery & Charging AI', 'Health trends · confidence · readiness'],
  caption: 'Illustrative signals · not measured data',
};

/* ---------- Signals (shared by the scenario readouts and the signal × capability matrix) ---------- */

export type SignalId = 'cellV' | 'packI' | 'temps' | 'history' | 'estimates' | 'limits' | 'session' | 'ambient' | 'intent' | 'vehicle';

export const SIGNALS: { id: SignalId; name: string; note: string }[] = [
  { id: 'cellV', name: 'Cell voltages', note: 'Cell level only where the pack exposes it; otherwise module or pack level' },
  { id: 'packI', name: 'Pack current', note: 'Charge and discharge load' },
  { id: 'temps', name: 'Temperatures', note: 'Cell, module or coolant sensors the pack already provides' },
  { id: 'history', name: 'Operating & charging history', note: 'Approved histories, with timestamps' },
  { id: 'estimates', name: 'Validated battery-state estimates', note: 'Existing BMS estimates, such as charge state' },
  { id: 'limits', name: 'Permitted charge & operating limits', note: 'Set and owned by the BMS and power system' },
  { id: 'session', name: 'Charger / session status', note: 'Through the agreed vehicle interface' },
  { id: 'ambient', name: 'Ambient & load context', note: 'Where accessible' },
  { id: 'intent', name: 'Departure intent', note: 'Through PMG, with customer permission' },
  { id: 'vehicle', name: 'Vehicle & journey context', note: 'Through PMG' },
];

/** Inputs the proof needs but the runtime does not read on the vehicle. */
export const EVAL_INPUTS = [
  { name: 'Timestamps', note: 'Aligned across every signal used' },
  { name: 'Reference labels', note: 'Agreed definitions of the states and events being evaluated' },
  { name: 'Independent reference measurements', note: 'Health and outcomes measured outside the model' },
  { name: 'Held-out batteries & conditions', note: 'Excluded from model development and reserved for testing' },
  { name: 'Baseline performance', note: 'Today’s estimation and diagnostic results, and the cost of the problem' },
];

/* ---------- Signature: the six proposed capabilities ---------- */

export type TraceKind = 'voltage' | 'current' | 'temperature' | 'history' | 'soc' | 'limit' | 'session' | 'ambient' | 'cells' | 'envelope' | 'events' | 'intent' | 'steps';
export type Channel = { label: string; kind: TraceKind };

export type Scenario = {
  id: BatteryFocus;
  n: string;
  short: string;
  tab: string;
  title: string;
  channels: Channel[];
  signals: SignalId[];
  interprets: string;
  output: string[];
  customer: string;
  oem: string;
  proof: string;
  parts: string[];
  note?: string;
  link?: { label: string; href: string };
};

export const CAPABILITIES_HEAD = {
  eyebrow: 'Proposed capabilities · inside the pack',
  title: 'More context for better-informed decisions',
  lead: 'Conventional BMS estimation, diagnostics and protection already perform important work. The question is where data-driven inference can add useful, measurable insight. Choose a capability to see what it reads, what it interprets and the proof it needs.',
  visual: 'Schematic concept illustration · cell count and arrangement are schematic',
  traces: 'Illustrative traces · not measured data',
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'health',
    n: '01',
    short: 'Health',
    tab: 'State-of-health evaluation',
    title: 'Battery-health trends',
    channels: [
      { label: 'Cell voltages', kind: 'voltage' },
      { label: 'Pack current', kind: 'current' },
      { label: 'Temperatures', kind: 'temperature' },
      { label: 'Operating history', kind: 'history' },
    ],
    signals: ['cellV', 'packI', 'temps', 'history', 'estimates'],
    interprets:
      'Evaluate state-of-health estimates and ageing patterns using approved operating histories. State of health describes battery condition relative to a defined reference. The model should report confidence and identify when the available data is insufficient.',
    output: ['Health trend', 'Confidence', 'Insufficient-data state'],
    customer: BENEFITS.battery.customer,
    oem: BENEFITS.battery.oem,
    proof: 'Accuracy on held-out batteries and operating conditions, checked against independent reference measurements.',
    parts: ['Modules & cells', 'BMS state estimates'],
  },
  {
    id: 'charging',
    n: '02',
    short: 'Charging',
    tab: 'Charging-readiness insights',
    title: 'Charge-session insight',
    channels: [
      { label: 'Charge state', kind: 'soc' },
      { label: 'Battery temperature', kind: 'temperature' },
      { label: 'Permitted charge limit', kind: 'limit' },
      { label: 'Session status · departure', kind: 'session' },
    ],
    signals: ['estimates', 'temps', 'limits', 'session', 'intent'],
    interprets: 'Interpret charge-session behaviour, battery condition and permitted charge limits to support a useful charging or departure-readiness recommendation.',
    output: ['Readiness for departure', 'Unusual session behaviour'],
    customer: BENEFITS.charging.customer,
    oem: BENEFITS.charging.oem,
    proof: 'Charging completion, departure readiness, false recommendations and energy impact.',
    parts: ['HV terminals & busbars', 'BMS charge limits'],
  },
  {
    id: 'thermal',
    n: '03',
    short: 'Thermal',
    tab: 'Thermal trends',
    title: 'Thermal behaviour',
    channels: [
      { label: 'Temperatures', kind: 'temperature' },
      { label: 'Load · pack current', kind: 'current' },
      { label: 'Ambient context', kind: 'ambient' },
    ],
    signals: ['temps', 'packI', 'ambient'],
    interprets: 'Compare available temperature trends with load and operating conditions. Flag a reviewable change for an approved cooling decision or service investigation.',
    output: ['Thermal pattern', 'Load & ambient context'],
    customer: 'A clearer explanation when temperature limits charging or performance, and better-informed service planning.',
    oem: 'Focused evidence for cooling and calibration investigations, and for recurring thermal issues.',
    proof: 'Known-event detection, false alerts and independently verified thermal outcomes.',
    parts: ['Cooling plate', 'Temperature sensing'],
  },
  {
    id: 'cells',
    n: '04',
    short: 'Cells',
    tab: 'Cell-pattern interpretation',
    title: 'Cell-level patterns',
    channels: [
      { label: 'Cell voltages · per cell', kind: 'cells' },
      { label: 'Cell temperatures', kind: 'temperature' },
    ],
    signals: ['cellV', 'temps', 'history'],
    interprets:
      'Where cell measurements are accessible, evaluate imbalance trends and unusual behaviour. Sensing, balancing and the pack’s electrical architecture determine what information and actions are available.',
    output: ['Imbalance trend', 'Cell event for review'],
    customer: 'Better-informed service planning when a cell-level pattern needs attention.',
    oem: 'Cell-event evidence for battery and BMS suppliers, and better-informed investigations.',
    proof: 'Cell-event detection, data quality and service evidence a technician can act on.',
    parts: ['Sensing harness', 'Cell voltage taps'],
    note: 'Available sensing and balancing hardware define what can be acted on. Software alone does not create independently controlled charging paths for each cell.',
  },
  {
    id: 'power',
    n: '05',
    short: 'Power',
    tab: 'Available-power estimates',
    title: 'State-of-power context',
    channels: [
      { label: 'Pack current · within limits', kind: 'envelope' },
      { label: 'Temperatures', kind: 'temperature' },
      { label: 'State estimates', kind: 'soc' },
    ],
    signals: ['packI', 'temps', 'estimates', 'limits'],
    interprets:
      'Evaluate state-of-power context: the charge or discharge power available under current conditions and defined operating limits. Compare any added estimation value against the existing method.',
    output: ['Available charge power', 'Available discharge power'],
    customer: 'A clearer explanation when available power is temporarily limited, with fewer avoidable surprises to test.',
    oem: 'A measured comparison with the existing state-of-power estimate under real operating conditions.',
    proof: 'Estimation error, limit compliance and usefulness over the baseline estimate.',
    parts: ['Current path & busbars', 'BMS operating limits'],
    note: 'An estimate informs decisions; it never raises a limit. Operating limits stay with the BMS and power system.',
  },
  {
    id: 'connected',
    n: '06',
    short: 'Connected',
    tab: 'Connected PMG outcomes',
    title: 'From insight to a journey',
    channels: [
      { label: 'Module insight', kind: 'events' },
      { label: 'Departure intent', kind: 'intent' },
      { label: 'Vehicle & journey context', kind: 'steps' },
    ],
    signals: ['intent', 'vehicle', 'session'],
    interprets: 'Battery AI shares an approved insight with its confidence. PMG combines the module result with departure intent and vehicle context; Evo Core provides approved power and thermal coordination interfaces.',
    output: ['Approved insight → PMG', 'Coordination → Evo Core'],
    customer: 'A readiness plan that fits the next journey: PMG can request approved scheduling or preconditioning, then confirm the result.',
    oem: 'Evidence that links a module insight to the decision taken and its verified outcome.',
    proof: 'Departure-readiness rate, customer overrides, false recommendations and support effort.',
    parts: ['Vehicle interface', 'PMG · Evo Core (off-pack)'],
    link: { label: 'See the connected architecture', href: '/platform' },
  },
];

/* ---------- Working principle ---------- */

export const PRINCIPLE = {
  eyebrow: 'How it works',
  title: 'Signals become insight; insight becomes a decision.',
  lead: 'Read approved signals; check data quality; run a bounded model on suitable compute; retain confidence and version information; share a reviewable insight; verify the resulting decision against the baseline.',
  steps: [
    { n: '01', verb: 'Read', body: 'Permitted voltage, current, temperature and history from an agreed pack and reference system.', out: 'Approved, time-aligned signals' },
    { n: '02', verb: 'Check', body: 'Missing, stale or implausible inputs are caught before any inference.', out: 'A data-quality state' },
    { n: '03', verb: 'Run', body: 'A bounded model on suitable BMS or adjacent compute, inside its defined inputs and operating range.', out: 'An estimate or pattern' },
    { n: '04', verb: 'Retain', body: 'Confidence and version information with every result, or an explicit insufficient-data state.', out: 'Confidence · model version' },
    { n: '05', verb: 'Share', body: 'A reviewable insight for the module owner, PMG or Evo Core. The BMS keeps its operating limits and protective authority.', out: 'Approved insight on an agreed interface' },
    { n: '06', verb: 'Verify', body: 'The resulting decision against the baseline: today’s estimation, diagnostics and control.', out: 'Comparison with the baseline' },
  ],
};

/* ---------- Technical visualization: alongside the BMS ---------- */

export const ALONGSIDE = {
  eyebrow: 'BMS relationship · module & vehicle interfaces',
  title: 'Local inference, alongside existing control and protection',
  lead: 'The validated BMS keeps sensing, balancing, operating limits and protection. Battery & Charging AI evaluates a bounded model beside it and shares reviewable insight through approved interfaces. Its output informs decisions; it has no unrestricted authority over the pack.',
  bms: {
    name: 'Validated BMS',
    role: 'Keeps defined ownership',
    items: [
      { k: 'Sensing', v: 'Cell voltages, pack current, temperatures' },
      { k: 'Balancing', v: 'Balancing hardware and its strategy' },
      { k: 'Operating limits', v: 'Validated charge and discharge limits' },
      { k: 'Protection', v: 'Protective authority over the pack' },
    ],
    also: 'Existing state estimation and diagnostics continue unchanged.',
  },
  runtime: {
    name: 'Battery AI runtime',
    role: 'Runs alongside · suitable BMS or adjacent compute',
    items: [
      { k: 'Data-quality checks', v: 'Missing, stale or implausible inputs are caught first' },
      { k: 'Bounded model', v: 'Defined inputs, outputs and operating range' },
      { k: 'Confidence', v: 'Every result carries one, or an insufficient-data state' },
      { k: 'Versioned evidence', v: 'Model version, input window and result are retained' },
      { k: 'Reviewable insight', v: 'Traceable to its inputs by engineers and PMG' },
    ],
  },
  interfaces: {
    name: 'Approved interfaces',
    role: 'Agreed with the vehicle program',
    items: [
      { k: 'PMG · vehicle software', v: 'Adds departure, journey and service context; prepares permitted recommendations and verifies outcomes', tone: 'pmg' },
      { k: 'Evo Core', v: 'Approved power and thermal coordination interfaces', tone: 'evo' },
      { k: 'Module owner & engineering', v: 'Reviewable insight and evidence for investigations', tone: 'ref' },
    ],
  },
  read: 'Permitted signals · read-only',
  insight: 'Approved insight · confidence · version',
  blocked: 'Model output does not override protection or operating limits',
  request: 'Permitted requests — such as approved charge scheduling or preconditioning — run through existing vehicle control and stay inside validated limits.',
  legend: [
    { k: 'reference', t: 'Validated vehicle system · keeps authority' },
    { k: 'battery', t: 'Battery AI concept' },
    { k: 'interface', t: 'Approved interface' },
  ],
};

export const INTERFACES = {
  title: 'Module & vehicle interfaces',
  caption: 'Proposed interfaces for a first concept. Exact signals, directions and owners are agreed per pack and vehicle program.',
  rows: [
    { name: 'Pack & BMS → Battery AI', dir: 'In · read-only', crosses: 'Permitted cell voltages, pack current, temperatures, operating and charging history, validated battery-state estimates and limits', boundary: 'Only the signals the selected pack and reference system actually provide' },
    { name: 'Vehicle & charging context → Battery AI', dir: 'In', crosses: 'Charger / session status and, through PMG, departure intent', boundary: 'Subject to approved interfaces and customer permissions' },
    { name: 'Battery AI → PMG', dir: 'Out', crosses: 'Approved insight: health trends, charging readiness and thermal context, each with confidence and version', boundary: 'PMG prepares permitted recommendations; validated control and safety functions keep their authority' },
    { name: 'Battery AI → Evo Core', dir: 'Out', crosses: 'Approved insight for power and thermal coordination', boundary: 'Cell sensing, protection and balancing hardware keep defined ownership' },
    { name: 'Battery AI → module owner & engineering', dir: 'Out', crosses: 'Reviewable insight and retained evidence', boundary: 'Sharing beyond the vehicle is optional and permission-governed' },
  ],
};

/* ---------- Possible deployment locations ---------- */

export const DEPLOYMENT = {
  eyebrow: 'Possible deployment locations',
  title: 'Packaging can follow the customer.',
  lead: 'A first pilot can use existing module hardware. A later product could license the embedded runtime, integrate with a partner’s BMS or share suitable compute within Evo Core.',
  pilot: {
    tag: 'First pilot',
    name: 'Existing module hardware',
    body: 'Run on the BMS or adjacent module compute the selected pack already has, where access and resources allow.',
    needs: 'Signal access, plus memory and compute headroom on the existing hardware',
  },
  later: [
    { tag: 'Later product option', name: 'Licensed embedded runtime', body: 'License the runtime for a supplier’s or OEM’s own module compute.', needs: 'Runtime fit on the target compute, integration and support terms' },
    { tag: 'Later product option', name: 'Partner BMS integration', body: 'Integrate with a partner’s BMS, which keeps sensing, balancing, operating limits and protection.', needs: 'An interface agreement, timing and isolation evidence, validation with the BMS supplier' },
    { tag: 'Later option · Evo Core roadmap', name: 'Shared compute within Evo Core', body: 'Share suitable compute within Evo Core, where the runtime is a proposed Gen 2 extension after Gen 1 evidence.', needs: 'Compute partitioning, feasibility and qualification of the shared platform' },
  ],
  rule: 'Each deployment needs its own feasibility and validation. The decision follows measurement of latency, memory, compute and isolation requirements.',
};

/* ---------- Signal & data requirements ---------- */

export const DATA_HEAD = {
  eyebrow: 'Signal & data requirements',
  title: 'What the runtime reads, and what the proof needs',
  lead: 'The first concept uses the interfaces the selected pack actually provides. Each capability depends on specific signals, so access decides scope before any model work starts.',
  caption: 'Signals each proposed capability would read. Availability is confirmed per pack and vehicle program.',
  evalTitle: 'Needed for evaluation, not read by the runtime',
};

/* ---------- Edge runtime, confidence & failure handling ---------- */

export const RUNTIME = {
  eyebrow: 'Edge runtime · confidence & failure handling',
  title: 'Every result carries its confidence, or says the data is insufficient.',
  lead: 'The runtime evaluates a bounded model locally, so its defined behaviour does not depend on a cloud connection. Data quality is checked before inference, and each result keeps its confidence, model version and evidence.',
  input: 'Input window',
  gate: { name: 'Data-quality check', body: 'Missing, stale or implausible inputs are caught before inference.' },
  model: { name: 'Bounded model', body: 'Evaluates only within its defined inputs and operating range.' },
  routes: [
    { trigger: 'Input window', triggerNote: 'Complete and plausible', check: 'Pass', model: 'Runs', code: 'INSIGHT', name: 'Insight with confidence', body: 'An estimate or pattern with its confidence and model version, shared through the approved interface.' },
    { trigger: 'Input window', triggerNote: 'Missing, stale or implausible', check: 'Fail', model: 'Not run', code: 'INSUFFICIENT_DATA', name: 'Insufficient data', body: 'An explicit state instead of a guess. No estimate is issued until the data supports one.' },
    { trigger: 'Runtime unavailable', triggerNote: 'Stopped or not responding', check: 'Not reached', model: 'Not reached', code: 'LOCAL_FALLBACK', name: 'Local fallback', body: 'The BMS and its existing estimates continue unchanged. Nothing protective depends on the model.' },
  ],
  evidence: { name: 'Versioned evidence record', items: ['Input window', 'Data-quality state', 'Model version', 'Result & confidence', 'Later outcome'] },
};

/* ---------- Potential outcomes ---------- */

export const OUTCOMES = {
  eyebrow: 'Potential customer & OEM outcomes',
  title: 'Start with a moment. Follow the value.',
  lead: 'Two candidate scenarios show the module intelligence, the role of PMG and the outcomes a pilot should measure.',
  ids: ['battery', 'charging'] as const,
  validate: {
    customer: 'Clearer battery-health information, useful charging guidance and better-informed service planning.',
    oem: 'Better evidence for health and event investigations, reviewable service decisions and reusable embedded intelligence across agreed reference programs.',
  },
};

/* ---------- Limitations & false alerts ---------- */

export const LIMITS = {
  eyebrow: 'Technical limitations',
  title: 'What the software cannot do on its own',
  items: [
    { t: 'It does not replace the BMS.', b: 'Sensing, balancing, operating limits and protection keep defined ownership. A future commonized controller would need its own complete architecture and qualification.' },
    { t: 'It cannot create independent charging paths for each cell.', b: 'Cell-level decisions are constrained by the pack’s electrical topology, sensing, balancing and power hardware. The first concept uses the interfaces the selected pack actually provides.' },
    { t: 'It can only interpret what the pack exposes.', b: 'Where cell-level signals are not accessible, cell-pattern evaluation is not possible. Capability follows signal access.' },
    { t: 'Battery-life and range gains are not claimed.', b: 'They are potential outcomes to investigate. A pilot must compare independent health measurements and energy or readiness outcomes with the existing system.' },
    { t: 'Model error is part of the result.', b: 'Estimates are judged on held-out batteries and conditions, with model errors and integration cost included in the comparison.' },
    { t: 'The runtime has to fit the module.', b: 'Latency, memory, compute and isolation are measured on the target hardware before a deployment decision.' },
  ],
  falseAlerts: {
    title: 'False-alert considerations',
    lead: 'An alert costs attention — from a driver, a technician or an engineering team. The pilot counts that cost.',
    items: [
      'Every alert is reviewed as actionable or false against known events and service evidence.',
      'False recommendations and customer overrides are counted as results.',
      'Insufficient data produces an explicit state, not an alert.',
      'Investigation effort is part of the cost: an alert that takes hours to dismiss is expensive.',
      'Alert performance is judged on batteries and conditions excluded from model development.',
    ],
  },
};

/* ---------- First pilot ---------- */

export const FIRST_PROOF = {
  eyebrow: 'The first battery proof · pilot requirements',
  title: 'Choose one pack. Answer one useful question.',
  lead: 'Choose one pack and one useful health or charging question. Use independent reference measurements, batteries and operating conditions held out of model development, and an agreed comparison with the existing system. Measure error, false alerts, runtime resources and the complete integration cost.',
  gates: [
    { n: '01', name: 'Baseline', body: 'Define existing estimation, diagnostic performance and the cost of the problem.', out: 'An agreed baseline' },
    { n: '02', name: 'Data', body: 'Agree sensing access, timestamps, reference labels and independent measurements.', out: 'An approved, labelled dataset' },
    { n: '03', name: 'Runtime', body: 'Evaluate accuracy, memory, latency, compute and local fallback behaviour.', out: 'Runtime measured on target hardware' },
    { n: '04', name: 'Outcome', body: 'Verify an actionable advantage and the complete integration, validation and support cost.', out: 'A decision to narrow, extend or scale' },
  ],
  bring: {
    title: 'What a pilot partner brings',
    items: [
      'One reference pack and access to its BMS signals',
      'An accountable owner and one useful health or charging question',
      'Approved test data with timestamps and reference labels',
      'Independent reference measurements and test access',
    ],
  },
};

/* ---------- Model evaluation ---------- */

export const EVALUATION = {
  eyebrow: 'Model evaluation metrics',
  title: 'Measured on batteries the model has never seen',
  lead: 'Every measure is compared with the existing estimation, diagnostic and control methods. Targets are agreed with the partner against the baseline.',
  caption: 'Proposed evaluation measures for a first pilot. No results are claimed before this comparison exists.',
  rows: [
    { m: 'Held-out estimation error', shows: 'How far health and state estimates sit from independent measurements', how: 'On batteries and operating conditions excluded from model development' },
    { m: 'Actionable alerts', shows: 'Alerts that led to a useful finding or action', how: 'Reviewed against known events and service evidence' },
    { m: 'False alerts & recommendations', shows: 'The cost of acting on wrong output', how: 'Counted per alert and recommendation, with the effort to dismiss each one' },
    { m: 'Customer overrides', shows: 'Whether recommendations fit real use', how: 'Override rate on readiness and charging recommendations' },
    { m: 'Verified readiness', shows: 'Whether the vehicle was ready when it was needed', how: 'Departure-readiness and charging-completion outcomes, compared with today’s behaviour' },
    { m: 'Limit compliance', shows: 'Whether available-power estimates stay inside BMS limits', how: 'Every estimate checked against the validated operating limits' },
    { m: 'Investigation effort', shows: 'Engineering time per issue', how: 'Time to isolate a known cause, with and without the evidence' },
    { m: 'Complete cost', shows: 'What adoption really takes', how: 'Integration, validation and support cost, alongside model errors' },
  ],
  runtime: {
    title: 'Runtime, latency, memory & compute validation',
    lead: 'Measured on the target hardware, next to the BMS’s own validated functions, before any deployment decision.',
    items: [
      { k: 'Latency', v: 'Time from an input window to a usable result' },
      { k: 'Memory', v: 'Model, buffers and evidence within the module’s available memory' },
      { k: 'Compute', v: 'Processor load alongside existing BMS tasks' },
      { k: 'Isolation', v: 'Separation from validated BMS functions in timing and memory' },
      { k: 'Local fallback', v: 'Defined behaviour when the runtime stops or data is insufficient' },
    ],
  },
};

/* ---------- Questions, references, download ---------- */

export const BATTERY_FAQ = {
  eyebrow: 'Common questions',
  title: 'An intelligence layer with a clear engineering scope',
  items: [
    { q: 'Does this replace the BMS?', a: 'The initial concept adds evaluated intelligence alongside the validated BMS. Sensing, balancing, operating limits and protection retain defined ownership. A future commonized controller would need its own complete architecture and qualification.' },
    { q: 'Can AI charge every cell independently?', a: 'AI alone does not create independently controlled charging paths. Cell-level decisions are constrained by the pack’s electrical topology, sensing, balancing and power hardware. The first concept uses the interfaces the selected pack actually provides.' },
    { q: 'Will this increase battery life or driving range?', a: 'These are potential outcomes to investigate, rather than established results. A pilot must compare independent health measurements and energy/readiness outcomes with the existing system, while including model errors and integration cost.' },
    { q: 'Where will the model run?', a: 'On suitable BMS, module or adjacent vehicle compute, depending on access and resource needs. The deployment decision follows measurement of latency, memory, compute and isolation requirements.' },
  ],
};

export const REFERENCES = {
  eyebrow: 'Technical context · independent sources',
  note: 'Industry references establish the sensing and control foundations; published research explores efficient ML-based battery-health estimation. These sources provide context and do not validate Mathsya’s proposed product.',
  items: [
    { source: 'Texas Instruments · industry overview', title: 'BMS sensing, monitoring & control', href: 'https://www.ti.com/applications/automotive/hev-ev-powertrain/hev-ev-battery-management-system-bms/overview.html' },
    { source: 'arXiv 2406.06151 · published research', title: 'Efficient online battery SoH estimation', href: 'https://arxiv.org/abs/2406.06151' },
  ],
  download: {
    href: '/assets/Battery-AI-Program-Overview.md',
    title: 'Battery & Charging AI program overview',
    body: 'Product role, capabilities to evaluate, first proof, engineering scope and the proposed commercial path.',
  },
};

export const BATTERY_CTA = {
  eyebrow: 'Build the first proof',
  title: 'Start with a battery question.\nBuild a measurable answer.',
  body: 'Discuss available signals, a reference pack and a useful health or charging outcome.',
};
