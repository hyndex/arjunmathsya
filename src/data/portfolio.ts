// Shared portfolio content used by several pages. Source: legacy portfolio-data.js, evo-core, pmg, investors pages.

export type BenefitId = 'battery' | 'charging' | 'thermal' | 'service';

/** Four illustrative customer + OEM scenarios ("Start with a moment. Follow the value."). */
export const BENEFITS: Record<
  BenefitId,
  { tab: string; number: string; title: string; scene: string; signals: string; module: string; pmg: string; customer: string; oem: string; proof: string; focus: 'battery' | 'evo' | 'pmg' }
> = {
  battery: {
    tab: 'Battery care',
    number: '01 / Battery care',
    title: 'Understand the battery behind the percentage.',
    scene: 'A driver sees a charge percentage. The useful question is whether the battery is ready for the next journey, and whether its behaviour is changing.',
    signals: 'Available cell voltages, pack current, temperatures, charging history and validated battery-state estimates.',
    module: 'Battery AI evaluates health trends and unusual behaviour, with confidence and data-quality checks.',
    pmg: 'PMG adds departure, journey and service context, then prepares a permitted recommendation and checks its outcome.',
    customer: 'Clearer battery-health guidance and a charging or service decision that fits the next journey.',
    oem: 'Evidence to investigate degradation patterns, review service decisions and identify repeat issues.',
    proof: 'Held-out state-estimation error, actionable alerts, false alerts, customer overrides and independently verified health outcomes.',
    focus: 'battery',
  },
  charging: {
    tab: 'Charging readiness',
    number: '02 / Charging readiness',
    title: 'Turn a charging session into journey readiness.',
    scene: 'The battery is warm after a long drive. A departure is planned for the morning. Charging, cooling and customer intent need a coordinated response.',
    signals: 'Available charge state, battery temperature, permitted charge limits, charger/session status and departure intent.',
    module: 'Battery and charging intelligence evaluates readiness and unusual session behaviour within approved charging limits.',
    pmg: 'PMG combines the module insight with the next journey, requests approved scheduling or preconditioning, and confirms the result.',
    customer: 'A useful readiness plan, clearer charging guidance and fewer avoidable surprises to test.',
    oem: 'Context for session failures, support calls and recurring interoperability or thermal issues.',
    proof: 'Departure-readiness rate, charging completion, attributable energy use, false recommendations and support effort.',
    focus: 'battery',
  },
  thermal: {
    tab: 'Power & thermal',
    number: '03 / Power & thermal',
    title: 'See a change in behaviour before it becomes a service mystery.',
    scene: 'A power module runs warmer than expected under a comparable load. Is it a new operating condition, a cooling issue or a component trend?',
    signals: 'Accessible power, temperature, cooling-command and operating-mode trends, with hardware/software versions.',
    module: 'Evo Core’s supervisory AI compares operating patterns and flags a reviewable change in module behaviour.',
    pmg: 'PMG adds vehicle history and journey context, then routes a permitted notification or service recommendation.',
    customer: 'More useful explanations of power or thermal limitations and better-informed service planning.',
    oem: 'Focused evidence for component, cooling and calibration investigations across comparable vehicles.',
    proof: 'Detection lead time on known cases, false alerts, unnecessary interventions, thermal outcomes and investigation hours.',
    focus: 'evo',
  },
  service: {
    tab: 'OEM quality & service',
    number: '04 / OEM quality & service',
    title: 'Make every relevant event a better investigation.',
    scene: 'A repeat issue appears across releases or vehicles. Quality and service teams need comparable evidence and a way to verify the correction.',
    signals: 'Approved module events, operating context, diagnostics, software/hardware versions and repair outcomes.',
    module: 'Local intelligence preserves focused evidence about the behaviour that changed.',
    pmg: 'PMG links the event to vehicle context; optional cloud services compare authorized fleet evidence and track the correction.',
    customer: 'A clearer service recommendation and less repeated diagnosis to validate.',
    oem: 'Faster evidence-led triage, reviewable warranty decisions and measurable learning after a fix.',
    proof: 'Time to isolate a known cause, evidence completeness, no-fault-found rate, recurrence and attributable total cost.',
    focus: 'pmg',
  },
};

export const BENEFIT_NOTE =
  'Illustrative workflows. Outcomes depend on data access, integration and evaluation against the existing system; no achieved savings or battery-life gains are claimed.';

export type GenId = 'gen1' | 'gen2' | 'gen3';

/** Evo Core proposed generation roadmap. */
export const GENERATIONS: Record<
  GenId,
  { n: 1 | 2 | 3; short: string; label: string; number: string; title: string; intro: string; integrated: string[]; connected: string[]; method: string; customer: string; oem: string; gate: string; boundary: string }
