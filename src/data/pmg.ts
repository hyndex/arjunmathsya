// /pmg copy. Sources: docs/editing-pack-2026-10-20.md (section 05), docs/legacy-source/pmg.txt, app.js (workflows), modules.js and
// public/assets/PMG-Program-Overview.md. PMG_POC / POC_NOTE / BOUNDARIES are imported from the shared data.
import { PRODUCTS } from '@/data/products';

export const PMG_META = {
  title: 'Proactive Mobility Guardian (PMG)',
  description:
    'PMG is vehicle software that joins module insight with journey and customer context, requests only permitted actions and verifies the outcome. Optional SaaS.',
};

export const PMG_HERO = {
  eyebrow: 'PMG / Vehicle software + optional SaaS',
  lines: ['Connect the insight.', 'Make it useful.'],
  lead: 'Proactive Mobility Guardian is Mathsya’s vehicle software direction. PMG connects selected module insights with vehicle, journey and customer context, prepares permitted recommendations and verifies the outcome.',
  stage: PRODUCTS.pmg.stage,
};

/** Hero schematic: where PMG runs. */
export const PMG_STACK = {
  cloud: { name: 'Optional OEM & fleet services', note: 'Off-vehicle · cloud / SaaS · authorized evidence only' },
  boundary: 'Vehicle boundary',
  pmg: { name: 'PMG vehicle software', parts: ['Vehicle context', 'Policy checks', 'Focused history', 'Verification'] },
  host: { name: 'Suitable vehicle compute', options: ['Gateway', 'Telematics unit', 'Central computer'], note: 'Selected for the reference architecture' },
  iface: 'Approved vehicle interfaces',
  modules: [
    { id: 'battery', name: PRODUCTS.battery.name },
    { id: 'evo', name: PRODUCTS.evo.name },
    { id: 'other', name: 'Other vehicle modules' },
  ],
  caption: 'Schematic concept illustration · PMG is software on existing vehicle compute, not a hardware unit',
};

/* ---------- Signature: software flow ---------- */

export type WorkflowId = 'charging' | 'quality' | 'incident';
export const FLOW_STAGES = ['Module event', 'Vehicle context', 'Decision policy', 'Permitted recommendation', 'Verified result'] as const;
export const FLOW_NOTE = 'Actions depend on approved interfaces and customer permissions. Certified vehicle safety functions remain authoritative.';
export const FLOW_LOOP = 'Recorded in vehicle memory: what helped, with versions and context';

type Stage = { title: string; body: string };
export const PMG_WORKFLOWS: Record<
  WorkflowId,
  { tab: string; number: string; title: string; intro: string; source: 'battery' | 'module' | 'reference'; sourceLabel: string; stages: [Stage, Stage, Stage, Stage, Stage]; proof: string }
> = {
  charging: {
    tab: 'Charging readiness',
    number: '01 / 03',
    title: 'Prepare for the next journey.',
    intro: 'Combine battery trends, departure intent and charging context into a useful readiness decision.',
    source: 'battery',
    sourceLabel: 'Source · Battery AI',
    stages: [
      { title: 'Understand the battery', body: 'Read available health, charge and thermal trends.' },
      { title: 'Add the journey', body: 'Consider departure time, route and charging opportunities.' },
      { title: 'Check permission and limits', body: 'Confirm the customer’s permission, the approved interface and the permitted charging limits.' },
      { title: 'Request a permitted action', body: 'Recommend a charging plan or approved preconditioning.' },
      { title: 'Verify readiness', body: 'Check the outcome and record what helped.' },
    ],
    proof: 'Useful readiness outcomes, appropriate alerts and low override rates.',
  },
  quality: {
    tab: 'OEM quality',
    number: '02 / 03',
    title: 'Turn a vehicle event into a learning loop.',
    intro: 'Investigate a thermal or pump behaviour change with linked vehicle history and comparable fleet context.',
    source: 'module',
    sourceLabel: 'Source · vehicle module',
    stages: [
      { title: 'Detect behavioural drift', body: 'Compare available signals with the expected operating behaviour.' },
      { title: 'Preserve focused evidence', body: 'Link the event to operating context and hardware/software versions.' },
      { title: 'Share authorized evidence only', body: 'Release relevant evidence under agreed access, consent, retention and ownership.' },
      { title: 'Support the investigation', body: 'Find comparable events and help an engineer test a likely explanation.' },
      { title: 'Verify the correction', body: 'Compare behaviour after an approved fix and record the result.' },
    ],
    proof: 'Evidence completeness, investigation time and recurrence after the correction.',
  },
  incident: {
    tab: 'Incident context',
    number: '03 / 03',
    title: 'Preserve the context when it matters.',
    intro: 'Enrich the established incident and recovery process with available vehicle evidence.',
    source: 'reference',
    sourceLabel: 'Source · certified detection',
    stages: [
      { title: 'Receive an authoritative trigger', body: 'Use the vehicle’s existing certified incident detection.' },
      { title: 'Preserve the event history', body: 'Retain available before-and-after vehicle context.' },
      { title: 'Follow the established process', body: 'The certified trigger stays authoritative; only permitted data enters the incident and recovery process.' },
      { title: 'Prepare the permitted handoff', body: 'Include location, relevant vehicle states and connectivity status.' },
      { title: 'Confirm delivery', body: 'Record acknowledgement or retain evidence until connectivity returns.' },
    ],
    proof: 'Incident-field completeness, offline persistence and acknowledged handoff.',
  },
};

