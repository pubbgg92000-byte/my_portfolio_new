"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import Link from "next/link";
import styles from "./city-foundation.module.css";

// World units are metres. This is deliberately only the city foundation.
const SIZE_METRES = 1000;

function Ground({ resetKey }: { resetKey: number }) {
  const { camera } = useThree();
  return <>
    <color attach="background" args={["#cbd9e3"]} />
    <hemisphereLight args={["#ffffff", "#a7aca0", 2]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[SIZE_METRES, SIZE_METRES]} />
      <meshStandardMaterial color="#939c89" roughness={1} />
    </mesh>
    <OrbitControls key={resetKey} makeDefault target={[0, 0, 0]} minDistance={20} maxDistance={2000} maxPolarAngle={Math.PI / 2 - .025} enableDamping={false} onStart={() => camera.updateProjectionMatrix()} />
  </>;
}

export function CityFoundation({ forceFallback = false }: { forceFallback?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  return <main className={styles.world}>
    {!forceFallback && !failed ? <Canvas key={resetKey} dpr={[1, 1.5]} camera={{ position: [850, 720, 850], fov: 50, near: 1, far: 5000 }} onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", () => setFailed(true), { once: true })} aria-label="Empty flat one kilometre square ground plane. Drag to orbit and scroll to zoom.">
      <Ground resetKey={resetKey} />
    </Canvas> : <div className={styles.fallback} role="status">3D preview unavailable. The foundation is a flat 1,000 × 1,000 metre plane.</div>}
    <header className={styles.header}><div><span>ARVIND / CITY FOUNDATION</span><h1>1 km × 1 km</h1><p>Flat ground · 1,000,000 m² · No buildings yet</p></div><Link href="/">Classic portfolio ↗</Link></header>
    <footer className={styles.footer}><p>Drag to orbit · Scroll or pinch to zoom · Right-drag to pan</p><button type="button" onClick={() => setResetKey(value => value + 1)}>Reset view</button></footer>
  </main>;
}
