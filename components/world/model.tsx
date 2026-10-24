"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { type ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, Box3, Color, type Group, type Mesh, type MeshStandardMaterial, type Object3D, Vector3 } from "three";
import { createStride, updateStride } from "./stride";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

const WORLD = "/models/world";
export const MODEL_URLS = {
  robot: "/models/studio/robot.glb",
  sedan: "/models/studio/sedan.glb",
  museum: `${WORLD}/museum.glb`,
  island: `${WORLD}/island.glb`,
  "city-block": `${WORLD}/city-block.glb`,
  "simple-building": `${WORLD}/simple-building.glb`,
  "store-building": `${WORLD}/store-building.glb`,
  "tower-building": `${WORLD}/tower-building.glb`,
  office: `${WORLD}/office.glb`,
  mountain: `${WORLD}/mountain.glb`,
  tree: `${WORLD}/tree.glb`,
  turbine: `${WORLD}/turbine.glb`,
  plane: `${WORLD}/plane.glb`,
  helicopter: `${WORLD}/helicopter.glb`,
  train: `${WORLD}/train.glb`,
  supercar: `${WORLD}/supercar.glb`,
  bird: `${WORLD}/bird.glb`,
  hummingbird: `${WORLD}/hummingbird.glb`,
  "flying-bird": `${WORLD}/flying-bird.glb`,
  "bird-monster": `${WORLD}/bird-monster.glb`,
  rhino: `${WORLD}/rhino.glb`,
  "food-stand": `${WORLD}/food-stand.glb`,
  staircase: `${WORLD}/staircase.glb`,
  sweeper: `${WORLD}/sweeper.glb`,
  "biped-robot": `${WORLD}/biped-robot.glb`,
  "loft-16": `${WORLD}/loft-16.glb`,
  "loft-15": `${WORLD}/loft-15.glb`,
  "loft-18": `${WORLD}/loft-18.glb`,
  "interior-14": `${WORLD}/interior-14.glb`,
  "art-poplars": `${WORLD}/art-poplars.glb`,
  "kylo-ren": `${WORLD}/kylo-ren.glb`,
  "poe-dameron": `${WORLD}/poe-dameron.glb`,
  "jyn-erso": `${WORLD}/jyn-erso.glb`,
  "cassian-andor": `${WORLD}/cassian-andor.glb`,
  "mace-windu": `${WORLD}/mace-windu.glb`,
  spartan: `${WORLD}/spartan.glb`,
  "fountain-sim": `${WORLD}/fountain-sim.glb`,
  "sports-car": `${WORLD}/sports-car.glb`,
  "retro-car": `${WORLD}/retro-car.glb`,
  "dirty-car": `${WORLD}/dirty-car.glb`,
} as const;

export type ModelName = keyof typeof MODEL_URLS;

/**
 * Per-model clean-up for downloads that ship extra scenery.
 * drop: material or node names to remove before measuring (e.g. a baked sky dome).
 * groundY: source-space height that should sit at the model's origin instead of its lowest point.
 * box: known source-space size/centre, for rigs whose measured bounds are unreliable.
 */
const MODEL_FIXES: Partial<Record<ModelName, { drop?: RegExp; groundY?: number; box?: { size: [number, number, number]; centre: [number, number, number] } }>> = {
  island: { drop: /skybox/i, groundY: 0.2, box: { size: [61, 11, 61], centre: [0, 0, 0] } },
  museum: { drop: /^material$/, groundY: 0 },
  "fountain-sim": { drop: /^hShape$/ },
};

/** Bounds are measured once per source scene; skinned meshes make this expensive. */
const bounds = new WeakMap<Object3D, { size: Vector3; centre: Vector3; minY: number }>();
function measure(source: Object3D, copy: Object3D) {
  let entry = bounds.get(source);
  if (!entry) {
    copy.updateMatrixWorld(true);
    const box = new Box3().setFromObject(copy, true);
    entry = { size: box.getSize(new Vector3()), centre: box.getCenter(new Vector3()), minY: box.min.y };
    bounds.set(source, entry);
  }
  return entry;
}

