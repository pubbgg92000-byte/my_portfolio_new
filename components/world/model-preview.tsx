"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { MODEL_URLS, Model, type ModelName } from "./model";

const names = Object.keys(MODEL_URLS) as ModelName[];

export function ModelPreview() {
  const [only, setOnly] = useState<ModelName | null>(null);
  useEffect(() => setOnly(new URLSearchParams(location.search).get("m") as ModelName | null), []);
  if (only) return (
    <main style={{ position: "fixed", inset: 0, background: "#9fb7c9" }}>
      <Canvas camera={{ position: [0, 7, 22], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 4, 0)}>
        <hemisphereLight args={["#ffffff", "#667", 2.4]} />
        <directionalLight position={[10, 20, 10]} intensity={2} />
        <gridHelper args={[40, 20]} /><axesHelper args={[8]} />
        <Suspense fallback={null}><Model name={only} height={8} /></Suspense>
      </Canvas>
    </main>
  );
  return (
    <main style={{ position: "fixed", inset: 0, background: "#9fb7c9" }}>
      <Canvas camera={{ position: [24, 36, 52], fov: 45 }}>
        <hemisphereLight args={["#ffffff", "#667", 2.4]} />
        <directionalLight position={[10, 20, 10]} intensity={2} />
        <gridHelper args={[80, 16]} />
        {names.map((name, index) => {
          const x = (index % 6) * 8 - 20;
          const z = Math.floor(index / 6) * 8 - 20;
          return (
            <group key={name} position={[x, 0, z]}>
              <Suspense fallback={null}><Model name={name} height={4} /></Suspense>
              <Html position={[0, -0.6, 2.6]} center style={{ font: "11px sans-serif", background: "#fff", padding: "1px 4px", whiteSpace: "nowrap" }}>{name}</Html>
            </group>
          );
        })}
        <OrbitControls />
      </Canvas>
    </main>
  );
}