> = {
  gen1: {
    n: 1,
    short: 'Gen 1',
    label: 'Charging & power',
    number: 'Gen 1 / Charging & power',
    title: 'Establish the power backbone.',
    intro: 'A first Evo Core architecture brings onboard charging, low-voltage conversion, charging communication and high-voltage distribution under a coordinated control foundation.',
    integrated: ['OBC · onboard charging', 'DC/DC · low-voltage conversion', 'EVCC · charging communication', 'HV distribution / junction functions', 'Common control + Edge AI supervision'],
    connected: ['Existing BMS and its permitted limits', 'PMG vehicle software', 'Vehicle cooling and diagnostics interfaces'],
    method: 'Start with controller and interface commonization. Retain, adapt or develop power stages according to the reference design; a single housing is a separate packaging decision.',
    customer: 'Evaluate charging readiness, clearer power-system diagnostics and consistent operating behaviour.',
    oem: 'Test controller/interface simplification, reusable software and the complete integration cost case.',
    gate: 'Bench proof of interfaces, operating modes, timing and fault response, plus a bottom-up cost comparison.',
    boundary: 'Working first-generation scope. Ratings, topology, packaging and qualification are defined with the reference program.',
  },
  gen2: {
    n: 2,
    short: 'Gen 2',
    label: 'Battery & thermal',
    number: 'Gen 2 / Battery & thermal',
    title: 'Connect energy conversion to battery intelligence.',
    intro: 'Extend a proven Gen 1 foundation with battery-state context, Battery & Charging AI and broader battery/power thermal coordination.',
    integrated: ['Proven Gen 1 power foundation', 'Battery & Charging AI runtime', 'Battery supervisory coordination', 'Battery / power thermal orchestration', 'DC-session and bidirectional functions · options'],
    connected: ['Cell monitors and validated BMS protection', 'Pumps, fans and thermal controllers', 'PMG journey and service context'],
    method: 'Share approved battery information and supervisory decisions with the power platform. Cell sensing, protection and balancing hardware keep defined ownership. DC-session support and V2L/V2G require their own compatible interfaces and power hardware.',
    customer: 'Evaluate better charging guidance, thermal readiness and useful battery-health recommendations.',
    oem: 'Test reuse of battery/power evidence, coordinated calibration and reduced investigation effort.',
    gate: 'Battery data and runtime proof, controlled thermal tests, and qualification of every added charging or bidirectional function.',
    boundary: 'Proposed extension after Gen 1 evidence. Software commonization alone does not provide bidirectional power or replace cell-monitor hardware.',
  },
  gen3: {
    n: 3,
    short: 'Gen 3',
    label: 'Energy & propulsion',
    number: 'Gen 3 / Energy & propulsion',
    title: 'Scale toward coordinated vehicle energy.',
    intro: 'Explore a wider energy platform linking the Gen 2 foundation to propulsion and other vehicle energy demands, while PMG connects outcomes at vehicle level.',
    integrated: ['Proven Gen 2 power / battery foundation', 'Wider energy-supervision runtime', 'Inverter supervisory functions · option', 'Shared compute / packaging · subject to feasibility', 'Reusable product and diagnostic interfaces'],
    connected: ['Validated motor-drive control and protection', 'Vehicle climate / thermal controllers', 'PMG + authorized OEM learning services'],
    method: 'Expand supervisory coordination through approved interfaces. Select any inverter-control commonization or physical power-stage integration only after compute, isolation, thermal and validation feasibility is demonstrated.',
    customer: 'Evaluate consistent energy decisions across charging, propulsion, thermal demand and the planned journey.',
    oem: 'Test reuse across vehicle programs, manageable variant complexity and the economics of broader integration.',
    gate: 'Mixed-function timing and isolation proof, system thermal/EMC evidence, fault-containment tests and a validated program business case.',
    boundary: 'Longer-term concept. It is not a commitment to replace every vehicle controller or combine every power stage in one unit.',
  },
};

