"use client";

import { Clone, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Vector3 } from "three";

/** Reuses one downloaded GLB and its textures across the city skyline. */
export function CityBuildings() {
  const { scene } = useGLTF("/models/city/simple-building.glb");
  const placement = useMemo(() => {
    scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 12 / Math.max(size.y, 0.001);
    return { scale, offset: [-center.x, -bounds.min.y, -center.z] as [number, number, number] };
  }, [scene]);

  return (
    <group>
      {[-1, 1].flatMap((side) => Array.from({ length: 16 }, (_, index) => (
        <group key={`${side}-${index}`} position={[side * (index % 2 ? 32 : 20), 0, 16 - index * 12]} rotation={[0, side * Math.PI / 2, 0]} scale={placement.scale * (1.2 + (index % 4) * .25)}>
          <group position={placement.offset}><Clone object={scene} /></group>
        </group>
      )))}
    </group>
  );
}
