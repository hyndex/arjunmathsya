import type { V3 } from '@/components/three/anchors';
import type { VehicleState } from '@/components/three/state';

/** Camera + vehicle state per homepage scene. Order must match the [data-scene] sections in index.astro. */
export type SceneKey = {
  id: string;
  title: string; // used by the progress rail
  side: 'left' | 'right' | 'center'; // where the text plate sits on desktop (car is framed on the other side)
  cam: V3;
  target: V3;
  state: Partial<VehicleState>;
  labels: string[];
  tint: string; // studio background tint
};

const xray = { body: 0.04, xray: 0.72, glass: 0.18, systems: 1, wheels: 0.4 };

export const SCENES: SceneKey[] = [
  {
    id: 'arrival',
    title: 'Arrival',
    side: 'left',
    cam: [6.3, 1.45, 6.1],
    target: [0.05, 0.78, 0],
    state: { body: 1, xray: 0, glass: 1, systems: 0 },
    labels: [],
    tint: '#eef3f9',
  },
  {
    id: 'surface',
    title: 'Under the surface',
    side: 'right',
    cam: [3.0, 6.95, 7.9],
    target: [0.3, 0.35, 0],
    state: { ...xray, battery: 0.45, evo: 0.6, network: 0.55, pmg: 0.6, thermal: 0.45, hv: 0.6, pulse: 0.35 },
    labels: ['battery', 'evo', 'inlet', 'pmg:left', 'network', 'antenna', 'inverter'],
    tint: '#eef3f9',
  },
  {
    id: 'battery',
    title: 'The battery',
    side: 'left',
    cam: [2.27, 4.09, 4.34],
    target: [0.1, 0.25, 0],
    state: { ...xray, xray: 0.38, glass: 0.06, battery: 1, hv: 0.35, focus: 'health' },
    labels: ['sig-cells', 'sig-current', 'sig-temp', 'sig-history'],
    tint: '#e8f6ef',
  },
  {
    id: 'battery-ai',
    title: 'Battery intelligence',
    side: 'right',
    cam: [2.16, 4.02, -4.59],
    target: [0.3, 0.3, 0],
    state: { ...xray, xray: 0.35, glass: 0.06, battery: 1, batteryAI: 1, network: 0.45, pmg: 0.4, pulse: 0.6 },
    labels: ['batteryAI', 'bms:left', 'pmg'],
    tint: '#e8f6ef',
  },
  {
    id: 'power',
    title: 'The power system',
    side: 'left',
    cam: [6.0, 2.48, 2.85],
    target: [1.95, 0.45, 0.05],
    state: { ...xray, xray: 0.45, evo: 1, hv: 1, battery: 0.2, explode: 0 },
    labels: ['evo', 'inlet', 'lv', 'thermal'],
    tint: '#fff8ee',
  },
  {
    id: 'evo',
    title: 'Evo Core generations',
    side: 'right',
    cam: [4.55, 2.4, 2.35],
    target: [1.95, 0.72, 0.05],
    state: { ...xray, xray: 0.3, evo: 1, explode: 1, hv: 0.6, battery: 0.25 },
    labels: ['evo-obc', 'evo-dcdc:left', 'evo-evcc', 'evo-hv', 'evo-control', 'evo-ai'],
    tint: '#fff8ee',
  },
  {
    id: 'vehicle',
    title: 'Vehicle intelligence',
    side: 'left',
    cam: [4.98, 6.51, 6.08],
    target: [0.7, 0.62, 0],
    state: { ...xray, network: 1, pmg: 1, pulse: 1, evo: 0.35, battery: 0.35, thermal: 0.4 },
    labels: ['pmg', 'evo', 'thermal', 'inverter:right', 'antenna:right'],
    tint: '#eaf4ff',
  },
  {
    id: 'pmg',
    title: 'The PMG decision',
    side: 'right',
    cam: [4.4, 4.12, -4.83],
    target: [1.0, 0.72, 0],
    state: { ...xray, network: 1, pmg: 1, pulse: 1, battery: 0.5, evo: 0.4 },
    labels: ['pmg:left', 'bms', 'evo:right'],
    tint: '#eaf4ff',
  },
  {
    id: 'cloud',
    title: 'Beyond the vehicle',
    side: 'left',
    cam: [7.1, 7.68, 10.64],
    target: [0.1, 1.8, 0],
    state: { body: 0.5, xray: 0.45, glass: 0.4, systems: 1, network: 0.8, pmg: 1, pulse: 0.7, cloud: 1 },
    labels: ['cloud-quality', 'cloud-service', 'cloud-fleet', 'cloud-versions', 'local'],
    tint: '#f4f8fd',
  },
  {
    id: 'value',
    title: 'The value',
    side: 'right',
    cam: [-6.05, 3.55, 7.3],
    target: [0.15, 0.55, 0],
    state: { body: 0.35, xray: 0.45, glass: 0.35, systems: 1, battery: 0.7, evo: 0.7, pmg: 0.7, network: 0.6, pulse: 0.5 },
    labels: [],
    tint: '#f2f6fb',
  },
  {
    id: 'ecosystem',
    title: 'The portfolio',
    side: 'center',
    cam: [6.34, 2.67, 6.91],
    target: [0, 0.75, 0],
    state: { body: 1, xray: 0, glass: 1, systems: 0 },
    labels: ['id-battery', 'id-evo', 'id-pmg'],
    tint: '#eef3f9',
  },
];