/** Function-by-function integration matrix. `core` marks proposed core/extension scope; `future` marks options. */
export type MatrixCell = { text: string; kind: 'core' | 'extension' | 'retained' | 'interface' | 'owned' | 'option' | 'future' };
export const MATRIX: { fn: string; cells: [MatrixCell, MatrixCell, MatrixCell] }[] = [
  { fn: 'OBC / DC/DC / EVCC / HV distribution', cells: [{ text: 'Core scope', kind: 'core' }, { text: 'Retained foundation', kind: 'retained' }, { text: 'Retained foundation', kind: 'retained' }] },
  { fn: 'Common control + module-health AI', cells: [{ text: 'Core scope', kind: 'core' }, { text: 'Extended', kind: 'extension' }, { text: 'Extended', kind: 'extension' }] },
  { fn: 'Battery & Charging AI runtime', cells: [{ text: 'Connected product option', kind: 'interface' }, { text: 'Proposed extension', kind: 'extension' }, { text: 'Retained / extended', kind: 'retained' }] },
  { fn: 'Battery supervisory context', cells: [{ text: 'BMS interface', kind: 'interface' }, { text: 'Limited BMS coordination', kind: 'extension' }, { text: 'Wider energy context', kind: 'extension' }] },
  { fn: 'Cell sensing, balancing & protection', cells: [{ text: 'Validated BMS ownership', kind: 'owned' }, { text: 'Defined BMS ownership', kind: 'owned' }, { text: 'Defined BMS ownership', kind: 'owned' }] },
  { fn: 'Battery / power thermal coordination', cells: [{ text: 'Selected interfaces', kind: 'interface' }, { text: 'Proposed extension', kind: 'extension' }, { text: 'Wider coordination', kind: 'extension' }] },
  { fn: 'DC-session / V2L / V2G functions', cells: [{ text: 'Reference-program decision', kind: 'option' }, { text: 'Options requiring compatible hardware', kind: 'option' }, { text: 'Options requiring validation', kind: 'option' }] },
  { fn: 'Inverter / propulsion supervision', cells: [{ text: 'External vehicle interface', kind: 'interface' }, { text: 'External vehicle interface', kind: 'interface' }, { text: 'Future option', kind: 'future' }] },
  { fn: 'Climate / vehicle thermal controllers', cells: [{ text: 'Defined interfaces', kind: 'interface' }, { text: 'Coordinated interfaces', kind: 'interface' }, { text: 'Wider coordinated interfaces', kind: 'interface' }] },
  { fn: 'PMG vehicle software', cells: [{ text: 'Connected software layer', kind: 'interface' }, { text: 'Connected software layer', kind: 'interface' }, { text: 'Connected software layer', kind: 'interface' }] },
];
export const MATRIX_NOTE =
  'Proposed scopes, subject to reference-vehicle feasibility, safety architecture and qualification. No released generation specification is claimed. A connected interface does not mean that its power stage, sensing or protection has moved into Evo Core.';

/** Proposed 12–16 week PMG software PoC (starts once partner, approved data and test access are agreed). */
export const PMG_POC = [
  { gate: 'Gate 01', weeks: 'Weeks 0–2', title: 'Define the baseline', body: 'Choose a vehicle use case. Confirm signal access, permissions and the customer or business measure.', evidence: 'An agreed pilot scope' },
  { gate: 'Gate 02', weeks: 'Weeks 2–6', title: 'Connect the system', body: 'Build the read-only pipeline, vehicle memory and policy checks. Demonstrate an approved action on a bench.', evidence: 'A reviewable integration' },
  { gate: 'Gate 03', weeks: 'Weeks 6–10', title: 'Close the loops', body: 'Exercise readiness, one quality case and incident context using replay, simulation and controlled tests.', evidence: 'Traceable outcomes' },
  { gate: 'Gate 04', weeks: 'Weeks 10–16', title: 'Earn the next stage', body: 'Evaluate usefulness, intervention behaviour and economics. Decide whether to narrow, extend or scale.', evidence: 'A measured value case' },
] as const;
export const POC_NOTE =
  'A proposed 12–16 week PMG software PoC, beginning when the partner, approved data and test access are in place. It is not a production-hardware delivery promise; Evo Core follows a separate hardware realization and qualification path.';

/** Evo Core hardware development path (separate from the software PoC). */
export const HARDWARE_GATES = [
  { n: '01', title: 'Reference', body: 'Vehicle scope, power ratings, interfaces, retained functions and responsibilities.' },
  { n: '02', title: 'Bench', body: 'Controlled modes, interface timing, fault response and AI runtime feasibility.' },
  { n: '03', title: 'Prototype', body: 'Power-stage realization, cooling, packaging, EMC and a complete cost model.' },
  { n: '04', title: 'Qualify', body: 'Partner-defined vehicle integration, qualification and lifecycle readiness.' },
] as const;

/** The proof approach used site-wide ("Make one use case work. Then earn the next."). */
export const PROOF_PATH = [
  { n: '01', title: 'Identify a useful problem', body: 'A customer or engineering problem with an accountable owner and an outcome worth measuring.' },
  { n: '02', title: 'Agree data & interfaces', body: 'Approved signals, permissions, test access and integration responsibility.' },
  { n: '03', title: 'Establish a baseline', body: 'Today’s detection, readiness or investigation performance — and the cost of the issue.' },
  { n: '04', title: 'Validate a bounded solution', body: 'Edge runtime, reviewable inference and controlled integration before any permitted vehicle action.' },
  { n: '05', title: 'Measure value & full cost', body: 'Incremental value over existing methods, false alerts, resources and the complete adoption cost.' },
  { n: '06', title: 'Decide the next step', body: 'Narrow, extend or scale — and a route to a paid program when the gates are met.' },
] as const;

/** Research & enabling programs (each with its own maturity). */
export const PROGRAMS = [
  { id: 'neural-chain', name: 'Product Neural Chain', stage: 'Concept & PoC definition', summary: 'Evidence-linked lifecycle decisions: requirements, architecture, cost, reuse, validation and field feedback.' },
  { id: 'engineering-intelligence', name: 'Engineering Intelligence', stage: 'Workflow & validation design', summary: 'Link release changes, connected-service tests and system logs to localize failures across releases.' },
  { id: 'solar', name: 'Solar-assisted auxiliaries', stage: 'Research & energy modeling', summary: 'Modest roof solar for a defined low-voltage auxiliary load, with conventional vehicle backup. A separate research track.' },
] as const;
