"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { type Group, MathUtils, SRGBColorSpace } from "three";
import { projects } from "@/content/projects/projects";
import { profile } from "@/content/profile";
import { EXHIBITS, HALL } from "./layout";
import { Model, type ModelName, Near } from "./model";
import { clickToOpen, openWorldPanel } from "./places";
import { textTexture } from "./textures";

const WALL = "#f4f0e8";
const BRONZE = "#2f3a40";
const GOLD = "#c9a45c";
const INK = "#17232b";
const CREAM = "#f3e6c8";
const FLOOR = HALL.floor;
const HEIGHT = 18;
const MID_Z = (HALL.minZ + HALL.maxZ) / 2;
const DEPTH = HALL.maxZ - HALL.minZ;
const WIDTH = HALL.maxX - HALL.minX;

/** Glass doors that slide apart while the visitor (camera) is near the entrance. */
function SlidingDoors() {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const open = useRef(0);
  useFrame(({ camera }, delta) => {
    const near = Math.hypot(camera.position.x, camera.position.z - HALL.maxZ) < 11;
    open.current = MathUtils.damp(open.current, near ? 1 : 0, 4, delta);
    const offset = HALL.door / 2 + open.current * (HALL.door - 0.2);
    if (left.current) left.current.position.x = -offset;
    if (right.current) right.current.position.x = offset;
  });
  const panel = (
    <>
      <mesh><boxGeometry args={[HALL.door, 6, 0.08]} /><meshStandardMaterial color="#cfe8f1" transparent opacity={0.35} metalness={0.6} roughness={0.05} /></mesh>
      <mesh position-y={-2.95}><boxGeometry args={[HALL.door, 0.1, 0.1]} /><meshStandardMaterial color={BRONZE} /></mesh>
      <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.06, 1.4, 0.06]} /><meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} /></mesh>
    </>
  );
  return (
    <group position={[0, FLOOR + 3, HALL.maxZ]}>
      <group ref={left}>{panel}</group>
      <group ref={right}>{panel}</group>
      {/* Door frame. */}
      {[-HALL.door, HALL.door].map((x) => <mesh key={x} position={[x, 0.5, 0]}><boxGeometry args={[0.3, 7, 0.3]} /><meshStandardMaterial color={BRONZE} /></mesh>)}
      <mesh position={[0, 3.6, 0]}><boxGeometry args={[HALL.door * 2 + 0.3, 0.3, 0.3]} /><meshStandardMaterial color={BRONZE} /></mesh>
    </group>
  );
}

/** Hollow hall: walls, ceiling with skylights, polished floor and glass front with a door gap. */
function HallShell() {
  const glass = <meshStandardMaterial color="#bfe0ea" transparent opacity={0.28} metalness={0.7} roughness={0.05} depthWrite={false} />;
  const sideGlassWidth = WIDTH / 2 - HALL.door;
  return (
    <group>
      <mesh position={[0, FLOOR + 0.01, MID_Z]} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[WIDTH, DEPTH]} /><meshStandardMaterial color="#e8e1d3" roughness={0.25} metalness={0.05} /></mesh>
      <mesh position={[0, FLOOR + HEIGHT / 2, HALL.minZ + 0.3]} castShadow receiveShadow><boxGeometry args={[WIDTH, HEIGHT, 0.6]} /><meshStandardMaterial color={WALL} /></mesh>
      {[HALL.minX + 0.3, HALL.maxX - 0.3].map((x) => (
        <mesh key={x} position={[x, FLOOR + HEIGHT / 2, MID_Z]} castShadow receiveShadow><boxGeometry args={[0.6, HEIGHT, DEPTH]} /><meshStandardMaterial color={WALL} /></mesh>
      ))}
      <mesh position={[0, FLOOR + HEIGHT - 0.25, MID_Z]}><boxGeometry args={[WIDTH, 0.5, DEPTH]} /><meshStandardMaterial color={WALL} /></mesh>
      {[-10, 0, 10].map((z) => (
        <mesh key={z} position={[0, FLOOR + HEIGHT - 0.52, MID_Z + z]} rotation-x={Math.PI / 2}><planeGeometry args={[WIDTH - 10, 3]} /><meshBasicMaterial color="#fff8e8" toneMapped={false} /></mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (HALL.door + sideGlassWidth / 2), FLOOR + HEIGHT / 2, HALL.maxZ]}><boxGeometry args={[sideGlassWidth, HEIGHT, 0.1]} />{glass}</mesh>
      ))}
      <mesh position={[0, FLOOR + 7 + (HEIGHT - 7) / 2, HALL.maxZ]}><boxGeometry args={[HALL.door * 2, HEIGHT - 7, 0.1]} />{glass}</mesh>
      <pointLight position={[0, FLOOR + 12, MID_Z]} intensity={900} distance={0} decay={2} color="#fff4e0" />
      <SlidingDoors />
    </group>
  );
}

