"use client";

import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, type Group, Vector3 } from "three";
import { facingAlong } from "./motion";
import { BUILDINGS, CONTACT_BOOTH, LANDMARKS, LIGHTHOUSE, PLAZA, POND } from "./layout";
import { Model, type ModelName, Near } from "./model";
import { facadeTexture, textTexture } from "./textures";
import { NatureDetails } from "./terrain";
import { ContactPier, ExperimentStands, JourneyWalk, Lighthouse, ProjectAvenue, SkillsGarden } from "./places";

function Buildings() {
  const facade = useMemo(() => facadeTexture(), []);
  const maps = useMemo(() => BUILDINGS.map(b => {
    const map = facade.clone();
    map.repeat.set(Math.max(1, Math.round(b.width / 8)), Math.max(1, Math.round(b.height / 8)));
    map.needsUpdate = true;
    return map;
  }), [facade]);
  useEffect(() => () => { maps.forEach(map => map.dispose()); facade.dispose(); }, [maps, facade]);
  return BUILDINGS.map((b, i) => {
    return (
      <group key={i} position={[b.x, 0, b.z]}>
        <mesh position-y={b.height / 2} castShadow receiveShadow>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial color={b.color} map={maps[i]} roughness={0.7} />
        </mesh>
        <mesh position-y={b.height + 0.4}><boxGeometry args={[b.width + 0.6, 0.8, b.depth + 0.6]} /><meshStandardMaterial color="#59656d" /></mesh>
      </group>
    );
  });
}

function Pavilion() {
  const sign = useMemo(() => textTexture(1024, 160, "#16222b", [["EXPERIMENTS PAVILION", 70, "#9fe3ff", 700, 10]]), []);
  return (
    <group position={[62, 0, -22]}>
      <mesh position-y={0.3} receiveShadow><cylinderGeometry args={[13, 13.5, 0.6, 48]} /><meshStandardMaterial color="#e2ddd2" /></mesh>
      <mesh position-y={5.6} castShadow><cylinderGeometry args={[10, 10, 10, 48, 1, true]} /><meshStandardMaterial color="#9cc6d6" metalness={0.5} roughness={0.1} transparent opacity={0.55} /></mesh>
      <mesh position-y={11.1} castShadow><cylinderGeometry args={[12, 11, 1, 48]} /><meshStandardMaterial color="#26323a" metalness={0.4} roughness={0.4} /></mesh>
      <mesh position={[0, 12.6, 0]} rotation-y={Math.PI / 4}><planeGeometry args={[14, 2.2]} /><meshBasicMaterial map={sign} toneMapped={false} side={2} /></mesh>
      <ExperimentStands />
    </group>
  );
}

/** Downloaded visitors retained as the cast for the plaza. */
const WALKERS: ModelName[] = ["jyn-erso", "poe-dameron", "cassian-andor", "mace-windu"];

function Walker({ name, index }: { name: ModelName; index: number }) {
  const root = useRef<Group>(null);
  // Two pavement loops around the fountain; neither crosses traffic or water.
  const route = useMemo(() => {
    const radius = 21 + index % 2 * 4;
    const points = Array.from({ length: 16 }, (_, i) => {
      const angle = i / 16 * Math.PI * 2;
      return new Vector3(PLAZA.x + Math.cos(angle) * radius, .06, PLAZA.z + Math.sin(angle) * radius);
    });
    return new CatmullRomCurve3(points, true, "centripetal");
  }, [index]);
  const total = useMemo(() => route.getLength(), [route]);
  const speed = .9 + index % 3 * .12;
  const direction = index % 2 ? -1 : 1;
  const point = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    if (!root.current) return;
    const t = ((index / 8 + clock.elapsedTime * speed * direction / total) % 1 + 1) % 1;
    route.getPointAt(t, point);
    route.getTangentAt(t, tangent).multiplyScalar(direction);
    root.current.position.copy(point);
    root.current.rotation.y = facingAlong(tangent.x, tangent.z);
  });
  return <group ref={root}><Model name={name} height={1.78} gait={{ speed, phase: index * 1.7 }} /></group>;
}

function Visitors() {
  return <>
    {WALKERS.map((name, index) => <Suspense key={name} fallback={null}><Walker name={name} index={index} /></Suspense>)}
  </>;
}

/** Small robot that sweeps a loop around the fountain. */
function PatrolSweeper() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.12;
    ref.current.position.set(PLAZA.x + Math.cos(t) * 18, 0.06, PLAZA.z + Math.sin(t) * 18);
    ref.current.rotation.y = -t;
  });
  return <group ref={ref}><Model name="sweeper" height={1.4} /></group>;
}

function StreetLamps() {
  const lamps = useMemo(() => {
    const list: [number, number][] = [];
    for (let z = 66; z < 230; z += 20) list.push([-7.5, z], [7.5, z]);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; list.push([PLAZA.x + Math.cos(a) * 29, PLAZA.z + Math.sin(a) * 29]); }
    return list;
  }, []);
  return lamps.map(([x, z], i) => (
    <group key={i} position={[x, 0, z]}>
      <mesh position-y={2.6}><cylinderGeometry args={[0.08, 0.12, 5.2, 8]} /><meshStandardMaterial color="#2c3438" /></mesh>
      <mesh position-y={5.3}><sphereGeometry args={[0.32, 12, 8]} /><meshStandardMaterial color="#fff2cf" emissive="#ffd98a" emissiveIntensity={0.6} /></mesh>
    </group>
  ));
}

