// World layout in metres. North is -z; the visitor spawns south of the museum facing north.
import { CatmullRomCurve3, Vector3 } from "three";

export const ISLAND_RADIUS = 236;
export const BEACH_RADIUS = 262;
export const EYE_HEIGHT = 1.7;

export const MUSEUM = { x: 0, z: -22, width: 64, depth: 40, height: 18 } as const;
export const PLAZA = { x: 0, z: 30, radius: 30 } as const;
export const POND = { x: -78, z: -24, radius: 18 } as const;
export const PIER = { x: 0, width: 6, from: 236, to: 300 } as const;

export const RING = { halfWidth: 120, halfDepth: 112, corner: 24, roadWidth: 12 } as const;
export const AVENUE = { x: 0, width: 10, from: 60, to: 238 } as const;

/** Project Avenue displays, alternating sides of the avenue (avoids the ring-road crossing at z≈112). */
export const PROJECT_SLOTS = [78, 92, 132, 146, 160, 174, 188].map((z, i) => ({ x: i % 2 ? 17 : -17, z }));
/** Skills Garden behind the museum: pillars on an arc facing the entry point to the south. */
export const SKILLS = {
  x: 0, z: -66, radius: 15,
  pillars: [-56, -28, 0, 28, 56].map((degrees) => {
    const a = (degrees * Math.PI) / 180;
    return { x: Math.sin(a) * 15, z: -66 - Math.cos(a) * 15, rotation: -a };
  }),
} as const;
/** Journey Walk: milestones west to east, boards facing south. */
export const JOURNEY = { z: -80, stops: [-96, -80, -64, -48] } as const;
export const CONTACT_BOOTH = { x: 0, z: 296 } as const;
export const LIGHTHOUSE = { x: 150, z: 175 } as const;

/** Museum hall in world coordinates (floor sits on the 1.5 m podium). */
export const HALL = { minX: -32, maxX: 32, minZ: -42, maxZ: -6, floor: 1.5, door: 3.5 } as const;
export const insideHall = (x: number, z: number) => x > HALL.minX && x < HALL.maxX && z > HALL.minZ && z < HALL.maxZ;

/** Walkable surface height: podium and interior at 1.5 m, front steps as a ramp, pier deck at 0.4 m. */
export function groundHeight(x: number, z: number) {
  const onPier = Math.abs(x - PIER.x) < PIER.width / 2 && z > PIER.from - 2;
  if (onPier) return 0.4;
  if (Math.abs(x) < 36 && z > -46 && z < 2) return HALL.floor;
  if (Math.abs(x) < 15 && z >= 2 && z < 5.3) return HALL.floor * (5.3 - z) / 3.3;
  return 0;
}

/** Exhibits inside the museum. Walls: left x=-31.4 faces +x, right x=31.4 faces -x, back z=-41.4 faces +z. */
export const EXHIBITS = {
  left: [-12, -20, -28, -36].map((z) => ({ x: -31.3, z })),
  right: [-14, -24, -34].map((z) => ({ x: 31.3, z })),
  vitrines: [[-9, -22], [9, -22], [-9, -32], [9, -32]] as [number, number][],
  painting: { x: 0, z: -41 },
  desk: { x: -24, z: -13 },
} as const;

