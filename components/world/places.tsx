"use client";

import { useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { type Group, type Mesh, type MeshStandardMaterial, SRGBColorSpace } from "three";
import { experiments, projects } from "@/content/projects/projects";
import { profile } from "@/content/profile";
import { CONTACT_BOOTH, EXHIBITS, JOURNEY, LIGHTHOUSE, PROJECT_SLOTS, SKILLS } from "./layout";
import { Near } from "./model";
import { textTexture } from "./textures";

export type WorldPanel =
  | { kind: "project" | "experiment"; slug: string }
  | { kind: "skill" | "journey"; index: number }
  | { kind: "contact" };
/** In-world clicks open HUD panels through a window event, so scene code needs no React plumbing. */
export const openWorldPanel = (detail: WorldPanel) => window.dispatchEvent(new CustomEvent<WorldPanel>("world:panel", { detail }));

const clickable = (open: () => void) => ({
  onClick: (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); open(); },
  onPointerOver: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); document.body.style.cursor = "pointer"; },
  onPointerOut: () => { document.body.style.cursor = ""; },
});

export const clickToOpen = clickable;

/** Everything in the world with a details panel, used for the "Press E" proximity prompt. */
export const INTERACTABLES: { x: number; z: number; label: string; panel: WorldPanel }[] = [
  ...PROJECT_SLOTS.flatMap((slot, i) => projects[i] ? [{ x: slot.x, z: slot.z, label: `Read ${projects[i].title} case study`, panel: { kind: "project" as const, slug: projects[i].slug } }] : []),
  ...SKILLS.pillars.map((p, i) => ({ x: p.x, z: p.z, label: `See ${profile.skillGroups[i].title} skills & proof`, panel: { kind: "skill" as const, index: i } })),
  ...JOURNEY.stops.map((x, i) => ({ x, z: JOURNEY.z, label: `Read ${profile.journey[i].period}: ${profile.journey[i].title}`, panel: { kind: "journey" as const, index: i } })),
  { x: CONTACT_BOOTH.x, z: CONTACT_BOOTH.z, label: "Contact Arvind", panel: { kind: "contact" } },
  // Museum frames: the prompt point sits a few metres into the room from each wall.
  ...[...EXHIBITS.left.map((spot) => ({ ...spot, x: spot.x + 4 })), ...EXHIBITS.right.map((spot) => ({ ...spot, x: spot.x - 4 }))].flatMap((spot, i) =>
    projects[i] ? [{ x: spot.x, z: spot.z, label: `Read ${projects[i].title} case study`, panel: { kind: "project" as const, slug: projects[i].slug } }] : []),
  { x: -15, z: EXHIBITS.painting.z + 5, label: "About Arvind & contact", panel: { kind: "contact" } },
  ...experiments.map((e, i) => {
    const angle = (i / experiments.length) * Math.PI * 2;
    return { x: 62 + Math.sin(angle) * 11, z: -22 + Math.cos(angle) * 11, label: `View experiment: ${e.title}`, panel: { kind: "experiment" as const, slug: e.slug } };
  }),
];

const INK = "#17232b";
const CREAM = "#f3e6c8";

/* ---------- Project Avenue: one display per project along the main avenue ---------- */

function ProjectScreen({ src }: { src: string }) {
  const image = useTexture(src);
  image.colorSpace = SRGBColorSpace;
  return <mesh position={[0, 3.3, 0.09]}><planeGeometry args={[5.6, 3.15]} /><meshBasicMaterial map={image} toneMapped={false} /></mesh>;
}

