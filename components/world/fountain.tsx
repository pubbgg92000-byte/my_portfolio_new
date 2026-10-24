"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, LatheGeometry, NormalBlending,
  RepeatWrapping, ShaderMaterial, Vector2,
} from "three";
import { PLAZA } from "./layout";
import { canvasTexture, rippleTexture } from "./textures";

const STONE = "#dcc6a0";
const STONE_DARK = "#b9a98c";
const WATER = "#2f9fc4";
const POOL_Y = 0.84;

/* ---------- GPU droplets: each point follows a ballistic arc computed in the vertex shader ---------- */

const dropletVertex = /* glsl */ `
  attribute vec3 aOrigin;
  attribute vec3 aVelocity;
  attribute float aPhase;
  uniform float uTime;
  uniform float uLife;
  uniform float uSize;
  uniform float uScale;
  varying float vFade;
  void main() {
    float t = mod(uTime + aPhase * uLife, uLife);
    vec3 p = aOrigin + aVelocity * t + vec3(0.0, -4.9 * t * t, 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale / -mv.z;
    vFade = 1.0 - smoothstep(0.75, 1.0, t / uLife);
  }
`;
const dropletFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity * vFade * smoothstep(0.5, 0.15, d));
  }
`;

type Jet = { origin: [number, number, number]; velocity: [number, number, number]; spread: number };

function Droplets({ jets, perJet, life, size, opacity, additive = false }: { jets: Jet[]; perJet: number; life: number; size: number; opacity: number; additive?: boolean }) {
  const { size: viewport, gl } = useThree();
  const { geometry, material } = useMemo(() => {
    const count = jets.length * perJet;
    const origin = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    let i = 0;
    let seed = 1;
    const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
    for (const jet of jets) {
      for (let n = 0; n < perJet; n++, i++) {
        origin.set(jet.origin, i * 3);
        velocity.set([jet.velocity[0] + rand() * jet.spread, jet.velocity[1] + rand() * jet.spread, jet.velocity[2] + rand() * jet.spread], i * 3);
        phase[i] = n / perJet + rand() * 0.02;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aOrigin", new BufferAttribute(origin, 3));
    geometry.setAttribute("aVelocity", new BufferAttribute(velocity, 3));
    geometry.setAttribute("aPhase", new BufferAttribute(phase, 1));
    const material = new ShaderMaterial({
      vertexShader: dropletVertex,
      fragmentShader: dropletFragment,
      transparent: true,
      depthWrite: false,
      blending: additive ? AdditiveBlending : NormalBlending,
      uniforms: {
        uTime: { value: 0 }, uLife: { value: life }, uSize: { value: size }, uScale: { value: 1 },
        uColor: { value: [0.86, 0.95, 1] }, uOpacity: { value: opacity },
      },
    });
    return { geometry, material };
  }, [jets, perJet, life, size, opacity, additive]);
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScale.value = viewport.height * gl.getPixelRatio() * 0.5;
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------- Stone shapes ---------- */

const profile = (points: [number, number][]) => new LatheGeometry(points.map(([x, y]) => new Vector2(x, y)), 48);

function Bowl({ y, radius }: { y: number; radius: number }) {
  // Shallow carved bowl: thick lip, curved underside.
  const geometry = useMemo(() => profile([
    [0.25, -0.75], [radius * 0.45, -0.6], [radius * 0.8, -0.32], [radius, -0.05], [radius + 0.12, 0.08],
    [radius + 0.12, 0.16], [radius - 0.12, 0.16], [radius - 0.18, 0.02], [0.25, -0.1],
  ]), [radius]);
  return <mesh geometry={geometry} position-y={y} castShadow receiveShadow><meshStandardMaterial color={STONE} roughness={0.75} side={DoubleSide} /></mesh>;
}

function Column({ from, to, radius }: { from: number; to: number; radius: number }) {
  const h = to - from;
  const geometry = useMemo(() => profile([
    [radius * 1.5, 0], [radius * 1.5, h * 0.06], [radius, h * 0.14], [radius * 0.85, h * 0.5],
    [radius, h * 0.86], [radius * 1.35, h * 0.95], [radius * 1.35, h],
  ]), [h, radius]);
  return <mesh geometry={geometry} position-y={from} castShadow><meshStandardMaterial color={STONE} roughness={0.7} /></mesh>;
}

/** Thin sheet of water spilling from a bowl lip, scrolling downward. */
function Curtain({ top, bottom, radius, flare, texture }: { top: number; bottom: number; radius: number; flare: number; texture: ReturnType<typeof canvasTexture> }) {
  return (
    <mesh position-y={(top + bottom) / 2}>
      <cylinderGeometry args={[radius, radius + flare, top - bottom, 48, 1, true]} />
      <meshStandardMaterial color="#d7f1fa" map={texture} alphaMap={texture} transparent opacity={0.7} depthWrite={false} side={DoubleSide} roughness={0.05} />
    </mesh>
  );
}

function WaterDisc({ y, radius, texture }: { y: number; radius: number; texture: ReturnType<typeof rippleTexture> }) {
  return (
    <mesh position-y={y} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[radius, 48]} />
      <meshStandardMaterial color={WATER} roughness={0.05} metalness={0.25} normalMap={texture} normalScale={[0.5, 0.5]} transparent opacity={0.92} />
    </mesh>
  );
}

/** Three-tier plaza fountain with a central jet, rim jets and spilling water. */
export function Fountain() {
  const { ripples, streaks } = useMemo(() => {
    const ripples = rippleTexture();
    ripples.repeat.set(3, 3);
    const streaks = canvasTexture({
      width: 64, height: 256, background: "#000000",
      draw: (context) => {
        for (let i = 0; i < 40; i++) {
          context.fillStyle = `rgba(255,255,255,${0.35 + (i % 4) * 0.15})`;
          context.fillRect((i * 37) % 64, (i * 53) % 256, 2 + (i % 3), 40 + (i % 5) * 18);
        }
      },
    });
    streaks.colorSpace = "";
    streaks.wrapS = streaks.wrapT = RepeatWrapping;
    streaks.repeat.set(10, 1);
    return { ripples, streaks };
  }, []);
  useFrame((_, delta) => {
    ripples.offset.x += delta * 0.05;
    ripples.offset.y += delta * 0.03;
    streaks.offset.y += delta * 1.4;
  });

  const jets = useMemo(() => {
    const centre: Jet[] = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return { origin: [0, 5.15, 0], velocity: [Math.cos(a) * 0.9, 6.4, Math.sin(a) * 0.9], spread: 0.35 };
    });
    const rim: Jet[] = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return { origin: [Math.cos(a) * 5.55, 1.0, Math.sin(a) * 5.55], velocity: [-Math.cos(a) * 2.8, 3.5, -Math.sin(a) * 2.8], spread: 0.12 };
    });
    const mist: Jet[] = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + 0.2;
      return { origin: [Math.cos(a) * 3.4, POOL_Y, Math.sin(a) * 3.4], velocity: [0, 1.1, 0], spread: 0.9 };
    });
    return { centre, rim, mist };
  }, []);

  return (
    <group position={[PLAZA.x, 0, PLAZA.z]}>
      {/* Outer pool: low wall, carved rim, step. */}
      <mesh position-y={0.12} receiveShadow><cylinderGeometry args={[7.4, 7.6, 0.24, 64]} /><meshStandardMaterial color={STONE_DARK} roughness={0.9} /></mesh>
      <mesh position-y={0.5} castShadow receiveShadow><cylinderGeometry args={[6.5, 6.7, 0.8, 64, 1, true]} /><meshStandardMaterial color={STONE} roughness={0.8} side={DoubleSide} /></mesh>
      <mesh position-y={0.92} rotation-x={Math.PI / 2} castShadow><torusGeometry args={[6.45, 0.3, 12, 72]} /><meshStandardMaterial color={STONE} roughness={0.7} /></mesh>
      <mesh position-y={0.3} rotation-x={-Math.PI / 2}><circleGeometry args={[6.4, 64]} /><meshStandardMaterial color="#2f6f80" roughness={1} /></mesh>
      <WaterDisc y={POOL_Y} radius={6.3} texture={ripples} />
      {/* Tiers. */}
      <Column from={0.3} to={2.25} radius={0.55} />
      <Bowl y={2.4} radius={3.1} />
      <WaterDisc y={2.5} radius={2.9} texture={ripples} />
      <Curtain top={2.5} bottom={POOL_Y} radius={3.18} flare={0.35} texture={streaks} />
      <Column from={2.5} to={3.85} radius={0.32} />
      <Bowl y={4.0} radius={1.7} />
      <WaterDisc y={4.08} radius={1.55} texture={ripples} />
      <Curtain top={4.08} bottom={2.52} radius={1.78} flare={0.25} texture={streaks} />
      <Column from={4.1} to={4.85} radius={0.18} />
      <mesh position-y={5.0} castShadow><sphereGeometry args={[0.28, 20, 14]} /><meshStandardMaterial color={STONE} roughness={0.6} /></mesh>
      {/* Water in motion. */}
      <Droplets jets={jets.centre} perJet={26} life={1.35} size={0.16} opacity={0.75} />
      <Droplets jets={jets.rim} perJet={22} life={0.8} size={0.12} opacity={0.7} />
      <Droplets jets={jets.mist} perJet={10} life={0.5} size={0.22} opacity={0.25} additive />
    </group>
  );
}
