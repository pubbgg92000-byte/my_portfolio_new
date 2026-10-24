"use client";

import { Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { type InstancedMesh, MathUtils, Object3D, type Texture, type Mesh, type MeshStandardMaterial } from "three";
import { Model, Near } from "./model";
import { AVENUE, BEACH_RADIUS, ISLAND_RADIUS, PIER, PLAZA, POND, RING, random, ringCurve } from "./layout";
import { pavingTexture, rippleTexture } from "./textures";

export const SUN: [number, number, number] = [120, 160, 90];

function Water({ ripples }: { ripples: Texture }) {
  useFrame((_, delta) => {
    ripples.offset.x += delta * 0.006;
    ripples.offset.y += delta * 0.004;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.35} receiveShadow>
      <circleGeometry args={[1800, 64]} />
      <meshStandardMaterial color="#2f87ad" roughness={0.12} metalness={0.25} normalMap={ripples} normalScale={[0.6, 0.6]} />
    </mesh>
  );
}

function Shoreline() {
  const foam = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!foam.current) return;
    const wave = (Math.sin(clock.elapsedTime * .55) + 1) / 2;
    foam.current.scale.setScalar(1 + wave * .012);
    (foam.current.material as MeshStandardMaterial).opacity = .12 + wave * .2;
  });
  return <>
    <mesh rotation-x={-Math.PI / 2} position-y={-.27}><ringGeometry args={[BEACH_RADIUS + 4, BEACH_RADIUS + 23, 128]} /><meshStandardMaterial color="#6bc5c3" transparent opacity={.65} roughness={.2} depthWrite={false} /></mesh>
    <mesh ref={foam} rotation-x={-Math.PI / 2} position-y={-.19}><ringGeometry args={[BEACH_RADIUS + 3, BEACH_RADIUS + 6, 128]} /><meshStandardMaterial color="#f1f9e9" transparent opacity={.2} depthWrite={false} /></mesh>
  </>;
}

/** Real downloaded trees near walkways; the distant forest remains instanced. */
export function NatureDetails() {
  const groves = [
    { x: -29, z: 48 }, { x: 29, z: 48 },
    { x: POND.x - 23, z: POND.z + 19 },
    { x: -16, z: 215 }, { x: 19, z: 232 },
  ];
  return <>
    {groves.map(({ x, z }, i) => <Near key={i} x={x} z={z} radius={65}>
      <Model name="tree" height={7 + i % 2} position={[x, 0, z]} rotation-y={i * .8} />
      <Model name="tree" height={5.8} position={[x + 7, 0, z - 9]} rotation-y={i + 1} animation={false} />
    </Near>)}
    <Near x={0} z={245} radius={80}><Model name="island" length={85} position={[-80, -0.3, 318]} animation={false} /></Near>
  </>;
}

/** Continuous strip along the ring road (median kerb, edge line) drawn as one instanced mesh. */
function RingStrip({ offset, width, height, y, color, emissive, gaps = true }: { offset: number; width: number; height: number; y: number; color: string; emissive?: string; gaps?: boolean }) {
  const segments = useMemo(() => {
    const points = ringCurve(offset).getSpacedPoints(220);
    return points.slice(0, -1).flatMap((point, i) => {
      const next = points[i + 1];
      const x = (point.x + next.x) / 2;
      const z = (point.z + next.z) / 2;
      // Leave a gap where the avenue crosses the south side of the ring.
      if (gaps && Math.abs(x) < AVENUE.width / 2 + 3 && z > 0) return [];
      return [{ x, z, angle: Math.atan2(next.x - point.x, next.z - point.z), length: point.distanceTo(next) + 0.05 }];
    });
  }, [offset, gaps]);
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new Object3D();
    segments.forEach((segment, i) => {
      dummy.position.set(segment.x, y + height / 2, segment.z);
      dummy.rotation.set(0, segment.angle, 0);
      dummy.scale.set(1, 1, segment.length);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [segments, y, height]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, segments.length]} receiveShadow castShadow={height > 0.1}>
      <boxGeometry args={[width, height, 1]} />
      <meshStandardMaterial color={color} emissive={emissive ?? "#000000"} emissiveIntensity={emissive ? 0.5 : 0} roughness={0.8} />
    </instancedMesh>
  );
}

