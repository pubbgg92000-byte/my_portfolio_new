# 3D Portfolio World — Source of Truth

> Direction changed 2026-10-24 by the project owner: the previous "studio only,
> no world" rule is replaced. `/3d` becomes an explorable open world whose main
> attraction is Arvind's Portfolio Museum.

## Goal

A second version of the existing portfolio at `/3d`: a small, lively 3D world
(island town with roads, cars, trees, people, planes, sky, sea, beach, pond).
The visitor lands near the **Portfolio Museum** — the tallest, brightest building —
and either roams freely or follows a robot guide through the exhibits.

- `/` stays unchanged and remains the content authority (`content/profile.ts`,
  `content/projects/projects.ts`). The world only presents that content.
- A recruiter must still reach projects, résumé and contact in one click
  (HUD menu + "Skip to portfolio" link), without learning controls.

## World map (≈ 400 m × 400 m island, not 1 km)

```
                N   ~~~~~~~~~~~~~~ SEA ~~~~~~~~~~~~~~
          ~~~  ✈ plane loop overhead, birds, helicopter  ~~~
     ~~  ┌──────────── HILLS / WIND TURBINES ──────────┐  ~~
    ~~   │   🌳🌳  PARK + POND (ducks, benches)  🌳🌳  │   ~~
   ~~    │                                              │    ~~
   ~~    │  TOWN BLOCK ══ main road ══ TOWN BLOCK       │    ~~
   ~~    │  (filler bldgs, cars loop, people walk)      │    ~~
   ~~    │            ║                                 │    ~~
   ~~    │   ┌────────╨─────────┐   EXPERIMENTS PAVILION│    ~~
   ~~    │   │ PORTFOLIO MUSEUM │   (side projects)     │    ~~
   ~~    │   │  ★ main attraction│                      │    ~~
   ~~    │   └────────╥─────────┘   FOOD STAND / PLAZA  │    ~~
   ~~    │      SPAWN PLAZA (robot guide waits here)     │    ~~
    ~~   └──────────── BEACH + PIER (contact sign) ─────┘   ~~
     ~~~~~~~~~~~~~~~~~~~~~~~~~ SEA ~~~~~~~~~~~~~~~~~~~~~~~
```

### Portfolio Museum (interior = the portfolio)

| Hall | Content source | Exhibit form |
|---|---|---|
| Lobby | `profile` | Name, role, portrait, "Start tour" / "Roam" buttons |
| Hall 1 — Featured Work | Staffly, Meals SDK & Monorepo, Apex Admin Panels | Large framed screens, plaque → project page |
| Hall 2 — All Projects | rest of `projects.ts` | Gallery wall of frames |
| Hall 3 — Skills | Frontend, Backend, AI Tools, Automation, Cloud | Pedestals / lit columns |
| Hall 4 — Journey | career path from `profile` | Timeline corridor / staircase |
| Rooftop — Contact | email, GitHub, LinkedIn, résumé | Terrace with sea view + contact form (DOM) |

Experiments may live in the separate **Experiments Pavilion** outside.

## Modes

1. **Guided tour (default)** — robot walks a spline path: plaza → museum halls → rooftop.
   Camera follows; Next/Back buttons; robot waves/points at each exhibit.
2. **Free roam** — third-person walk (WASD/arrows, drag to look, touch joystick on
   mobile). Click any exhibit to open its DOM panel.
3. **Directory** — plain HTML list of everything (also the no-WebGL / reduced-motion fallback).

## Assets from ~/Downloads (inspected 2026-10-24)

### Use

