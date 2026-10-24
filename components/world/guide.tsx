"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { groundHeight } from "./layout";
import { Model } from "./model";
import { TOUR, type TourEvent, robotRoute } from "./tour";
import styles from "./world.module.css";

const SPEED = 4.2;
/** Legs longer than this are skipped: ARIA "beams" ahead so the visitor never waits. */
const BEAM_DISTANCE = 45;
type Pose = "Wave" | "Walking" | "Idle";

/** ARIA, the robot guide: waits at the plaza, then walks each tour stop (through the museum door, never through walls). */
export function Guide() {
  const body = useRef<Group>(null);
  const position = useRef<[number, number]>([...TOUR[0].robot]);
  const route = useRef<[number, number][]>([]);
  const waveUntil = useRef(0);
  const [pose, setPose] = useState<Pose>("Wave");
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    const onTour = (event: Event) => {
      const { step } = (event as CustomEvent<TourEvent>).detail;
      setTouring(step !== null);
      if (step === null) { route.current = []; return; }
      const legs = robotRoute(position.current, TOUR[step].robot);
      // Beam over any very long leg; keep walking the short ones.
      let start = position.current;
      const walk: [number, number][] = [];
      for (const point of legs) {
        if (Math.hypot(point[0] - start[0], point[1] - start[1]) > BEAM_DISTANCE) { walk.length = 0; position.current = [...point]; }
        else walk.push(point);
        start = point;
      }
      route.current = walk;
    };
    window.addEventListener("world:tour", onTour);
    return () => window.removeEventListener("world:tour", onTour);
  }, []);

  useFrame(({ camera, clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const group = body.current;
    if (!group) return;
    const [x, z] = position.current;
    const next = route.current[0];
    let wanted: Pose;
    if (next) {
      const dx = next[0] - x;
      const dz = next[1] - z;
      const distance = Math.hypot(dx, dz);
      const step = Math.min(distance, SPEED * delta);
      position.current = distance < 0.05 ? [...next] : [x + (dx / distance) * step, z + (dz / distance) * step];
      if (distance < 0.05) {
        route.current.shift();
        if (!route.current.length) waveUntil.current = clock.elapsedTime + 2.5;
      }
      group.rotation.y = Math.atan2(dx, dz);
      wanted = "Walking";
    } else {
      // Face the visitor while waiting.
      group.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z);
      wanted = !touring || clock.elapsedTime < waveUntil.current ? "Wave" : "Idle";
    }
    group.position.set(position.current[0], groundHeight(position.current[0], position.current[1]) + 0.05, position.current[1]);
    if (wanted !== pose) setPose(wanted);
  });

  return (
    <group ref={body} position={[TOUR[0].robot[0], 0.05, TOUR[0].robot[1]]}
      onClick={(event) => { event.stopPropagation(); if (!touring) window.dispatchEvent(new CustomEvent("world:tour-start")); }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}>
      <Suspense fallback={null}><Model name="robot" height={1.6} animation={pose} timeScale={pose === "Walking" ? 1.4 : 1} shadows /></Suspense>
      <Html position={[0, 2.25, 0]} center distanceFactor={9} zIndexRange={[5, 0]}>
        <span className={styles.guideTag}>{touring ? "ARIA · FOLLOW ME" : "ARIA · CLICK FOR A TOUR"}</span>
      </Html>
    </group>
  );
}