export type Place = { id: string; label: string; position: [number, number]; yaw: number; description?: string };
/** Quick-travel spots. yaw is the camera heading in radians (0 = looking north). */
export const PLACES: Place[] = [
  { id: "entrance", label: "Museum entrance", position: [0, 60], yaw: 0 },
  { id: "museum", label: "Museum interior", position: [0, -8.5], yaw: 0, description: "Project frames, artifacts and the Van Gogh" },
  { id: "plaza", label: "Fountain plaza", position: [11, 43], yaw: 0.7, description: "Three-tier fountain in front of the museum" },
  { id: "park", label: "Pond park", position: [-56, 6], yaw: 0.9 },
  { id: "pavilion", label: "Experiments pavilion", position: [62, 16], yaw: 0 },
  { id: "city", label: "City district", position: [60, 124], yaw: -0.93, description: "Ring road traffic and the city skyline" },
  { id: "beach", label: "Beach & pier", position: [0, 226], yaw: Math.PI },
  { id: "projects", label: "Project Avenue", position: [0, 70], yaw: Math.PI, description: "A display for every project along the avenue" },
  { id: "skills", label: "Skills Garden", position: [0, -47.5], yaw: 0, description: "One glowing pillar per skill group" },
  { id: "journey", label: "Journey Walk", position: [-72, -47], yaw: 0, description: "Career milestones along a lantern path" },
  { id: "contact", label: "Contact Pier", position: [0, 280], yaw: Math.PI, description: "Email, résumé and socials at the end of the pier" },
  { id: "lighthouse", label: "Lighthouse Point", position: [118, 139], yaw: -2.42, description: "Striped lighthouse with a rotating beam" },
  { id: "cafe", label: "Food stand courtyard", position: [-21, 46], yaw: .25, description: "Your downloaded food stand beside the plaza" },
  { id: "aviation", label: "Aviation lawn", position: [73, 71], yaw: 0, description: "Helicopter and vintage plane exhibits" },
  { id: "sculpture", label: "Sculpture grove", position: [-77, 75], yaw: 0, description: "Creatures and robots among trees" },
  { id: "architecture", label: "Architecture garden", position: [64, -68], yaw: 0, description: "Downloaded gallery house and loft displays" },
  { id: "coast", label: "Tropical coast", position: [-30, 240], yaw: 2.45, description: "Beach grasses, water and the tropical island" },
];

export type Box = { minX: number; maxX: number; minZ: number; maxZ: number };
export const box = (x: number, z: number, width: number, depth: number): Box => ({
  minX: x - width / 2, maxX: x + width / 2, minZ: z - depth / 2, maxZ: z + depth / 2,
});