function FrameImage({ src }: { src: string }) {
  const image = useTexture(src);
  image.colorSpace = SRGBColorSpace;
  return <mesh position={[0, 0, 0.08]}><planeGeometry args={[5.6, 3.15]} /><meshBasicMaterial map={image} toneMapped={false} /></mesh>;
}

function ProjectFrame({ index, x, z, rotation }: { index: number; x: number; z: number; rotation: number }) {
  const project = projects[index];
  const plaque = useMemo(() => textTexture(768, 220, INK, [
    [project.title.toUpperCase(), 52, CREAM, 700, 3],
    [`${project.category} · ${project.year}`, 28, "#b9c6cc", 500],
    ["Press E or click for the full case study", 24, "#e0b46a", 600, 2],
  ]), [project]);
  return (
    <group position={[x, FLOOR + 5.2, z]} rotation-y={rotation} {...clickToOpen(() => openWorldPanel({ kind: "project", slug: project.slug }))}>
      <mesh><boxGeometry args={[6.2, 3.75, 0.12]} /><meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} /></mesh>
      <mesh position-z={0.065}><planeGeometry args={[5.8, 3.35]} /><meshStandardMaterial color="#111b24" /></mesh>
      <Suspense fallback={null}>{project.image ? <FrameImage src={project.image.src} /> : null}</Suspense>
      <mesh position={[0, -2.75, 0.05]}><planeGeometry args={[4.6, 1.32]} /><meshBasicMaterial map={plaque} toneMapped={false} /></mesh>
      {/* Gallery picture light. */}
      <mesh position={[0, 2.25, 0.35]}><boxGeometry args={[2.4, 0.12, 0.25]} /><meshBasicMaterial color="#fff3c4" toneMapped={false} /></mesh>
    </group>
  );
}

function Vitrine({ x, z, model, label, height, length }: { x: number; z: number; model: ModelName; label: string; height?: number; length?: number }) {
  const turntable = useRef<Group>(null);
  const plaque = useMemo(() => textTexture(512, 96, INK, [[label, 34, CREAM, 600, 3]]), [label]);
  useFrame((_, delta) => { if (turntable.current) turntable.current.rotation.y += delta * 0.35; });
  return (
    <group position={[x, FLOOR, z]}>
      <mesh position-y={0.55} castShadow receiveShadow><boxGeometry args={[1.8, 1.1, 1.8]} /><meshStandardMaterial color="#efeae0" /></mesh>
      <mesh position-y={1.12}><cylinderGeometry args={[0.75, 0.75, 0.04, 32]} /><meshStandardMaterial color={BRONZE} metalness={0.5} /></mesh>
      <group ref={turntable} position-y={1.14}><Model name={model} height={height} length={length} animation={model === "supercar" ? false : undefined} /></group>
      <mesh position-y={2.4}><boxGeometry args={[2, 2.6, 2]} /><meshStandardMaterial color="#e3f3f8" transparent opacity={0.16} roughness={0} metalness={0.2} depthWrite={false} /></mesh>
      <mesh position={[0, 0.65, 0.91]}><planeGeometry args={[1.6, 0.3]} /><meshBasicMaterial map={plaque} toneMapped={false} /></mesh>
    </group>
  );
}

function Portrait() {
  const photo = useTexture(profile.portraitUrl);
  photo.colorSpace = SRGBColorSpace;
  return <mesh position={[-3.6, 0, 0.08]}><planeGeometry args={[3, 3.6]} /><meshBasicMaterial map={photo} toneMapped={false} /></mesh>;
}