function ProjectKiosk({ index }: { index: number }) {
  const project = projects[index];
  const slot = PROJECT_SLOTS[index];
  const label = useMemo(() => textTexture(768, 200, INK, [
    [project.title.toUpperCase(), 54, CREAM, 700, 3],
    [`${project.category} · ${project.year}`, 28, "#b9c6cc", 500],
    ["Click to open the case study", 24, "#e0b46a", 600, 2],
  ]), [project]);
  return (
    <group position={[slot.x, 0, slot.z]} rotation-y={slot.x < 0 ? Math.PI / 2 + 0.6 : -Math.PI / 2 - 0.6} {...clickable(() => openWorldPanel({ kind: "project", slug: project.slug }))}>
      <mesh position-y={0.15} receiveShadow><boxGeometry args={[7, 0.3, 2.4]} /><meshStandardMaterial color="#e4ddcf" /></mesh>
      {[-3.05, 3.05].map((x) => <mesh key={x} position={[x, 2.6, 0]} castShadow><boxGeometry args={[0.22, 5.2, 0.22]} /><meshStandardMaterial color="#2c3438" metalness={0.5} roughness={0.4} /></mesh>)}
      <mesh position={[0, 3.3, 0]} castShadow><boxGeometry args={[6, 3.55, 0.16]} /><meshStandardMaterial color={INK} /></mesh>
      <Suspense fallback={null}>{project.image ? <ProjectScreen src={project.image.src} /> : null}</Suspense>
      <mesh position={[0, 0.95, 0.12]}><planeGeometry args={[5.6, 1.46]} /><meshBasicMaterial map={label} toneMapped={false} /></mesh>
      <mesh position={[0, 5.25, 0]}><boxGeometry args={[6.3, 0.14, 0.3]} /><meshBasicMaterial color="#f2c46d" toneMapped={false} /></mesh>
    </group>
  );
}

export function ProjectAvenue() {
  return PROJECT_SLOTS.map((slot, index) => projects[index] ? (
    <Near key={projects[index].slug} x={slot.x} z={slot.z} radius={90}><ProjectKiosk index={index} /></Near>
  ) : null);
}

/* ---------- Skills Garden: one glowing pillar per skill group behind the museum ---------- */

function SkillPillar({ index }: { index: number }) {
  const group = profile.skillGroups[index];
  const { x, z, rotation } = SKILLS.pillars[index];
  const ring = useRef<Mesh>(null);
  const board = useMemo(() => textTexture(640, 420, INK, [
    [group.title.toUpperCase(), 64, CREAM, 700, 6],
    ...group.items.map((item) => [item, 30, "#d5dee2", 500] as [string, number, string, number]),
    ["Click for projects using these →", 24, "#e0b46a", 600, 2],
  ]), [group]);
  useFrame(({ clock }) => {
    if (ring.current) (ring.current.material as MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 2 + index) * 0.4;
  });
  return (
    <group position={[x, 0, z]} rotation-y={rotation} {...clickable(() => openWorldPanel({ kind: "skill", index }))}>
      <mesh position-y={2.2} castShadow><cylinderGeometry args={[0.7, 0.9, 4.4, 6]} /><meshStandardMaterial color="#efeae0" /></mesh>
      <mesh ref={ring} position-y={4.55}><torusGeometry args={[0.95, 0.12, 10, 32]} /><meshStandardMaterial color="#9fe3ff" emissive="#5fd0ff" emissiveIntensity={0.8} /></mesh>
      <mesh position={[0, 3, 0.95]}><planeGeometry args={[4.4, 2.9]} /><meshBasicMaterial map={board} toneMapped={false} /></mesh>
    </group>
  );
}

