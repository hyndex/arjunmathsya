// Regenerates public/models/concept-ev.glb from the Khronos glTF sample "CarConcept" (CC BY 4.0):
//   https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept (glTF-Binary/CarConcept.glb)
// Run from a scratch folder that has: npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer sharp
// Usage: node prepare-car-model.mjs <CarConcept.glb> <out/concept-ev.glb>
// Prepares Khronos "Car Concept" (CC BY 4.0) for the Mathsya site:
//  - bakes the "Pearly Swirly" paint variant, drops the other variants
//  - removes Khronos / 3D Commerce logos (plate + emblem atlas, tyre sidewall colour + normal maps)
//  - blanks the ICE-style dashboard display, deletes the placeholder "Engine" block
//  - simplifies the wipers, prunes, WebP textures (max 1024), Meshopt compression
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, textureCompress, meshopt, simplifyPrimitive, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';

const [inp, out] = process.argv.slice(2);
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(inp);
const root = doc.getRoot();

// 1. Bake the pearl paint variant
let baked = 0;
for (const mesh of root.listMeshes())
  for (const prim of mesh.listPrimitives()) {
    const list = prim.getExtension('KHR_materials_variants');
    if (!list) continue;
    for (const mapping of list.listMappings())
      if (mapping.listVariants().some((v) => /pearl/i.test(v.getName()))) {
        prim.setMaterial(mapping.getMaterial());
        baked++;
      }
    prim.setExtension('KHR_materials_variants', null);
  }
root.listExtensionsUsed().find((e) => e.extensionName === 'KHR_materials_variants')?.dispose();
console.log('variant-baked primitives:', baked);

// 2. Remove logos and ICE gauges
const mat = (n) => root.listMaterials().find((m) => m.getName() === n);
const plate = mat('License');
const atlas = plate?.getBaseColorTexture();
for (const m of root.listMaterials())
  if (atlas && m.getEmissiveTexture() === atlas) {
    m.setEmissiveTexture(null);
    m.setEmissiveFactor([0, 0, 0]);
  }
plate?.setBaseColorTexture(null).setBaseColorFactor([0.86, 0.88, 0.9, 1]);
mat('Tireside')?.setBaseColorTexture(null).setNormalTexture(null).setBaseColorFactor([0.075, 0.08, 0.09, 1]);
mat('Dashboard')?.setEmissiveTexture(null).setEmissiveFactor([0, 0, 0]).setBaseColorFactor([0.03, 0.04, 0.06, 1]);

// 3. Delete the placeholder engine block (this is an EV story) and the very dense wiper arms (barely visible at site camera distances)
for (const n of root.listNodes()) if (['Engine', 'BodyWindshieldWipers'].includes(n.getName())) n.dispose();

// 4. Simplify over-dense parts (wipers, rims); drop tangents (three.js derives them for normal maps)
const count = (p) => p.getAttribute('POSITION').getCount();
for (const n of root.listNodes()) {
  const name = n.getName();
  for (const p of n.getMesh()?.listPrimitives() ?? []) {
    const tyre = /^Tire/.test(p.getMaterial()?.getName() ?? '');
    const [ratio, error] = name === 'BodyWindshieldWipers' ? [0.03, 0.08] : /Rim$/.test(name) ? [0.45, 0.01] : tyre ? [0.4, 0.01] : [0, 0];
    if (ratio) {
      const before = count(p);
      simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio, error });
      console.log('simplified', name || p.getMaterial()?.getName(), before, '->', count(p));
    }
  }
}
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) p.setAttribute('TANGENT', null);

// 5. Clean, compress
await doc.transform(
  prune(),
  dedup(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 82 }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' })
);
await io.write(out, doc);

// Report world bounds of key parts (model space) for placing the vehicle systems
for (const name of ['BodyUnderside', 'BodyRoofPanel', 'BodyHood', 'BodyWindshield', 'BodyRearwindow', 'InteriorDashMid', 'InteriorFloor', 'InteriorCage', 'BodyPanelsColor2', 'BodyDoorLColor1', 'BodyHoodTopgrill', 'BodyHeadlights', 'BodyTaillights', 'InteriorSeatsFrame1']) {
  const n = root.listNodes().find((x) => x.getName() === name);
  if (!n) continue;
  const b = getBounds(n);
  console.log(name.padEnd(22), 'min', b.min.map((v) => v.toFixed(3)).join(','), ' max', b.max.map((v) => v.toFixed(3)).join(','));
}
