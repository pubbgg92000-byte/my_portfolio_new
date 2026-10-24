/** Camera forward is local -Z; imported pedestrians face local +Z. */
export function movementDelta(yaw: number, forward: number, strafe: number, distance: number) {
  const length = Math.max(1, Math.hypot(forward, strafe));
  return {
    x: (-Math.sin(yaw) * forward + Math.cos(yaw) * strafe) / length * distance,
    z: (-Math.cos(yaw) * forward - Math.sin(yaw) * strafe) / length * distance,
  };
}

export function facingAlong(x: number, z: number, modelOffset = 0) {
  return Math.atan2(x, z) + modelOffset;
}