| File | Role | Tris | License | Note |
|---|---|---|---|---|
| `public/models/studio/robot.glb` (RobotExpressive) | **Robot guide** | ~4k | CC0 | Has Idle/Walk/Wave/ThumbsUp/Dance — best guide. Already in repo |
| `vr_gallery_house_baked.glb` | **Portfolio Museum** interior/shell | 27k | CC-BY-4.0 | Baked lighting = cheap. 47 MB → compress |
| `tropical_island.glb` | Island base, beach, palms, sea | 112k | CC-BY-4.0 | Possibly whole-world base; check scale |
| `street_city_buildings_8.glb` | Town filler buildings | 77k | Sketchfab Std | See license note |
| `free_-_sm_simplebuilding_1a…glb` | Filler buildings (instanced) | 15k | CC-BY-4.0 | |
| `office.glb` | Small filler | 1k | CC-BY-4.0 | |
| `tree_animate.glb` | Swaying trees (instanced) | 19k | CC-BY-4.0 | |
| `wind_turbine.glb` | Hills | 4k | CC-BY-4.0 | Spin rotor in code |
| `stylized_ww1_plane.glb` | Plane looping sky | 8k | CC-BY-4.0 | |
| `updated_bird_alex.glb` / `lowpoly_humming-bird_animated.glb` / `flying_animated_bird.glb` | Birds | 2–21k | CC-BY-4.0 | Pick 1–2 |
| `elizabeths_food_stand.glb` | Plaza prop | 45k | CC-BY-4.0 | Decimate |
| `staircase_modular_frame_-_steel.glb` | Journey hall stairs | 55k | CC-BY-4.0 | Decimate |
| `autonomous_robot_sweeper.glb` | Ambient robot in streets | 16k | CC-BY-4.0 | |
| `public/models/studio/sedan.glb` | Traffic cars (instanced, recoloured) | small | CC0 | Already in repo |
| `biped_robot.glb` | Alternate guide / security bot | 17k | CC-BY-4.0 | Only 1 animation |
| `loft_16_interior.glb`, `interior_15_mini_loft.glb` | Possible "About me" room | 6–21k | Sketchfab Std | |

### Owner decision (2026-10-24): use ALL models, with full credits

The owner chose to use every downloaded model and credit each creator. The
notes below are kept as known risks (third-party IP / NC license) and as the
list of files that **must be heavily optimized** before shipping.

| File | Risk / work needed |
|---|---|
| Kylo Ren, Poe Dameron, Jyn Erso, Cassian Andor, Mace Windu | Star Wars characters — Disney IP. Fan-model CC-BY does not grant character rights |
| `spartan_armour_mkv_-_halo_reach.glb` | Halo IP (Microsoft); also 130 MB |
| `model_56a_-_southern_white_rhino.glb` | CC-BY-**NC** — portfolio for job hunting is arguably commercial |
| `lamborghini_centenario…glb` | Brand/trademark car; 326k tris, 41 MB |
| `woolworths_big_w…glb` | Real retail brand signage |
| `gt_racing_2_-_mount_rainier.glb` | Likely ripped game asset; 105k tris |
| `train_night_scene.glb` | 1.55M tris, 64 MB — too heavy |
| `mh-6_little_bird_helicopter_animated.glb` | 609k tris, 48 MB — too heavy (decimate heavily or skip) |
| `1958.32_two_poplars…glb` | 292k-tri painting scan; heavy |
| `building.glb`, `free_loft_18…`, `the_interior_14…` | Optional only; Sketchfab Std, not needed |

**Sketchfab Standard license:** use in a project is allowed, but serving the raw
`.glb` publicly lets anyone download it. Prefer CC0 / CC-BY where an alternative exists.

### Still missing — get CC0

- **Humans / crowd:** Quaternius "Ultimate Animated Character Pack" or Kenney
  "Mini Characters" (CC0, rigged, walk/idle). Use 1 rigged model + `SkeletonUtils.clone`
  + colour variants for 15–30 people.
- **Cars variety:** Kenney Car Kit (same pack as `sedan.glb`).
- **Sky / water:** code, not models — drei `<Sky>`, three `Water` shader, fog.
- **Pond/ducks, benches, lamps:** Kenney City / Nature kits (CC0).

## Tech approach

- Stack already present: Next 15, `@react-three/fiber`, `drei`, `postprocessing`.
- Add: `@react-three/rapier` (character collision) or simple navmesh/raycast ground;
  `@gltf-transform/cli` (dev) for asset pipeline.
- **Asset pipeline** (script `scripts/optimize-models.mjs`): dedupe → weld →
  simplify → meshopt compression → textures to KTX2/WebP ≤ 1024 px. Output to
  `public/models/world/`. Target: whole first load ≤ 15 MB, museum interior lazy.
- **Performance:** instancing for trees/cars/people/buildings; LOD (drei `<Detailed>`);
  baked/hemisphere light + one shadow-casting sun; DPR cap 1.5; `PerformanceMonitor`
  drops crowd count, shadows, post-fx on weak devices; pause when tab hidden.