/** Stone plinth with a small caption sign for outdoor exhibits. */
function Plinth({ x, z, width, depth, label }: { x: number; z: number; width: number; depth: number; label: string }) {
  const sign = useMemo(() => textTexture(512, 96, "#17232b", [[label, 40, "#f3e6c8", 700, 6]]), [label]);
  return (
    <group position={[x, 0, z]}>
      <mesh position-y={0.2} receiveShadow><boxGeometry args={[width, 0.4, depth]} /><meshStandardMaterial color="#e4ddcf" /></mesh>
      <mesh position={[0, 0.85, depth / 2 + 0.6]} rotation-x={-0.35}><planeGeometry args={[3.2, 0.6]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
      <mesh position={[0, 0.4, depth / 2 + 0.75]}><boxGeometry args={[0.12, 0.8, 0.12]} /><meshStandardMaterial color="#2c3438" /></mesh>
    </group>
  );
}

function Helipad({ x, z }: { x: number; z: number }) {
  const mark = useMemo(() => textTexture(256, 256, "#3c444a", [["H", 170, "#f3efe2", 700]]), []);
  return (
    <group position={[x, 0.07, z]}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow><circleGeometry args={[7, 40]} /><meshStandardMaterial color="#3c444a" roughness={0.9} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}><ringGeometry args={[6.2, 6.6, 40]} /><meshBasicMaterial color="#f2c46d" /></mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}><planeGeometry args={[6, 6]} /><meshBasicMaterial map={mark} transparent alphaTest={0.5} /></mesh>
    </group>
  );
}

/** Outdoor exhibits: every model sits on the ground at its menu location. */
function Exhibits() {
  return (
    <>
      <Near x={82} z={50} radius={110}>
        <Helipad x={73} z={49} />
        <Model name="helicopter" height={3.4} animation={false} position={[73, 0.08, 49]} rotation-y={-0.6} shadows />
        <Plinth x={92} z={52} width={12} depth={10} label="VINTAGE PLANE" />
        <Model name="plane" length={9} animation={false} position={[92, 0.4, 52]} rotation-y={2.4} shadows />
      </Near>
      <Near x={-76} z={57} radius={90}>
        <Plinth x={-76} z={57} width={7} depth={6} label="SCULPTURE" />
        <Model name="bird-monster" height={3.2} position={[-76, 0.4, 57]} rotation-y={0.5} />
      </Near>
      <Near x={74} z={-86} radius={110}>
        <Model name="museum" length={16} position={[62, 0.02, -86]} rotation-y={0.3 + Math.PI} />
        <Plinth x={87} z={-85} width={14} depth={13} label="LOFT STUDY" />
        <Model name="loft-16" length={12} position={[87, 0.4, -85]} rotation-y={-0.4} />
      </Near>
    </>
  );
}

export function City() {
  return (
    <group>
      <Buildings />
      <StreetLamps />
      <NatureDetails />
      <Exhibits />
      <ProjectAvenue />
      <SkillsGarden />
      <JourneyWalk />
      <Near x={CONTACT_BOOTH.x} z={CONTACT_BOOTH.z} radius={120}><ContactPier /></Near>
      <Near x={LIGHTHOUSE.x} z={LIGHTHOUSE.z} radius={170}><Lighthouse /></Near>
      {/* West landmarks. */}
      <Near x={-162} z={10} radius={150}>
        <Model name="store-building" length={LANDMARKS.store.length} position={[LANDMARKS.store.x, 0, LANDMARKS.store.z]} rotation-y={LANDMARKS.store.rotation} />
        <Model name="office" length={LANDMARKS.office.length} position={[LANDMARKS.office.x, 0, LANDMARKS.office.z]} rotation-y={LANDMARKS.office.rotation} />
      </Near>
      {/* East landmarks. */}
      <Near x={162} z={8} radius={150}>
        <Model name="tower-building" height={LANDMARKS.tower.height} position={[LANDMARKS.tower.x, 0, LANDMARKS.tower.z]} rotation-y={LANDMARKS.tower.rotation} />
        <Model name="simple-building" height={LANDMARKS.simple.height} position={[LANDMARKS.simple.x, 0, LANDMARKS.simple.z]} rotation-y={LANDMARKS.simple.rotation} />
      </Near>
      <Near x={62} z={-22} radius={85}><Pavilion /></Near>
      <Visitors />
      <Suspense fallback={null}><PatrolSweeper /></Suspense>
      <Near x={-24} z={34} radius={50}><Model name="food-stand" length={7} position={[-24, 0.06, 34]} rotation-y={0.9} /></Near>
      <Near x={24} z={18} radius={45}><Model name="supercar" length={4.8} animation={false} position={[24, 0.06, 18]} rotation-y={-0.7} shadows /></Near>
      <Near x={POND.x} z={POND.z} radius={65}>
        <Model name="rhino" height={1.7} position={[POND.x + 4, 0.04, POND.z + POND.radius + 7]} rotation-y={1.2} shadows />
      </Near>
      <Near x={0} z={-205} radius={200}>
        <Model name="turbine" height={34} position={[-60, 0, -200]} rotation-y={0.3} />
        <Model name="turbine" height={34} position={[-10, 0, -214]} rotation-y={0.2} />
        <Model name="turbine" height={34} position={[45, 0, -206]} rotation-y={0.1} />
      </Near>
    </group>
  );
}
