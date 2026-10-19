import { A, CLOUD_NODES, EVO_PARTS, type V3 } from './anchors';
import type { VehicleState } from './state';

export type LabelKind = 'concept' | 'reference' | 'interface' | 'future';
export type LabelDef = {
  id: string;
  text: string;
  sub?: string;
  kind: LabelKind;
  product?: 'battery' | 'evo' | 'pmg';
  at: V3 | ((s: VehicleState) => V3);
  side?: 'left' | 'right'; // which side the text sits on relative to the anchor dot
  big?: boolean;
};

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const evoPart = (id: keyof typeof EVO_PARTS, lift = 0.03) => (s: VehicleState): V3 => {
  const p = EVO_PARTS[id];
  const e = Math.min(1, Math.max(0, s.explode));
  return add(A.evo, [p.at[0] + (p.ex[0] - p.at[0]) * e, p.at[1] + (p.ex[1] - p.at[1]) * e + lift, p.at[2] + (p.ex[2] - p.at[2]) * e]);
};

export const LABELS: LabelDef[] = [
  // Architecture overview
  { id: 'battery', text: 'Battery system', sub: 'Reference vehicle system', kind: 'reference', at: [-0.45, 0.34, 0.62], side: 'left' },
  { id: 'bms', text: 'Existing BMS', sub: 'Sensing · balancing · protection', kind: 'reference', at: add(A.bms, [0, 0.03, 0]) },
  { id: 'batteryAI', text: 'Battery & Charging AI', sub: 'Software on BMS / adjacent compute', kind: 'concept', product: 'battery', at: A.batteryAI },
  { id: 'evo', text: 'Evo Core', sub: 'Proposed charging & power platform', kind: 'concept', product: 'evo', at: add(A.evo, [0, 0.18, 0]), side: 'left' },
  { id: 'inlet', text: 'Charge inlet', sub: 'Reference vehicle system', kind: 'reference', at: A.inlet },
  { id: 'thermal', text: 'Thermal interfaces', sub: 'Pumps, cooling loops, controllers', kind: 'interface', at: A.pump, side: 'left' },
  { id: 'pmg', text: 'PMG vehicle software', sub: 'On gateway / telematics / central compute', kind: 'concept', product: 'pmg', at: add(A.pmg, [0, 0.16, 0]) },
  { id: 'network', text: 'Approved vehicle networks', sub: 'Defined signals and permissions', kind: 'interface', at: [-0.95, 0.47, 0], side: 'left' },
  { id: 'antenna', text: 'Connected services', sub: 'Optional · permission-governed', kind: 'future', at: add(A.antenna, [0, 0.08, 0]), side: 'left' },
  { id: 'inverter', text: 'Drive inverter & motor', sub: 'Reference vehicle system', kind: 'reference', at: add(A.inverter, [0, 0.06, 0]), side: 'left' },
  { id: 'lv', text: '12 V network', kind: 'reference', at: A.lv },
  // Battery signals
  { id: 'sig-cells', text: 'Cell voltages', kind: 'reference', at: [0.16, 0.36, -0.36] },
  { id: 'sig-current', text: 'Pack current', kind: 'reference', at: [1.12, 0.33, 0.19] },
  { id: 'sig-temp', text: 'Temperatures', kind: 'reference', at: [-0.5, 0.36, 0.36], side: 'left' },
  { id: 'sig-history', text: 'BMS: charging history · state estimates', kind: 'reference', at: add(A.bms, [0, 0.03, 0]) },
  // Evo Core functions (follow the exploded parts)
  { id: 'evo-obc', text: 'OBC', sub: 'AC charging conversion', kind: 'concept', product: 'evo', at: evoPart('obc', 0.06), side: 'left' },
  { id: 'evo-dcdc', text: 'DC/DC', sub: 'HV → low-voltage supply', kind: 'concept', product: 'evo', at: evoPart('dcdc', 0.06) },
  { id: 'evo-evcc', text: 'EVCC', sub: 'Charging communication', kind: 'concept', product: 'evo', at: evoPart('evcc', 0.03) },
  { id: 'evo-hv', text: 'HV distribution', sub: 'Junction & protection paths', kind: 'concept', product: 'evo', at: evoPart('hv', 0.06), side: 'left' },
  { id: 'evo-control', text: 'Common control', sub: 'Shared modes & diagnostics', kind: 'concept', product: 'evo', at: evoPart('control', 0.02) },
  { id: 'evo-ai', text: 'Supervisory intelligence', sub: 'Module-health evaluation, not real-time control', kind: 'concept', product: 'pmg', at: evoPart('ai', 0.02), side: 'left' },
  // Optional organizational learning
  ...CLOUD_NODES.map((n, i): LabelDef => ({
    id: `cloud-${n.id}`,
    text: ['Quality investigations', 'Service evidence', 'Fleet learning', 'Version-aware analysis'][i],
    sub: 'Optional OEM / fleet service',
    kind: 'future',
    at: n.p,
  })),
  { id: 'local', text: 'Local runtime keeps defined behaviour', sub: 'With or without connectivity', kind: 'concept', product: 'pmg', at: add(A.pmg, [0, 0.16, 0]) },
  // Portfolio identities
  { id: 'id-battery', text: 'Battery & Charging AI', sub: 'Embedded module intelligence', kind: 'concept', product: 'battery', at: [-0.2, 0.3, 0.7], big: true, side: 'left' },
  { id: 'id-evo', text: 'Evo Core', sub: 'EV power hardware & embedded software', kind: 'concept', product: 'evo', at: add(A.evo, [0.1, 0.25, 0.2]), big: true },
  { id: 'id-pmg', text: 'Proactive Mobility Guardian', sub: 'Vehicle software & optional services', kind: 'concept', product: 'pmg', at: [0.2, 1.5, 0], big: true },
];
