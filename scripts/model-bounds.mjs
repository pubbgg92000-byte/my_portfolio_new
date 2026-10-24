// Prints bounding box size (glTF units), centre-bottom offset and animation names for each optimized model.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import { MeshoptDecoder } from "meshoptimizer";
import { readdirSync } from "node:fs";

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const dir = "public/models/world";
for (const file of readdirSync(dir).filter((f) => f.endsWith(".glb"))) {
  const doc = await io.read(`${dir}/${file}`);
  const { min, max } = getBounds(doc.getRoot().getDefaultScene());
  const size = max.map((v, i) => +(v - min[i]).toFixed(2));
  const base = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2].map((v) => +v.toFixed(2));
  const anims = doc.getRoot().listAnimations().map((a) => a.getName()).join("|");
  console.log(`${file.padEnd(22)} size ${JSON.stringify(size).padEnd(26)} base ${JSON.stringify(base).padEnd(24)} ${anims}`);
}