/** Divided ring road: raised median kerb with reflector strip, white edge lines. */
function RoadDividers() {
  const edge = RING.roadWidth / 2 - 0.45;
  return (
    <>
      <RingStrip offset={0} width={0.9} height={0.32} y={0.1} color="#c9c4b8" />
      <RingStrip offset={0} width={0.22} height={0.03} y={0.42} color="#f2c230" emissive="#f2a900" />
      <RingStrip offset={edge} width={0.2} height={0.02} y={0.11} color="#f3efe2" />
      <RingStrip offset={-edge} width={0.2} height={0.02} y={0.11} color="#f3efe2" />
    </>
  );
}

function Roads() {
  const { halfWidth, halfDepth, corner, roadWidth } = RING;
  const asphalt = <meshStandardMaterial color="#4a4f55" roughness={0.95} />;
  return (
    <group>
      {/* Ring road: straight sides plus rounded corners. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.1, -halfDepth]}><planeGeometry args={[(halfWidth - corner) * 2, roadWidth]} />{asphalt}</mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.1, halfDepth]}><planeGeometry args={[(halfWidth - corner) * 2, roadWidth]} />{asphalt}</mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-halfWidth, 0.1, 0]}><planeGeometry args={[roadWidth, (halfDepth - corner) * 2]} />{asphalt}</mesh>
      <mesh rotation-x={-Math.PI / 2} position={[halfWidth, 0.1, 0]}><planeGeometry args={[roadWidth, (halfDepth - corner) * 2]} />{asphalt}</mesh>
      {[[1, -1], [1, 1], [-1, 1], [-1, -1]].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} rotation-x={-Math.PI / 2} position={[sx * (halfWidth - corner), 0.1, sz * (halfDepth - corner)]}>
          <ringGeometry args={[corner - roadWidth / 2, corner + roadWidth / 2, 24, 1, sx > 0 ? (sz > 0 ? -Math.PI / 2 : 0) : sz > 0 ? Math.PI : Math.PI / 2, Math.PI / 2]} />
          {asphalt}
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[AVENUE.x, 0.1, (AVENUE.from + AVENUE.to) / 2]}><planeGeometry args={[AVENUE.width, AVENUE.to - AVENUE.from]} />{asphalt}</mesh>
      <RoadDividers />
      {/* Sidewalk edging along the avenue. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (AVENUE.width / 2 + 1), 0.12, (AVENUE.from + AVENUE.to) / 2]} receiveShadow>
          <boxGeometry args={[2, 0.2, AVENUE.to - AVENUE.from]} />
          <meshStandardMaterial color="#cfc9bb" />
        </mesh>
      ))}
    </group>
  );
}

/** Low-poly trees drawn as two instanced meshes (trunks + crowns) for speed. */
function Forest() {
  const trees = useMemo(() => {
    const next = random(7);
    const list: { x: number; z: number; scale: number }[] = [];
    const tryAdd = (x: number, z: number) => {
      const d = Math.hypot(x, z);
      if (d > ISLAND_RADIUS - 6) return;
      const onRing = Math.abs(Math.abs(x) - RING.halfWidth) < 10 && Math.abs(z) < RING.halfDepth + 10 || Math.abs(Math.abs(z) - RING.halfDepth) < 10 && Math.abs(x) < RING.halfWidth + 10;
      const blocked = onRing || Math.abs(x) < 40 && z > -48 && z < 64 || Math.abs(x) < 8 && z > 60 || Math.abs(x) > 136 && Math.abs(z) < 118 || Math.hypot(x - POND.x, z - POND.z) < POND.radius + 3 || Math.hypot(x - 62, z + 22) < 18
        || Math.abs(x) > 10 && Math.abs(x) < 25 && z > 66 && z < 200 // Project Avenue
        || Math.hypot(x - 0, z + 66) < 24 // Skills Garden
        || x > -106 && x < -38 && z > -90 && z < -40 // Journey Walk and its viewpoint
        || Math.hypot(x - 150, z - 175) < 10 || Math.hypot(x - 134, z - 157) < 24 // Lighthouse and its viewpoint
        || x > 48 && x < 76 && z > -22 && z < 24; // Pavilion approach
      if (!blocked) list.push({ x, z, scale: 0.8 + next() * 0.7 });
    };
    for (let i = 0; i < 260; i++) tryAdd((next() - 0.5) * 2 * ISLAND_RADIUS, (next() - 0.5) * 2 * ISLAND_RADIUS);
    for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; tryAdd(POND.x + Math.cos(a) * (POND.radius + 7 + next() * 6), POND.z + Math.sin(a) * (POND.radius + 7 + next() * 6)); }
    for (let z = 70; z < 228; z += 12) for (const side of [-1, 1]) tryAdd(side * 9, z);
    return list;
  }, []);
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!trunks.current || !crowns.current) return;
    const dummy = new Object3D();
    trees.forEach((t, i) => {
      dummy.position.set(t.x, 1.6 * t.scale, t.z);
      dummy.scale.setScalar(t.scale);
      dummy.rotation.set(0, i, 0);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 4.6 * t.scale;
      dummy.updateMatrix();
      crowns.current!.setMatrixAt(i, dummy.matrix);
    });
    trunks.current.instanceMatrix.needsUpdate = true;
    crowns.current.instanceMatrix.needsUpdate = true;
  }, [trees]);
  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 3.2, 6]} />
        <meshStandardMaterial color="#7a5a3c" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]} castShadow>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshStandardMaterial color="#5f9447" roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  );
}