export function SkillsGarden() {
  const sign = useMemo(() => textTexture(1024, 160, INK, [["SKILLS GARDEN", 76, CREAM, 700, 12]]), []);
  return (
    <Near x={SKILLS.x} z={SKILLS.z} radius={100}>
      <group>
        <mesh rotation-x={-Math.PI / 2} position={[SKILLS.x, 0.05, SKILLS.z]} receiveShadow><circleGeometry args={[SKILLS.radius + 5, 48]} /><meshStandardMaterial color="#d9d1bf" /></mesh>
        <mesh position={[SKILLS.x, 0.45, SKILLS.z + 12]} rotation-x={-0.5}><boxGeometry args={[6, 1, 0.3]} /><meshStandardMaterial color={INK} /></mesh>
        <mesh position={[SKILLS.x, 0.47, SKILLS.z + 12.17]} rotation-x={-0.5}><planeGeometry args={[5.7, 0.89]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
        {profile.skillGroups.map((g, i) => <SkillPillar key={g.title} index={i} />)}
      </group>
    </Near>
  );
}

/* ---------- Journey Walk: career milestones along a lantern-lit path ---------- */

function Milestone({ index }: { index: number }) {
  const step = profile.journey[index];
  const lantern = useRef<Group>(null);
  const board = useMemo(() => textTexture(640, 380, "#f4ecdc", [
    [step.period, 40, "#c4492f", 700, 4],
    [step.title, 52, INK, 700],
    [step.detail.length > 46 ? `${step.detail.slice(0, 46)}…` : step.detail, 26, "#4a5358", 500],
    ["Click to read more →", 24, "#c4492f", 600, 2],
  ]), [step]);
  useFrame(({ clock }) => {
    if (lantern.current) lantern.current.position.y = 4.2 + Math.sin(clock.elapsedTime * 1.4 + index) * 0.12;
  });
  return (
    <group position={[JOURNEY.stops[index], 0, JOURNEY.z]} {...clickable(() => openWorldPanel({ kind: "journey", index }))}>
      <mesh position-y={2} castShadow><boxGeometry args={[6.4, 4, 0.3]} /><meshStandardMaterial color="#6d5038" /></mesh>
      <mesh position={[0, 2.1, 0.16]}><planeGeometry args={[6, 3.55]} /><meshBasicMaterial map={board} toneMapped={false} /></mesh>
      <group ref={lantern} position={[3.6, 4.2, 0.4]}>
        <mesh><sphereGeometry args={[0.32, 14, 10]} /><meshStandardMaterial color="#fff2cf" emissive="#ffc861" emissiveIntensity={1.2} /></mesh>
      </group>
      <mesh position={[3.6, 2.2, 0.4]}><cylinderGeometry args={[0.06, 0.08, 4, 8]} /><meshStandardMaterial color="#2c3438" /></mesh>
    </group>
  );
}

export function JourneyWalk() {
  const first = JOURNEY.stops[0];
  const last = JOURNEY.stops[JOURNEY.stops.length - 1];
  const sign = useMemo(() => textTexture(1024, 160, INK, [["JOURNEY WALK →", 76, CREAM, 700, 10]]), []);
  return (
    <Near x={(first + last) / 2} z={JOURNEY.z} radius={110}>
      <group>
        <mesh rotation-x={-Math.PI / 2} position={[(first + last) / 2, 0.05, JOURNEY.z + 4]} receiveShadow>
          <planeGeometry args={[last - first + 14, 3.2]} /><meshStandardMaterial color="#d9c99e" />
        </mesh>
        <mesh position={[first - 8, 1.3, JOURNEY.z + 4]} rotation-y={Math.PI / 2}><planeGeometry args={[6, 0.95]} /><meshBasicMaterial map={sign} toneMapped={false} side={2} /></mesh>
        {profile.journey.map((step, i) => <Milestone key={step.period} index={i} />)}
      </group>
    </Near>
  );
}

/* ---------- Contact Pier: booth at the end of the pier ---------- */

export function ContactPier() {
  const sign = useMemo(() => textTexture(1024, 300, "#c4492f", [
    ["LET’S BUILD SOMETHING", 72, "#fff6e8", 700, 6],
    [profile.email, 40, "#ffe2c4", 600],
    ["Click for email, résumé & socials", 30, "#ffe2c4", 500],
  ]), []);
  return (
    <group position={[CONTACT_BOOTH.x, 0.4, CONTACT_BOOTH.z]} rotation-y={Math.PI} {...clickable(() => openWorldPanel({ kind: "contact" }))}>
      <mesh position-y={1.3} castShadow><boxGeometry args={[4.6, 2.6, 2.4]} /><meshStandardMaterial color="#f4ece0" /></mesh>
      <mesh position={[0, 2.8, 0.2]} rotation-x={0.15}><boxGeometry args={[5.4, 0.2, 3.2]} /><meshStandardMaterial color="#c4492f" /></mesh>
      <mesh position={[0, 4.3, -0.3]}><planeGeometry args={[5.4, 1.6]} /><meshBasicMaterial map={sign} toneMapped={false} side={2} /></mesh>
      {[-2.6, 2.6].map((x) => <mesh key={x} position={[x, 3.7, -0.3]}><boxGeometry args={[0.14, 2.2, 0.14]} /><meshStandardMaterial color="#2c3438" /></mesh>)}
    </group>
  );
}

/* ---------- Lighthouse Point: striped tower with a rotating beam ---------- */

export function Lighthouse() {
  const beam = useRef<Group>(null);
  useFrame((_, delta) => { if (beam.current) beam.current.rotation.y += delta * 0.8; });
  return (
    <group position={[LIGHTHOUSE.x, 0, LIGHTHOUSE.z]}>
      <mesh position-y={0.4} receiveShadow><cylinderGeometry args={[5, 5.4, 0.8, 32]} /><meshStandardMaterial color="#cfc6b4" /></mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position-y={0.8 + i * 3.3 + 1.65} castShadow>
          <cylinderGeometry args={[2.9 - (i + 1) * 0.16, 2.9 - i * 0.16, 3.3, 24]} />
          <meshStandardMaterial color={i % 2 ? "#f4f1ea" : "#c4492f"} />
        </mesh>
      ))}
      <mesh position-y={21.1}><cylinderGeometry args={[2.6, 2.6, 0.4, 24]} /><meshStandardMaterial color="#2c3438" /></mesh>
      <mesh position-y={22.6}><cylinderGeometry args={[1.5, 1.5, 2.6, 16]} /><meshStandardMaterial color="#cfe9f3" transparent opacity={0.45} /></mesh>
      <mesh position-y={22.6}><sphereGeometry args={[0.7, 16, 12]} /><meshBasicMaterial color="#fff3c4" toneMapped={false} /></mesh>
      <mesh position-y={24.6}><coneGeometry args={[1.9, 1.6, 16]} /><meshStandardMaterial color="#2c3438" /></mesh>
      <group ref={beam} position-y={22.6}>
        <mesh position={[0, 0, 14]} rotation-x={-Math.PI / 2}><coneGeometry args={[3.2, 28, 20, 1, true]} /><meshBasicMaterial color="#fff6d6" transparent opacity={0.16} depthWrite={false} toneMapped={false} /></mesh>
      </group>
    </group>
  );
}