export const WORKFLOWS_INTRO = {
  eyebrow: 'PMG / From signal to outcome',
  title: 'The modules see behaviour. PMG adds the vehicle story.',
  lead: 'A battery-health event is more useful when connected to the planned journey, available charging, customer permissions and a way to verify the outcome.',
  kicker: 'Anticipate · act with permission · verify',
};

/* ---------- Driver-facing interface concept + permissions ---------- */

export const INTERFACE_COPY = {
  eyebrow: 'Worked example · illustrative',
  title: 'A warm battery. An early departure. A useful plan.',
  lead: 'A vehicle arrives after a long drive with a warm battery, plugs in overnight and has a departure planned for 07:30. Battery & Charging AI supplies available condition and confidence information. PMG adds departure intent, charging status and customer permissions. It evaluates guidance or an approved scheduling or preconditioning request, checks the outcome and retains relevant evidence. This is an illustrative workflow for evaluation.',
  label: 'Illustrative interface concept',
  annotations: [
    { n: '1', title: 'Departure intent', body: 'The customer’s planned departure: the intent a readiness plan works towards.' },
    { n: '2', title: 'Readiness plan', body: 'Battery & Charging AI insight joined with journey and charging context by PMG.' },
    { n: '3', title: 'Permitted action, awaiting confirmation', body: 'Requested only through an approved interface and within customer permissions. A declined request counts as an override; low override rates are part of the proof.' },
    { n: '4', title: 'Verified result', body: 'PMG checks the outcome after departure and records what helped, locally.' },
  ],
};

export const PERMISSION_MODEL = [
  { label: 'Agreed first', text: 'Signals, baseline, integration responsibility, customer permissions and acceptance criteria are agreed before a pilot expands its scope.' },
  { label: 'Approved interfaces', text: 'The selected architecture defines which interfaces are available and which requests are permitted.' },
  { label: 'Customer permission', text: 'Recommendations and action requests stay within what the customer has permitted.' },
  { label: 'Authority', text: 'Validated control, protection and safety functions retain authority. Available interfaces and customer permissions determine what PMG may recommend or request.' },
];

/* ---------- Runtime vs optional SaaS ---------- */