function Hills() {
  const hills = useMemo(() => {
    const next = random(11);
    return Array.from({ length: 9 }, (_, i) => {
      const angle = MathUtils.degToRad(-150 + i * 15 + next() * 8);
      const distance = 196 + next() * 18;
      return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, r: 18 + next() * 16, h: 6 + next() * 10 };
    });
  }, []);
  return hills.map((h, i) => (
    <mesh key={i} position={[h.x, 0, h.z]} scale={[h.r, h.h, h.r]} receiveShadow>
      <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#7fa85b" roughness={1} flatShading />
    </mesh>
  ));
}

function Pier() {
  const length = PIER.to - PIER.from + 6;
  return (
    <group position={[PIER.x, 0, (PIER.from + PIER.to) / 2 - 3]}>
      <mesh position-y={0.25} receiveShadow castShadow><boxGeometry args={[PIER.width, 0.3, length]} /><meshStandardMaterial color="#a77b52" roughness={0.9} /></mesh>
      {Array.from({ length: 12 }, (_, i) => [-1, 1].map((side) => (
        <mesh key={`${i}${side}`} position={[side * (PIER.width / 2 - 0.2), -0.4, -length / 2 + i * (length / 11)]}>
          <cylinderGeometry args={[0.18, 0.18, 1.6, 6]} /><meshStandardMaterial color="#6d5038" />
        </mesh>
      )))}
    </group>
  );
}

export function Terrain() {
  const ripples = useMemo(() => {
    const texture = rippleTexture();
    texture.repeat.set(140, 140);
    return texture;
  }, []);
  const pondRipples = useMemo(() => {
    const texture = rippleTexture();
    texture.repeat.set(6, 6);
    return texture;
  }, []);
  const paving = useMemo(() => pavingTexture(14), []);
  const forecourt = useMemo(() => pavingTexture(10), []);
  useFrame((_, delta) => { pondRipples.offset.x += delta * 0.02; });
  return (
    <group>
      <Sky sunPosition={SUN} turbidity={4} rayleigh={0.9} mieCoefficient={0.004} mieDirectionalG={0.85} distance={4500} />
      <Water ripples={ripples} />
      <Shoreline />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.2} receiveShadow><circleGeometry args={[BEACH_RADIUS + 6, 96]} /><meshStandardMaterial color="#e7d3a1" roughness={1} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow><circleGeometry args={[ISLAND_RADIUS, 96]} /><meshStandardMaterial color="#8db866" roughness={1} /></mesh>
      <Roads />
      {/* Plaza paving and museum forecourt. */}
      <mesh rotation-x={-Math.PI / 2} position={[PLAZA.x, 0.06, PLAZA.z]} receiveShadow><circleGeometry args={[PLAZA.radius, 64]} /><meshStandardMaterial color="#cfc6b4" map={paving} roughness={0.9} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 6]} receiveShadow><planeGeometry args={[80, 20]} /><meshStandardMaterial color="#cfc6b4" map={forecourt} roughness={0.9} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[POND.x, 0.04, POND.z]}><circleGeometry args={[POND.radius + 2, 48]} /><meshStandardMaterial color="#d9c99e" /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[POND.x, 0.08, POND.z]}><circleGeometry args={[POND.radius, 48]} /><meshStandardMaterial color="#3d93a8" roughness={0.1} metalness={0.2} normalMap={pondRipples} /></mesh>
      <Forest />
      <Hills />
      <Pier />
    </group>
  );
}