/* ---------- Experiments inside the pavilion ---------- */

export function ExperimentStands() {
  return experiments.map((experiment, i) => {
    const angle = (i / experiments.length) * Math.PI * 2;
    return <ExperimentStand key={experiment.slug} index={i} x={Math.sin(angle) * 6.4} z={Math.cos(angle) * 6.4} rotation={angle} />;
  });
}

function ExperimentStand({ index, x, z, rotation }: { index: number; x: number; z: number; rotation: number }) {
  const experiment = experiments[index];
  const screen = useMemo(() => textTexture(512, 320, "#102029", [
    [experiment.title.toUpperCase(), 44, "#9fe3ff", 700, 2],
    [experiment.category, 26, "#b9c6cc", 500],
    [experiment.technologies.slice(0, 3).join(" · "), 24, "#e0b46a", 600],
  ]), [experiment]);
  return (
    <group position={[x, 0.6, z]} rotation-y={rotation} {...clickable(() => openWorldPanel({ kind: "experiment", slug: experiment.slug }))}>
      <mesh position-y={0.55}><boxGeometry args={[0.5, 1.1, 0.5]} /><meshStandardMaterial color="#26323a" /></mesh>
      <mesh position={[0, 1.55, 0]} rotation-x={-0.25}><boxGeometry args={[2.2, 1.4, 0.08]} /><meshStandardMaterial color="#26323a" /></mesh>
      <mesh position={[0, 1.55, 0.05]} rotation-x={-0.25}><planeGeometry args={[2.05, 1.28]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
    </group>
  );
}
