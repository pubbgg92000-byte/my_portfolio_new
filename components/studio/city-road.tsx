"use client";

import { useEffect, useMemo, useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { Vector3, SRGBColorSpace } from "three";
import gsap from "gsap";
import { projects } from "@/content/projects/projects";
import { CityBuildings } from "./city-buildings";

function Screen({ src }: { src: string }) {
  const texture = useTexture(src);
  texture.colorSpace = SRGBColorSpace;
  return <mesh position={[0, 0, .18]}><planeGeometry args={[7.6, 4.3]} /><meshBasicMaterial map={texture} /></mesh>;
}

export function CityRoad({ district, playing, onProject }: { district: number; playing: boolean; onProject: (slug: string) => void }) {
  const { camera } = useThree();
  const travel = useRef({ z: 18 });
  const target = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const tween = gsap.to(travel.current, { z: 18 - district * 24, duration: 2.4, ease: "power2.inOut" });
    return () => { tween.kill(); };
  }, [district]);
  useFrame((_, delta) => {
    if (playing) travel.current.z = Math.max(-145, travel.current.z - Math.min(delta, .05) * 4);
    target.set(0, 3.8, travel.current.z);
    camera.position.lerp(target, .08);
    camera.lookAt(0, 3, travel.current.z - 25);
  });
  return <>
    <color attach="background" args={["#a6b9cb"]} />
    <fog attach="fog" args={["#a6b9cb", 60, 200]} />
    <hemisphereLight args={["#d6edff", "#76664e", 2]} />
    <directionalLight position={[-30, 45, 20]} intensity={3} color="#ffe1ae" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.12, -70]}><planeGeometry args={[230, 260]} /><meshStandardMaterial color="#667361" /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -70]}><planeGeometry args={[14, 240]} /><meshStandardMaterial color="#30363b" roughness={.96} /></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * 10, .1, -70]}><boxGeometry args={[6, .2, 240]} /><meshStandardMaterial color="#b8b6ac" /></mesh>)}
    {Array.from({ length: 40 }, (_, index) => <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={[0, .015, 30 - index * 6]}><planeGeometry args={[.12, 2.6]} /><meshBasicMaterial color="#ede1a5" /></mesh>)}
    {Array.from({ length: 8 }, (_, index) => <group key={index} position={[0, .025, 5 - index * 24]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 7]} /><meshStandardMaterial color="#363c40" /></mesh>
      {[-1, 1].map(side => <group key={side} position={[side * 8, 0, -7]}>
        <mesh position={[0, 3, 0]}><cylinderGeometry args={[.08, .12, 6, 8]} /><meshStandardMaterial color="#343e44" /></mesh>
        <mesh position={[-side * .7, 6, 0]}><boxGeometry args={[1.7, .12, .4]} /><meshStandardMaterial color="#ffe4b0" emissive="#ffcc77" emissiveIntensity={1} /></mesh>
      </group>)}
    </group>)}
    <Suspense fallback={null}><CityBuildings /></Suspense>
    {projects.map((project, index) => <group key={project.slug} position={[index % 2 ? 10.5 : -10.5, 6, -index * 20]} rotation={[0, index % 2 ? -.28 : .28, 0]}>
      <mesh onClick={() => onProject(project.slug)}><boxGeometry args={[8, 4.7, .3]} /><meshStandardMaterial color="#19252e" /></mesh>
      <mesh position={[0, -4, 0]}><boxGeometry args={[.3, 4, .4]} /><meshStandardMaterial color="#39444b" /></mesh>
      {project.image ? <Suspense fallback={null}><Screen src={project.image.src} /></Suspense> : null}
      <Html position={[0, -2.6, .25]} center distanceFactor={18}><button type="button" onClick={() => onProject(project.slug)} style={{ background: "#15232c", color: "white", padding: "10px 18px", border: "1px solid #91b9c7", whiteSpace: "nowrap", cursor: "pointer" }}>{project.title} ↗</button></Html>
    </group>)}
  </>;
}
