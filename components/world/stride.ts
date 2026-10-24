import { type Object3D, Quaternion, Vector3 } from "three";

export function createStride(object: Object3D) {
  object.updateMatrixWorld(true);
  const feet: Object3D[] = [];
  const toes: Object3D[] = [];
  object.traverse(bone => {
    if (/(Left|Right)Foot_/.test(bone.name)) feet.push(bone);
    if (/(Left|Right)ToeBase_/.test(bone.name)) toes.push(bone);
  });
  const forward = new Vector3();
  for (let i = 0; i < Math.min(feet.length, toes.length); i++) forward.add(toes[i].getWorldPosition(new Vector3()).sub(feet[i].getWorldPosition(new Vector3())));
  forward.y = 0;
  if (forward.lengthSq() < .00001) forward.set(0, 0, 1);
  forward.normalize();
  const right = new Vector3(forward.z, 0, -forward.x);
  const joints: { bone: Object3D; base: Quaternion; axis: Vector3; side: number; kind: "hip" | "knee" | "arm" | "foot" }[] = [];
  object.traverse(bone => {
    const match = bone.name.match(/(Left|Right)(UpLeg|Leg|Arm|Foot)_/);
    if (match) joints.push({ bone, base: bone.quaternion.clone(), axis: right.clone().applyQuaternion(bone.parent!.getWorldQuaternion(new Quaternion()).invert()), side: match[1] === "Left" ? 1 : -1, kind: match[2] === "UpLeg" ? "hip" : match[2] === "Leg" ? "knee" : match[2] === "Foot" ? "foot" : "arm" });
  });
  const contacts = [...feet, ...toes];
  const floor = Math.min(...contacts.map(bone => bone.getWorldPosition(new Vector3()).y));
  return { joints, contacts, floor, rotation: new Quaternion(), point: new Vector3(), forward, heading: -Math.atan2(forward.x, forward.z) };
}

export function updateStride(stride: ReturnType<typeof createStride>, object: Object3D, root: Object3D, offsetY: number, phase: number) {
  for (const { bone, base, axis, side, kind } of stride.joints) {
    const swing = Math.sin(phase + (side < 0 ? Math.PI : 0));
    const hip = -swing * .42;
    const knee = Math.max(0, swing) * .65;
    const angle = kind === "hip" ? hip : kind === "knee" ? knee : kind === "foot" ? -(hip + knee) * .8 : swing * .28;
    bone.quaternion.copy(base).premultiply(stride.rotation.setFromAxisAngle(axis, angle));
  }
  object.updateMatrixWorld(true);
  if (stride.contacts.length) {
    let floor = Infinity;
    for (const bone of stride.contacts) floor = Math.min(floor, root.worldToLocal(bone.getWorldPosition(stride.point)).y);
    root.position.y = offsetY + stride.floor - floor;
  }
}