type ModelProps = Omit<ThreeElements["group"], "scale"> & {
  name: ModelName;
  /** Target height in metres. */
  height?: number;
  /** Target longest horizontal side in metres (used when height is not given). */
  length?: number;
  animation?: string | false;
  timeScale?: number;
  shadows?: boolean;
  tint?: string;
  /** Add a lightweight stride to the downloaded Mixamo idle pose. */
  gait?: { speed: number; phase: number };
};

/** Loads a model, sits it on y=0, centres it and scales it to real-world metres. */
export function Model({ name, height, length, animation, timeScale = 1, shadows = false, tint, gait, ...group }: ModelProps) {
  const { scene, animations } = useGLTF(MODEL_URLS[name]);
  const walking = Boolean(gait);
  const root = useRef<Group>(null);
  const { object, scale, offset } = useMemo(() => {
    const copy = clone(scene);
    const fix = MODEL_FIXES[name];
    if (fix?.drop) {
      const unwanted: Object3D[] = [];
      copy.traverse((child) => {
        const material = (child as Mesh).material as { name?: string } | undefined;
        if (fix.drop!.test(child.name) || (material?.name && fix.drop!.test(material.name))) unwanted.push(child);
      });
      unwanted.forEach((child) => child.removeFromParent());
    }
    if (walking && animations[0]) {
      const pose = new AnimationMixer(copy);
      pose.clipAction(animations[0]).play();
      pose.update(0);
      // Keep the sampled idle pose, without letting the source root-motion track
      // translate the pedestrian a second time while its path moves it.
    }
    copy.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = shadows;
      mesh.receiveShadow = true;
      mesh.frustumCulled = !("isSkinnedMesh" in mesh);
      if (tint) {
        const material = (mesh.material as MeshStandardMaterial).clone();
        material.color = new Color(tint);
        mesh.material = material;
      }
    });
    const { size, centre, minY } = fix?.box
      ? { size: new Vector3(...fix.box.size), centre: new Vector3(...fix.box.centre), minY: 0 }
      : measure(scene, copy);
    const factor = height ? height / size.y : length ? length / Math.max(size.x, size.z) : 1;
    return { object: copy, scale: factor, offset: [-centre.x, -(fix?.groundY ?? minY), -centre.z] as const };
  }, [scene, animations, name, height, length, shadows, tint, walking]);

  const { actions, names } = useAnimations(animations, root);
  useEffect(() => {
    if (walking || animation === false || !names.length) return;
    const action = actions[animation ?? names[0]];
    action?.reset().play().setEffectiveTimeScale(timeScale);
    return () => { action?.stop(); };
  }, [actions, names, animation, timeScale, walking]);

  const stride = useMemo(() => createStride(object), [object]);
  useFrame(({ clock }) => {
    if (gait && root.current) updateStride(stride, object, root.current, offset[1], clock.elapsedTime * gait.speed * 5.6 + gait.phase);
  });

  return (
    <group {...group}>
      <group scale={scale} rotation-y={gait ? stride.heading : 0}>
        <group ref={root} position={offset}>
          <primitive object={object} />
        </group>
      </group>
    </group>
  );
}

/** Mounts children only once the camera comes within `radius` metres of (x, z). Keeps far models off the network. */
export function Near({ x, z, radius, children }: { x: number; z: number; radius: number; children: ReactNode }) {
  const [near, setNear] = useState(false);
  const elapsed = useRef(0);
  useFrame(({ camera }, delta) => {
    if (near || (elapsed.current += delta) < 0.5) return;
    elapsed.current = 0;
    if (Math.hypot(camera.position.x - x, camera.position.z - z) < radius) setNear(true);
  });
  return near ? <Suspense fallback={null}>{children}</Suspense> : null;
}

export const preloadModel = (name: ModelName) => useGLTF.preload(MODEL_URLS[name]);