/** Seeded random so the city looks the same on every visit. */
export function random(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/** Closed rounded-rectangle path used for the ring road lanes. */
export function ringCurve(offset: number) {
  const hw = RING.halfWidth + offset;
  const hd = RING.halfDepth + offset;
  const r = RING.corner + offset;
  const points: Vector3[] = [];
  const corners: [number, number, number][] = [
    [hw - r, -hd + r, -Math.PI / 2], [hw - r, hd - r, 0], [-hw + r, hd - r, Math.PI / 2], [-hw + r, -hd + r, Math.PI],
  ];
  for (const [cx, cz, start] of corners) {
    for (let step = 0; step <= 6; step++) {
      const angle = start + (step / 6) * (Math.PI / 2);
      points.push(new Vector3(cx + Math.cos(angle) * r, 0, cz + Math.sin(angle) * r));
    }
  }
  return new CatmullRomCurve3(points, true, "centripetal");
}

type Building = { x: number; z: number; width: number; depth: number; height: number; color: string };

/** Procedural city blocks east and west of the ring road. */
export const BUILDINGS: Building[] = (() => {
  const next = random(42);
  const palette = ["#d8d2c4", "#c9d3d8", "#b9c2c9", "#e3dccd", "#9fb0ba", "#cfc6b5"];
  const list: Building[] = [];
  for (const side of [-1, 1]) {
    for (let gx = 0; gx < 4; gx++) {
      for (let gz = 0; gz < 9; gz++) {
        const x = side * (150 + gx * 26);
        const z = -104 + gz * 26;
        if (Math.hypot(x, z) > ISLAND_RADIUS - 22) continue;
        if (side === 1 && gx === 0 && gz >= 3 && gz <= 5) continue; // landmark lots
        if (side === -1 && gx === 0 && gz >= 3 && gz <= 5) continue;
        if (next() < 0.12) continue;
        const width = 14 + next() * 6;
        const depth = 14 + next() * 6;
        const near = 1 - Math.hypot(x, z) / ISLAND_RADIUS;
        list.push({ x, z, width, depth, height: 10 + next() * 26 + near * 40, color: palette[Math.floor(next() * palette.length)] });
      }
    }
  }
  return list;
})();

/** Landmark models placed on reserved lots: [x, z, rotationY, footprint]. */
export const LANDMARKS = {
  store: { x: -162, z: -12, rotation: Math.PI / 2, length: 46 },
  tower: { x: 162, z: -16, rotation: -Math.PI / 2, height: 42 },
  simple: { x: 160, z: 30, rotation: -Math.PI / 2, height: 38 },
  office: { x: -160, z: 34, rotation: Math.PI / 2, length: 26 },
} as const;

export const OBSTACLES: Box[] = [
  // Podium edges (enter by the front steps only).
  box(0, -46.5, 73, 1), box(-36.5, -22, 1, 49), box(36.5, -22, 1, 49), box(-25.75, 2.4, 21.5, 0.8), box(25.75, 2.4, 21.5, 0.8),
  // Hall walls, with the door gap in the glass front.
  box(0, -42.3, 66, 0.8), box(-32.3, -24, 0.8, 37), box(32.3, -24, 0.8, 37),
  box(-(HALL.door + 32) / 2, -6, 32 - HALL.door, 0.6), box((HALL.door + 32) / 2, -6, 32 - HALL.door, 0.6),
  // Colonnade.
  ...Array.from({ length: 10 }, (_, i) => box(-29 + i * (58 / 9), -1.4, 1.8, 1.8)),
  // Interior exhibits.
  ...EXHIBITS.vitrines.map(([x, z]) => box(x, z, 2.6, 2.6)),
  box(EXHIBITS.desk.x, EXHIBITS.desk.z, 1.6, 6),
  ...BUILDINGS.map((b) => box(b.x, b.z, b.width + 1, b.depth + 1)),
  box(LANDMARKS.store.x, LANDMARKS.store.z, 36, 50),
  box(LANDMARKS.tower.x, LANDMARKS.tower.z, 30, 30),
  box(LANDMARKS.simple.x, LANDMARKS.simple.z, 18, 18),
  box(LANDMARKS.office.x, LANDMARKS.office.z, 22, 26),
  box(PLAZA.x, PLAZA.z, 15.5, 15.5), // fountain
  box(-15, 12, 5, 4), // ticket booth
  box(62, -22, 24, 22), // pavilion
  box(73, 49, 17, 12), // helicopter display
  box(92, 52, 14, 12), // vintage plane
  box(-76, 57, 9, 8), // sculpture display
  box(62, -86, 20, 17), // gallery house
  box(87, -85, 16, 15), // loft display
  ...PROJECT_SLOTS.map((s) => box(s.x, s.z, 2.6, 7.2)),
  ...SKILLS.pillars.map((p) => box(p.x, p.z, 2, 2)),
  box(SKILLS.x, SKILLS.z + 12, 6.4, 1), // skills sign
  ...JOURNEY.stops.map((x) => box(x, JOURNEY.z, 6.8, 0.8)),
  box(CONTACT_BOOTH.x, CONTACT_BOOTH.z, 5.6, 3),
  box(LIGHTHOUSE.x, LIGHTHOUSE.z, 7, 7),
];

export const CIRCLE_OBSTACLES: { x: number; z: number; radius: number }[] = [
  { x: POND.x, z: POND.z, radius: POND.radius + 0.5 },
];

/** Keep the visitor on land (or on the pier) and outside every obstacle. */
export function resolvePosition(x: number, z: number, radius = 0.45): [number, number] {
  const onPier = Math.abs(x - PIER.x) < PIER.width / 2 && z > PIER.from - 4 && z < PIER.to;
  if (!onPier) {
    const distance = Math.hypot(x, z);
    const limit = BEACH_RADIUS - 6;
    if (distance > limit) { x = (x / distance) * limit; z = (z / distance) * limit; }
  }
  for (const o of OBSTACLES) {
    if (x > o.minX - radius && x < o.maxX + radius && z > o.minZ - radius && z < o.maxZ + radius) {
      const pushes = [o.minX - radius - x, o.maxX + radius - x, o.minZ - radius - z, o.maxZ + radius - z];
      const smallest = pushes.reduce((best, value) => (Math.abs(value) < Math.abs(best) ? value : best));
      if (smallest === pushes[0] || smallest === pushes[1]) x += smallest; else z += smallest;
    }
  }
  for (const c of CIRCLE_OBSTACLES) {
    const dx = x - c.x;
    const dz = z - c.z;
    const distance = Math.hypot(dx, dz);
    if (distance < c.radius + radius) {
      const scale = (c.radius + radius) / (distance || 1);
      x = c.x + dx * scale;
      z = c.z + dz * scale;
    }
  }
  return [x, z];
}