- **Streaming:** load island + museum exterior first (spawn view), then town,
  then museum interior when the guide/player approaches.
- **Content:** exhibits read `projects.ts`/`profile.ts` directly — no duplicated text.
  Every exhibit opens a semantic DOM panel (not WebGL text) for readability/SEO.
- **Attribution:** all CC-BY credits in `public/models/world/CREDITS.md` and a
  visible "Credits" link in the HUD (CC-BY requires it).

## Progress (2026-10-24)

- [x] Phase 1 — `scripts/optimize-models.mjs` (569 MB raw → 59 MB), `public/models/world/` + `CREDITS.md` + `credits.json`, TS error fixed. Raw files in git-ignored `assets-src/models/`.
- [x] Phase 2 — `components/world/*`: island, sea, sky, roads, plaza, fountain, pond, hills, pier, procedural museum with featured-project banners, city blocks + landmark models, traffic loop, plane/helicopter/birds, visitors, ARIA robot, first-person controls, Places quick-travel, art ticket, Directory, Credits, fallback page. Tests pass.
- Museum built procedurally: `vr_gallery_house_baked.glb` is a small house + sky backdrop, not a museum. `mountain`/`train` look poor up close — unused so far.
- Old studio/city files (`components/studio/*` except `studio-shell.tsx`) still present; deletion pending owner OK.

## Phases

### Review fixes — current implementation

- "Your models" in the HUD and "See downloaded models" on arrival open a searchable
  collection viewer for every optimized download. Only the selected model loads.
  Orbit, zoom and pan are available, with creator credits and links to world areas.
  Items without a landscape placement are explicitly labelled collection previews.

- People: four existing downloaded humanoids walk two pavement loops, with
  skeletal stride, per-model forward-axis correction and foot contact grounding.
  The source clips are idle poses; the walk is procedural, not a new downloaded clip.
- Controls: camera-relative W/S and A/D, arrow turning, left-drag look,
  right/middle/Shift-drag ground pan, wheel forward/backward, touch buttons.
  Movement stops in menus and on focus loss; touch cancellation releases input.
- Scenery: downloaded tree models near paths, animated GLB birds, GLB traffic,
  shallow coastal water and foam, nearby tropical island scenery at the beach.
- Loading: arrival becomes interactive before city/traffic/wildlife stream in;
  separate asset boundaries, proximity loading for large props, real DPR adjustment,
  render suspension in menus/hidden tabs, reduced-motion directory fallback.
- Regression check: `node --experimental-strip-types scripts/check-world-motion.mjs`
  verifies camera directions and four character rigs across 120 stride poses each.
- Museum interior and guided museum tour remain future phases; current ARIA waits
  at the plaza. Do not describe these as finished.

1. **Cleanup + pipeline** — remove unused studio/city files, fix current TS error,
   add optimize script, convert chosen assets, write CREDITS.
2. **World blockout** — island, sea, sky, ground, roads, museum placed, spawn plaza,
   free-roam controller with collision. Directory fallback works.
3. **Museum** — interior halls wired to real content, plaques → DOM panels,
   rooftop contact.
4. **Guide robot** — tour path, camera follow, Next/Back, gestures per stop.
5. **Life** — instanced cars on road loop, people walking paths, birds, plane,
   turbines, trees swaying, water.
6. **Polish** — loading screen with progress, mini-map, sound toggle (off by
   default), mobile joystick, adaptive quality, tests + Lighthouse budget for `/3d`.

## Non-negotiable rules

1. `/` unchanged. 2. Content only from existing sources. 3. Contact/résumé/projects
reachable in one click from the HUD at all times. 4. Full HTML fallback (no WebGL,
reduced motion, `?fallback=1`). 5. Every asset credited in CREDITS.md and the
in-world Credits panel (owner accepts IP/NC risk noted above). 6. Mobile playable at ≥ 30 fps on mid-range phones.

## Definition of success

A recruiter opens `/3d` and within seconds sees the museum and robot, can take a
2-minute guided tour of the strongest projects, or skip straight to the directory,
résumé and contact — and the world feels alive, fast and memorable.
