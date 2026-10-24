"use client";

import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { type CatmullRomCurve3, type Group } from "three";
import { POND, ringCurve } from "./layout";
import { Model, type ModelName } from "./model";
import { facingAlong } from "./motion";

type CarProps = { curve: CatmullRomCurve3; start: number; speed: number; name: ModelName; facing: number; length: number };

function Car({ curve, start, speed, name, facing, length }: CarProps) {
  const ref = useRef<Group>(null);
  const total = useMemo(() => curve.getLength(), [curve]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (((start + (clock.elapsedTime * speed) / total) % 1) + 1) % 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).multiplyScalar(Math.sign(speed));
    ref.current.position.set(point.x, 0.12, point.z);
    ref.current.rotation.y = facingAlong(tangent.x, tangent.z, facing);
  });
  return <group ref={ref}><Model name={name} length={length} animation={false} shadows /></group>;
}

/** Something that circles in the sky, banking slightly. */
function Flyer({ name, radius, height, speed, centre = [0, 0], length, phase = 0, facing = 0, animation }: { name: ModelName; radius: number; height: number; speed: number; centre?: [number, number]; length: number; phase?: number; facing?: number; animation?: string }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const angle = phase + clock.elapsedTime * speed;
    ref.current.position.set(centre[0] + Math.cos(angle) * radius, height + Math.sin(angle * 2) * 1.5, centre[1] + Math.sin(angle) * radius);
    ref.current.rotation.set(0, -angle + facing + (speed < 0 ? Math.PI : 0), 0);
  });
  return <group ref={ref}><Model name={name} length={length} animation={animation} /></group>;
}

const SEDAN_FACING = 0; // Kenney sedan's nose points to +z.
// Rotation that turns each model's nose to +z (checked in /3d/preview side views).
const CARS: { name: ModelName; facing: number; length: number }[] = [
  { name: "sedan", facing: SEDAN_FACING, length: 4.4 },
  { name: "sports-car", facing: -Math.PI / 2, length: 4.3 },
  { name: "retro-car", facing: Math.PI / 2, length: 3.6 },
  { name: "dirty-car", facing: 0, length: 4.1 },
];

export function Traffic() {
  const outer = useMemo(() => ringCurve(3), []);
  const inner = useMemo(() => ringCurve(-3), []);
  const cars: CarProps[] = [
    ...[0, 0.17, 0.36, 0.58, 0.79].map((start, i) => ({ curve: outer, start, speed: 11 + i, ...CARS[i % CARS.length] })),
    ...[0.08, 0.45].map((start) => ({ curve: outer, start, speed: 15, name: "supercar" as const, facing: 0, length: 4.8 })),
    ...[0.05, 0.3, 0.52, 0.71, 0.9].map((start, i) => ({ curve: inner, start, speed: -(10 + i), ...CARS[(i + 2) % CARS.length] })),
  ];
  return (
    <>{cars.map((car, i) => <Suspense key={i} fallback={null}><Car {...car} /></Suspense>)}</>
  );
}

export function SkyLife() {
  return (
    <>
      <Suspense fallback={null}><Flyer name="plane" length={9} radius={150} height={55} speed={0.11} /></Suspense>
      <Suspense fallback={null}>
        {[0, 0.4, 0.8, 1.2].map((phase) => <Flyer key={phase} name="flying-bird" length={1.1} radius={40 + phase * 6} height={22 + phase * 3} speed={0.25} phase={phase} centre={[-30, 20]} />)}
        {[0, 2.1].map((phase) => <Flyer key={phase} name="flying-bird" length={1} radius={30} height={14} speed={0.3} phase={phase} centre={[POND.x, POND.z]} />)}
        <Flyer name="hummingbird" length={0.5} radius={6} height={2.2} speed={0.8} centre={[POND.x + 10, POND.z + 22]} />
      </Suspense>
    </>
  );
}
