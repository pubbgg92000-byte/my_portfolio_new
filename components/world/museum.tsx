"use client";

import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SRGBColorSpace } from "three";
import { projects } from "@/content/projects/projects";
import { profile } from "@/content/profile";
import { MUSEUM, PLAZA } from "./layout";
import { Model } from "./model";
import { MuseumInterior } from "./museum-interior";
import { clickToOpen, openWorldPanel } from "./places";
import { Fountain } from "./fountain";
import { textTexture } from "./textures";

const FEATURED = ["meals-sdk-monorepo", "staffly", "apex-admin-panels"];
const featured = FEATURED.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p?.image) as typeof projects;
const BRONZE = "#2f3a40";

function Banner({ src, title, x, slug }: { src: string; title: string; x: number; slug: string }) {
  const image = useTexture(src);
  image.colorSpace = SRGBColorSpace;
  const label = useMemo(() => textTexture(512, 160, "#14202a", [[title.toUpperCase(), 54, "#f6efe1", 700, 4], ["NOW SHOWING", 26, "#e0b46a", 600, 8]]), [title]);
  return (
    <group position={[x, 10.6, 22.2]} scale={1.35} {...clickToOpen(() => openWorldPanel({ kind: "project", slug }))}>
      <mesh position-y={1.2}><planeGeometry args={[6, 4.2]} /><meshBasicMaterial map={image} toneMapped={false} /></mesh>
      <mesh position-y={-1.9}><planeGeometry args={[6, 1.9]} /><meshBasicMaterial map={label} toneMapped={false} /></mesh>
      <mesh position={[0, 3.45, 0]}><boxGeometry args={[6.4, 0.18, 0.18]} /><meshStandardMaterial color="#c9a45c" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  );
}

/** Light procedural fountain first; the downloaded animated fountain (8.5 MB) swaps in once the opening view has loaded. */
function FountainSpot() {
  const [upgrade, setUpgrade] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setUpgrade(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);
  if (!upgrade) return <Fountain />;
  return (
    <Suspense fallback={<Fountain />}>
      <Model name="fountain-sim" length={12.5} position={[PLAZA.x, 0.02, PLAZA.z]} shadows />
    </Suspense>
  );
}

function TicketBooth({ onOpen }: { onOpen: () => void }) {
  const sign = useMemo(() => textTexture(512, 192, "#c4492f", [["ART TICKETS", 64, "#fff6e8", 700, 6], ["Free entry · Click to collect", 28, "#ffe2c4", 500]]), []);
  return (
    <group position={[-15, 0, 12]} rotation-y={0.35}
      onClick={(event) => { event.stopPropagation(); onOpen(); }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}>
      <mesh position-y={1.4} castShadow><boxGeometry args={[4, 2.8, 3]} /><meshStandardMaterial color="#f4ece0" /></mesh>
      <mesh position={[0, 1.6, 1.51]}><planeGeometry args={[2.6, 1.2]} /><meshStandardMaterial color="#20313a" metalness={0.4} roughness={0.2} /></mesh>
      <mesh position={[0, 3.25, 0.2]} rotation-x={0.2} castShadow><boxGeometry args={[4.8, 0.2, 3.8]} /><meshStandardMaterial color="#c4492f" /></mesh>
      <mesh position={[0, 3.9, 1.6]}><planeGeometry args={[4, 1.5]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
    </group>
  );
}

/** The Portfolio Museum: the brightest, tallest landmark of the world. */
export function Museum({ onTicket }: { onTicket: () => void }) {
  const { width, depth, height } = MUSEUM;
  const title = useMemo(() => textTexture(2048, 256, BRONZE, [[`${profile.shortName.toUpperCase()} · PORTFOLIO MUSEUM`, 112, "#f3e6c8", 700, 18], ["FRONTEND · AI AUTOMATION · SELECTED WORKS", 40, "#e0b46a", 600, 10]]), []);
  const columns = Array.from({ length: 10 }, (_, i) => -width / 2 + 3 + i * ((width - 6) / 9));
  return (
    <group>
      <group position={[MUSEUM.x, 0, MUSEUM.z]}>
        {/* Podium and front steps. */}
        <mesh position-y={0.75} receiveShadow castShadow><boxGeometry args={[width + 8, 1.5, depth + 8]} /><meshStandardMaterial color="#e4ddcf" /></mesh>
        {[0, 1, 2].map((step) => (
          <mesh key={step} position={[0, 0.25 * (step + 1), depth / 2 + 4.55 + (2 - step) * 1.1]} receiveShadow>
            <boxGeometry args={[30 - step * 2, 0.5 * (step + 1), 1.1]} /><meshStandardMaterial color="#e4ddcf" />
          </mesh>
        ))}
        {/* Colonnade in front of the glass hall (hall and interior: museum-interior.tsx). */}
        {columns.map((x) => (
          <mesh key={x} position={[x, 1.5 + height / 2, depth / 2 + 0.6]} castShadow><cylinderGeometry args={[0.75, 0.85, height, 20]} /><meshStandardMaterial color="#fbf8f2" roughness={0.5} /></mesh>
        ))}
        {/* Floating roof with lit fascia and title. */}
        <mesh position={[0, height + 2.6, 0.6]} castShadow><boxGeometry args={[width + 6, 2.2, depth + 6]} /><meshStandardMaterial color={BRONZE} roughness={0.5} metalness={0.4} /></mesh>
        <mesh position={[0, height + 1.45, depth / 2 + 3.65]}><boxGeometry args={[width + 6.2, 0.2, 0.2]} /><meshBasicMaterial color="#f2c46d" toneMapped={false} /></mesh>
        <mesh position={[0, height + 2.6, depth / 2 + 3.62]}><planeGeometry args={[width - 4, 2]} /><meshBasicMaterial map={title} toneMapped={false} /></mesh>
        <Suspense fallback={null}>
          {featured.map((project, i) => <Banner key={project.slug} slug={project.slug} src={project.image!.src} title={project.title} x={(i - 1) * 17} />)}
        </Suspense>
      </group>
      <MuseumInterior />
      <FountainSpot />
      <TicketBooth onOpen={onTicket} />
    </group>
  );
}
