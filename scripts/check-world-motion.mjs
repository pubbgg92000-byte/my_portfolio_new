// Pure model / movement regression checks, without a browser or WebGL.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AnimationMixer, Box3, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { movementDelta, facingAlong } from '../components/world/motion.ts';
import { createStride, updateStride } from '../components/world/stride.ts';

for (const yaw of [0, Math.PI / 2, Math.PI, -Math.PI / 2, .73]) {
  const forward = movementDelta(yaw, 1, 0, 1);
  const backward = movementDelta(yaw, -1, 0, 1);
  const look = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  assert.ok(new Vector3(forward.x, 0, forward.z).dot(look) > .999);
  assert.ok(new Vector3(backward.x, 0, backward.z).dot(look) < -.999);
  const diagonal = movementDelta(yaw, 1, 1, 1);
  assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.z) - 1) < 1e-9);
}
console.log('PASS: forward/backward match camera heading; diagonal speed is capped.');

for (const name of ['jyn-erso', 'poe-dameron', 'cassian-andor', 'mace-windu']) {
  const bytes = readFileSync(`public/models/world/${name}.glb`);
  const jsonLength = bytes.readUInt32LE(12);
  const json = JSON.parse(bytes.subarray(20, 20 + jsonLength));
  // Rendering is unnecessary for skeleton validation. Remove texture sources
  // in memory so GLTFLoader never needs an image decoder or network request.
  delete json.images; delete json.textures;
  json.materials = [{}];
  for (const mesh of json.meshes) for (const primitive of mesh.primitives) primitive.material = 0;
  const source = Buffer.from(JSON.stringify(json));
  const padded = Buffer.alloc(Math.ceil(source.length / 4) * 4, 32); source.copy(padded);
  const bin = bytes.subarray(20 + jsonLength);
  const result = Buffer.alloc(20 + padded.length + bin.length);
  result.writeUInt32LE(0x46546c67, 0); result.writeUInt32LE(2, 4); result.writeUInt32LE(result.length, 8);
  result.writeUInt32LE(padded.length, 12); result.writeUInt32LE(0x4e4f534a, 16); padded.copy(result, 20); bin.copy(result, 20 + padded.length);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.parseAsync(result.buffer, '');
  const object = gltf.scene;
  const mixer = new AnimationMixer(object); mixer.clipAction(gltf.animations[0]).play(); mixer.update(0);
  const bounds = new Box3().setFromObject(object, true);
  const size = bounds.getSize(new Vector3()); const center = bounds.getCenter(new Vector3());
  const stride = createStride(object);
  assert.equal(stride.contacts.length, 4);
  assert.equal(stride.joints.length, 8);
  const outer = new Group(); outer.scale.setScalar(1.78 / size.y);
  outer.rotation.y = stride.heading;
  const root = new Group(); root.position.set(-center.x, -bounds.min.y, -center.z); root.add(object); outer.add(root);
  const aligned = stride.forward.clone().applyAxisAngle(new Vector3(0, 1, 0), stride.heading);
  assert.ok(aligned.z > .999, `${name} faces backwards`);
  for (const direction of [1, -1]) {
    const heading = facingAlong(direction, .3);
    const faced = aligned.clone().applyAxisAngle(new Vector3(0, 1, 0), heading);
    assert.ok(faced.dot(new Vector3(direction, 0, .3).normalize()) > .999);
  }
  const expectedFloor = (stride.floor - bounds.min.y) * outer.scale.y;
  for (let frame = 0; frame < 120; frame++) {
    outer.updateMatrixWorld(true);
    updateStride(stride, object, root, -bounds.min.y, frame / 120 * Math.PI * 2);
    outer.updateMatrixWorld(true);
    const floor = Math.min(...stride.contacts.map(bone => bone.getWorldPosition(new Vector3()).y));
    assert.ok(Math.abs(floor - expectedFloor) < .0001, `${name} floats: ${floor} vs ${expectedFloor}`);
  }
  console.log(`PASS: ${name} faces travel in both directions; foot contacts grounded across 120 poses.`);
}