export const PMG_DEPLOYMENT = {
  eyebrow: 'Software delivery / commercial options',
  title: 'One runtime in the vehicle, optional services beyond it',
  lead: 'PMG’s embedded runtime and its optional cloud services have different responsibilities and different routes to revenue.',
  runtime: {
    label: 'On the vehicle / software',
    title: 'PMG edge runtime',
    body: 'PMG can run on suitable gateway, telematics or central vehicle compute selected for the reference architecture. It combines approved inputs, retains focused operating context and defines local behaviour for missing data or lost connectivity.',
    hosts: ['Gateway', 'Telematics unit', 'Central computer'],
    tasks: [
      'Combine module events with vehicle and journey context.',
      'Prepare reviewable recommendations and permitted action requests.',
      'Preserve focused history and verify the result locally.',
      'Define behaviour for missing data and lost connectivity.',
    ],
    path: 'Program integration, embedded-software licensing and support.',
  },
  saas: {
    label: 'Off the vehicle / optional SaaS',
    title: 'OEM & fleet learning services',
    body: 'With agreed access and permissions, selected evidence can support OEM quality investigations, service workflows, fleet comparisons and tracking of a correction. These services can have a SaaS or enterprise delivery model; they are separate from the embedded runtime.',
    tasks: [
      'Compare relevant events across permitted vehicles and versions.',
      'Support quality investigations and service decisions.',
      'Track whether a correction reduced the repeat behaviour.',
      'Manage access, consent, retention and data ownership.',
    ],
    path: 'Optional enterprise subscriptions or services where recurring organizational value is demonstrated.',
  },
  note: 'SaaS describes the optional cloud offering. Local vehicle software still needs embedded integration, validation and lifecycle support.',
};

export const RUNTIME_SPEC = [
  {
    label: 'Module interfaces',
    text: 'Health and context events arrive through the approved vehicle network from Battery & Charging AI, Evo Core or other vehicle modules. PMG can start with existing module data. Exact APIs, network, memory, latency and compute are established in the integration proof.',
  },
  {
    label: 'Local operation & offline behaviour',
    text: 'Missing data and lost connectivity each have a defined local response, and the runtime’s local behaviour does not require the cloud. In the incident workflow, evidence is retained until connectivity returns.',
  },
  {
    label: 'Evidence & versioning',
    text: 'Each event is linked to its operating context and hardware/software versions, with focused history retained, so it can be compared across a permitted population and checked again after an approved correction.',
  },
];

export const PMG_DELIVERY = [
  { label: 'Paid integration', text: 'Program integration with an OEM, supplier or fleet partner, starting with a scoped software PoC.' },
  { label: 'Embedded licensing & support', text: 'Licensing and lifecycle support for the vehicle runtime.' },
  { label: 'Optional enterprise services', text: 'Subscriptions or services for OEM and fleet learning, where recurring organizational value is demonstrated.' },
];
export const PMG_DELIVERY_NOTE = 'Proposed commercial path. No achieved performance, signed contracts or released pricing is claimed.';

/* ---------- Module applications (modules.js) ---------- */

export type ModuleAppId = 'battery' | 'power' | 'connectivity';
export const MODULES_INTRO = {
  eyebrow: 'Explore the value chain',
  title: 'One intelligence direction, different module problems',
  lead: 'Select an illustrative application to see how module observations could support a vehicle outcome and an organizational measure.',
  entryTitle: 'One proposed coordination layer. Several ways to enter.',
  entryBody: 'PMG can start with existing module data and approved vehicle interfaces. Battery AI and Evo Core add portfolio-specific capabilities as they are independently validated; adopting PMG does not require every module to be replaced.',
  note: 'Candidate workflows, not measured product results.',
};
export const PMG_MODULE_APPS: Record<ModuleAppId, { tab: string; accent: 'battery' | 'evo' | 'pmg'; title: string; signals: string; module: string; vehicle: string; organization: string; proof: string }> = {
  battery: {
    tab: 'Battery & charging',
    accent: 'battery',
    title: 'Battery & charging readiness',
    signals: 'Available charge, health and temperature trends, combined with departure and charging context.',
    module: 'Interpret trends and flag unusual behaviour for an approved readiness or service decision.',
    vehicle: 'Support useful charging plans and departure readiness.',
    organization: 'Evaluate alert usefulness, repeat issues and the evidence available to quality and service teams.',
    proof: 'Readiness usefulness, false alerts, override rate and attributable investigation effort.',
  },
  power: {
    tab: 'EV power & thermal',
    accent: 'evo',
    title: 'EV power & thermal context',
    signals: 'Available power-stage, temperature, cooling and operating-mode observations.',
    module: 'Explore health and thermal-pattern inference alongside validated control and protection.',
    vehicle: 'Inform permitted charging and cooling recommendations.',
    organization: 'Evaluate fault-investigation time and verified energy, thermal or service value.',
    proof: 'Signal and interface feasibility, inference resource needs, false alerts and measured net value.',
  },
  connectivity: {
    tab: 'Connected functions',
    accent: 'pmg',
    title: 'Connected functions & telematics',
    signals: 'Remote-function events, connectivity transitions, positioning context and release information.',
    module: 'Link intermittent behaviour to operating context and software or hardware versions.',
    vehicle: 'Support clearer diagnosis of unreliable connected experiences.',
    organization: 'Give engineering and quality teams focused evidence for release and field investigations.',
    proof: 'Evidence completeness, localization time and recurrence after an approved correction.',
  },
};

