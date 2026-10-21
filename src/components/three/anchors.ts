// Vehicle frame (metres): front = +X, up = +Y, right = +Z. Axles at x = ±1.48, ground at y = 0.
// The body is the CarConcept model (public/models/concept-ev.glb) rotated and scaled into this frame by Vehicle.tsx.
export type V3 = [number, number, number];

export const CAR = {
  scale: 1.057, // model units → frame (wheelbase 2.80 → 2.96)
  modelAxleMid: 0.09, // model z of the axle midpoint
  axleFront: 1.48,
  axleRear: -1.48,
  wheelR: 0.402,
  track: 1.03, // wheel centre |z|
  nose: 2.46,
  tail: -2.15,
  roof: 1.214,
  halfWidth: 1.344, // body |z| including mirrors (measured from the model)
};

/** World positions of every system in the schematic vehicle. Labels, hotspots and cameras read these. */
export const A = {
  battery: [0, 0.27, 0] as V3, // pack centre, under the cabin
  bms: [0.86, 0.35, 0] as V3,
  batteryAI: [0.86, 0.52, 0] as V3, // software overlay above the BMS
  evo: [1.95, 0.42, 0] as V3, // Evo Core unit centre (front compartment)
  inlet: [1.05, 0.72, 1.17] as V3, // charge inlet on the right front fender
  lv: [2.22, 0.43, -0.52] as V3,
  radiator: [2.36, 0.4, 0] as V3,
  pump: [2.1, 0.3, -0.5] as V3,
  inverter: [-1.48, 0.56, 0] as V3,
  motor: [-1.48, 0.36, 0] as V3,
  pmg: [1.32, 0.62, 0] as V3, // gateway / central compute behind the dashboard
  hmi: [1.12, 0.84, 0] as V3,
  tcu: [-0.35, 1.12, 0] as V3,
  antenna: [-0.5, 1.235, 0] as V3,
  cloud: [0, 3.35, 0] as V3,
};

/** Evo Core sub-functions in the unit's local frame: assembled offset and exploded offset. */
export const EVO_PARTS = {
  housing: { at: [0, 0, 0] as V3, ex: [0, -0.02, 0] as V3 },
  obc: { at: [-0.12, 0.045, -0.05] as V3, ex: [-0.2, 0.17, -0.06] as V3 },
  dcdc: { at: [0.13, 0.045, -0.05] as V3, ex: [0.22, 0.17, -0.06] as V3 },
  hv: { at: [0.0, 0.05, 0.16] as V3, ex: [0.0, 0.2, 0.36] as V3 },
  evcc: { at: [0.17, 0.06, 0.15] as V3, ex: [0.34, 0.26, 0.28] as V3 },
  control: { at: [0, 0.115, 0] as V3, ex: [0, 0.38, 0] as V3 },
  ai: { at: [0, 0.13, 0] as V3, ex: [0, 0.5, 0] as V3 },
  lid: { at: [0, 0.16, 0] as V3, ex: [0, 0.68, 0] as V3 },
};

/** Optional OEM / fleet services floating above the vehicle (beyond-the-vehicle scene). */
export const CLOUD_NODES: { id: string; p: V3 }[] = [
  { id: 'quality', p: [-1.7, 3.0, -1.3] },
  { id: 'service', p: [-0.45, 3.55, 1.05] },
  { id: 'fleet', p: [0.95, 3.35, -0.7] },
  { id: 'versions', p: [1.95, 2.9, 1.2] },
];