function BackWall() {
  const bio = useMemo(() => textTexture(768, 640, INK, [
    [profile.name.toUpperCase(), 44, CREAM, 700, 3],
    [profile.role, 30, "#e0b46a", 600],
    [profile.location, 26, "#b9c6cc", 500],
    [profile.availability, 26, "#b9c6cc", 500],
  ]), []);
  const certificates = useMemo(() => textTexture(768, 640, INK, [
    ["CERTIFICATIONS", 46, CREAM, 700, 6],
    ...profile.certifications.map((c) => [c, 28, "#d5dee2", 500] as [string, number, string, number]),
  ]), []);
  const caption = useMemo(() => textTexture(1024, 200, INK, [
    ["VINCENT VAN GOGH · TWO POPLARS IN THE ALPILLES, 1889", 40, CREAM, 700, 3],
    ["3D scan courtesy of the Cleveland Museum of Art (CC0)", 28, "#b9c6cc", 500],
  ]), []);
  const z = EXHIBITS.painting.z;
  return (
    <group>
      <Model name="art-poplars" height={6.5} animation={false} position={[EXHIBITS.painting.x, FLOOR + 2.4, z + 0.35]} />
      <mesh position={[0, FLOOR + 1.4, z + 0.2]}><planeGeometry args={[6, 1.17]} /><meshBasicMaterial map={caption} toneMapped={false} /></mesh>
      <group position={[-15, FLOOR + 5.2, z + 0.1]} {...clickToOpen(() => openWorldPanel({ kind: "contact" }))}>
        <mesh><boxGeometry args={[11, 4.4, 0.1]} /><meshStandardMaterial color={INK} /></mesh>
        <Suspense fallback={null}><Portrait /></Suspense>
        <mesh position={[2.1, 0, 0.08]}><planeGeometry args={[6, 5]} /><meshBasicMaterial map={bio} toneMapped={false} transparent /></mesh>
      </group>
      <mesh position={[15, FLOOR + 5.2, z + 0.1]}><planeGeometry args={[8, 6.67]} /><meshBasicMaterial map={certificates} toneMapped={false} /></mesh>
    </group>
  );
}

function WelcomeDesk() {
  const sign = useMemo(() => textTexture(1024, 200, INK, [
    ["WELCOME TO THE PORTFOLIO MUSEUM", 50, CREAM, 700, 4],
    ["Walk up to any frame and press E · ARIA can guide you", 30, "#e0b46a", 600],
  ]), []);
  return (
    <group position={[EXHIBITS.desk.x, FLOOR, EXHIBITS.desk.z]} rotation-y={Math.PI / 2}>
      <mesh position-y={0.55} castShadow><boxGeometry args={[5.6, 1.1, 1.2]} /><meshStandardMaterial color={BRONZE} roughness={0.4} metalness={0.3} /></mesh>
      <mesh position-y={1.13}><boxGeometry args={[5.8, 0.06, 1.4]} /><meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[0, 4.6, 0]}><planeGeometry args={[7, 1.37]} /><meshBasicMaterial map={sign} toneMapped={false} side={2} /></mesh>
    </group>
  );
}

/** The museum building's hollow hall plus everything exhibited inside it. */
export function MuseumInterior() {
  return (
    <group>
      <HallShell />
      <Near x={0} z={MID_Z} radius={70}>
        <WelcomeDesk />
        {EXHIBITS.left.map((spot, i) => <ProjectFrame key={i} index={i} x={spot.x} z={spot.z} rotation={Math.PI / 2} />)}
        {EXHIBITS.right.map((spot, i) => <ProjectFrame key={i} index={i + EXHIBITS.left.length} x={spot.x} z={spot.z} rotation={-Math.PI / 2} />)}
        <BackWall />
        <Vitrine x={EXHIBITS.vitrines[0][0]} z={EXHIBITS.vitrines[0][1]} model="spartan" height={1.7} label="ARMOUR STUDY" />
        <Vitrine x={EXHIBITS.vitrines[1][0]} z={EXHIBITS.vitrines[1][1]} model="biped-robot" height={1.7} label="ROBOT PROTOTYPE" />
        <Vitrine x={EXHIBITS.vitrines[2][0]} z={EXHIBITS.vitrines[2][1]} model="bird-monster" height={1.4} label="CREATURE SCULPTURE" />
        <Vitrine x={EXHIBITS.vitrines[3][0]} z={EXHIBITS.vitrines[3][1]} model="supercar" length={1.8} label="SCALE MODEL CAR" />
      </Near>
    </group>
  );
}
