// Optimizes raw models from assets-src/models into public/models/world.
// Usage: node scripts/optimize-models.mjs [name ...]   (no args = all)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync, readFileSync, openSync, readSync, closeSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SRC = "assets-src/models";
const OUT = "public/models/world";
const CLI = "node_modules/.bin/gltf-transform";

// name: [source file, simplify ratio (1 = off), max texture px]
const MODELS = {
  museum: ["vr_gallery_house_baked.glb", 1, 2048],
  island: ["tropical_island.glb", 0.6, 1024],
  "city-block": ["street_city_buildings_8.glb", 0.5, 1024],
  "simple-building": ["free_-_sm_simplebuilding_1a_-_public_domain.glb", 1, 512],
  "store-building": ["woolworths_big_w_australian_commercial_building.glb", 1, 512],
  "tower-building": ["building.glb", 1, 512],
  office: ["office.glb", 1, 256],
  mountain: ["gt_racing_2_-_mount_rainier.glb", 0.3, 1024],
  tree: ["tree_animate.glb", 0.5, 512],
  turbine: ["wind_turbine.glb", 1, 256],
  plane: ["stylized_ww1_plane.glb", 1, 256],
  helicopter: ["mh-6_little_bird_helicopter_animated.glb", 0.04, 512],
  train: ["train_night_scene.glb", 0.08, 1024],
  supercar: ["lamborghini_centenario_lp-770_interior_sdc.glb", 0.1, 512],
  bird: ["updated_bird_alex.glb", 1, 256],
  hummingbird: ["lowpoly_humming-bird_animated.glb", 1, 256],
  "flying-bird": ["flying_animated_bird.glb", 1, 256],
  "bird-monster": ["bird_monster.glb", 1, 256],
  rhino: ["model_56a_-_southern_white_rhino.glb", 0.3, 512],
  "food-stand": ["elizabeths_food_stand.glb", 0.5, 512],
  staircase: ["staircase_modular_frame_-_steel.glb", 0.4, 512],
  sweeper: ["autonomous_robot_sweeper.glb", 1, 256],
  "biped-robot": ["biped_robot.glb", 1, 512],
  "loft-16": ["loft_16_interior.glb", 1, 1024],
  "loft-15": ["interior_15_mini_loft.glb", 1, 1024],
  "loft-18": ["free_loft_18_mini_office_v.optimization.glb", 1, 1024],
  "interior-14": ["the_interior_14_is_spacious..glb", 1, 1024],
  "art-poplars": ["1958.32_two_poplars_in_the_alpilles.glb", 0.15, 2048],
  "kylo-ren": ["kylo_ren.glb", 1, 512],
  "poe-dameron": ["poe_dameron.glb", 1, 512],
  "jyn-erso": ["jyn_erso.glb", 1, 512],
  "cassian-andor": ["cassian_andor.glb", 1, 512],
  "mace-windu": ["mace_windu.glb", 1, 512],
  "fountain-sim": ["fountain_water_simulation.glb", 1, 1024],
  "sports-car": ["cartoon_sports_car.glb", 1, 512],
  "retro-car": ["cicada_-_retro_cartoon_car.glb", 1, 512],
  "dirty-car": ["dirty_car_061220.glb", 1, 512],
  spartan: ["spartan_armour_mkv_-_halo_reach.glb", 0.4, 512],
};

function assetExtras(file) {
  const fd = openSync(file, "r");
  const header = Buffer.alloc(20);
  readSync(fd, header, 0, 20, 0);
  const json = Buffer.alloc(header.readUInt32LE(12));
  readSync(fd, json, 0, json.length, 20);
  closeSync(fd);
  const gltf = JSON.parse(json.toString());
  return { extras: gltf.asset?.extras ?? {}, specGloss: (gltf.extensionsUsed ?? []).includes("KHR_materials_pbrSpecularGlossiness") };
}

const run = (...args) => execFileSync(CLI, args, { stdio: ["ignore", "ignore", "inherit"] });
const mb = (file) => (statSync(file).size / 1048576).toFixed(1) + " MB";

mkdirSync(OUT, { recursive: true });
const wanted = process.argv.slice(2);
const credits = existsSync(join(OUT, "credits.json")) ? JSON.parse(readFileSync(join(OUT, "credits.json"), "utf8")) : {};

for (const [name, [source, ratio, size]] of Object.entries(MODELS)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const input = join(SRC, source);
  const output = join(OUT, `${name}.glb`);
  const { extras, specGloss } = assetExtras(input);
  let current = input;
  if (specGloss) {
    // three.js no longer reads spec/gloss materials; convert to metal/rough first.
    current = join(tmpdir(), `${name}-metalrough.glb`);
    run("metalrough", input, current);
  }
  const args = ["optimize", current, output, "--compress", "meshopt", "--texture-compress", "webp", "--texture-size", String(size)];
  args.push(...(ratio < 1 ? ["--simplify", "true", "--simplify-ratio", String(ratio), "--simplify-error", "0.01"] : ["--simplify", "false"]));
  run(...args);
  if (current !== input) rmSync(current);
  credits[name] = { file: `${name}.glb`, title: extras.title ?? source, author: extras.author ?? "Unknown", source: extras.source ?? "", license: extras.license ?? "See source" };
  console.log(`${name.padEnd(16)} ${mb(input).padStart(9)} -> ${mb(output)}`);
}

writeFileSync(join(OUT, "credits.json"), JSON.stringify(credits, null, 2) + "\n");