/* ---------- Value ---------- */

export const PMG_VALUE = {
  eyebrow: 'Customer value / OEM value',
  title: 'A recommendation is useful when the outcome is verified.',
  groups: [
    {
      id: 'customers',
      label: 'For customers',
      title: 'Readiness, clarity and care.',
      body: 'Evaluate charging guidance that fits the next journey, understandable recommendations and better-informed service planning.',
      measures: ['Readiness', 'Recommendation acceptance', 'False alerts', 'Avoidable repeat diagnosis'],
    },
    {
      id: 'oems',
      label: 'For OEMs & fleets',
      title: 'Evidence that can travel.',
      body: 'Evaluate events linked to operating context and hardware or software versions, comparable investigation evidence and verification after an approved correction.',
      measures: ['Evidence completeness', 'Investigation time', 'Recurrence', 'Attributable operating or warranty cost'],
    },
  ],
  compare: 'Each measure is compared with existing diagnostics and workflows.',
};

/* ---------- Proof plan ---------- */

export const PMG_PROOF = {
  eyebrow: 'Development with decision gates',
  title: 'A scoped first proof, in four gates',
  lead: 'A proposed 12–16 week PMG software PoC begins after partner, approved data and test access are agreed. Define the baseline, connect the runtime, evaluate a controlled workflow and decide the next paid program. Battery model development and Evo Core hardware require separately scoped work.',
  position: [
    { label: 'Current position', text: 'Architecture and use-case definition' },
    { label: 'Next proof', text: 'Bench integration and controlled evaluation' },
    { label: 'Follow-on decision', text: 'Productization, qualification and rollout' },
  ],
  download: {
    href: '/assets/PMG-Program-Overview.md',
    label: 'Download the PMG overview',
    meta: 'Markdown · program overview',
    body: 'Product role, embedded runtime, optional cloud, candidate workflows, first proof and commercial path.',
  },
};

/* ---------- Limits + FAQ ---------- */

export const PMG_LIMITS = [
  'Exact APIs, network, memory, latency and compute are established in the integration proof.',
  'Missing data and lost connectivity need a defined local response; local behaviour cannot depend on the cloud.',
  'The optional cloud needs agreed access, consent, retention, security and ownership.',
  'Local vehicle software still needs embedded integration, validation and lifecycle support, whether or not the cloud is used.',
  'A pilot must show an incremental advantage over existing diagnostics and service workflows.',
  'Battery AI model development and Evo Core hardware need separately scoped paths; they are not part of the PMG PoC.',
];

export const PMG_FAQ = [
  {
    q: 'Is PMG a hardware product?',
    a: 'PMG is a software product direction. It runs on suitable vehicle compute and can connect to optional cloud services. Evo Core is the portfolio’s EV power-hardware platform; Battery & Charging AI is a module software product.',
  },
  {
    q: 'Does PMG control everything in the car?',
    a: 'No. Validated control, protection and safety functions retain authority. Available interfaces and customer permissions determine what PMG may recommend or request; PMG coordinates context and evaluates outcomes within the approved scope.',
  },
  {
    q: 'What makes this different from today’s diagnostics?',
    a: 'The intended addition is a connected evidence loop: local behavioural insight, vehicle and customer context, a permitted response and verification after the response. The pilot must show an incremental advantage over existing diagnostics and service workflows.',
  },
  {
    q: 'What is the first adoption path?',
    a: 'Choose one valuable vehicle workflow with an OEM, supplier or fleet partner. Agree signals, the baseline, integration responsibility, customer permissions and acceptance criteria before expanding the scope.',
  },
];

export const PMG_CTA = {
  title: 'Choose a vehicle workflow.\nConnect it to an outcome.',
  body: 'Start with charging readiness, a known quality issue or a focused service-evidence case.',
};
