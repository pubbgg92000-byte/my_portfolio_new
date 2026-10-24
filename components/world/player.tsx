"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { EYE_HEIGHT, PLACES, type Place, groundHeight, insideHall, resolvePosition } from "./layout";
import { movementDelta } from "./motion";

export type MoveInput = { forward: number; strafe: number; turn: number };
/** Shared between the HUD (touch pad, quick travel) and the in-canvas player. */
export type PlayerBridge = { move: MoveInput; travel: Place | null; enabled: boolean; reducedMotion?: boolean; inputRevision?: number };

const WALK = 6;
const RUN = 16;
const KEYS: Record<string, keyof MoveInput | "run"> = {
  KeyW: "forward", ArrowUp: "forward", KeyS: "forward", ArrowDown: "forward",
  KeyA: "strafe", KeyD: "strafe", ArrowLeft: "turn", ArrowRight: "turn",
  ShiftLeft: "run", ShiftRight: "run",
};
const SIGN: Record<string, number> = { KeyW: 1, ArrowUp: 1, KeyS: -1, ArrowDown: -1, KeyA: -1, KeyD: 1, ArrowLeft: 1, ArrowRight: -1 };

/** First-person visitor: WASD / arrows to walk, drag to look, Shift to run. */
export function Player({ bridge }: { bridge: React.RefObject<PlayerBridge> }) {
  const { camera, gl } = useThree();
  // `/3d?place=coast` opens the world at that spot (shareable links).
  const [start] = useState(() => {
    const id = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("place");
    return PLACES.find((place) => place.id === id) ?? PLACES[0];
  });
  const position = useRef(new Vector3(start.position[0], groundHeight(start.position[0], start.position[1]) + EYE_HEIGHT, start.position[1]));
  const floor = useRef(groundHeight(start.position[0], start.position[1]));
  const yaw = useRef(start.yaw);
  const pitch = useRef(-0.04);
  const pressed = useRef(new Set<string>());
  const flight = useRef<{ from: Vector3; to: Vector3; fromYaw: number; toYaw: number; t: number } | null>(null);
  const bob = useRef(0);
  const mouseMove = useRef({ forward: 0, strafe: 0 });
  const revision = useRef(bridge.current.inputRevision);

  useEffect(() => {
    const isField = (target: EventTarget | null) => (target as HTMLElement | null)?.closest?.("input,textarea,select,[contenteditable]");
    const down = (event: KeyboardEvent) => {
      if (!bridge.current.enabled || isField(event.target) || !(event.code in KEYS)) return;
      if (event.code.startsWith("Arrow")) event.preventDefault();
      pressed.current.add(event.code);
    };
    const up = (event: KeyboardEvent) => pressed.current.delete(event.code);
    const clear = () => { pressed.current.clear(); bridge.current.move = { forward: 0, strafe: 0, turn: 0 }; mouseMove.current = { forward: 0, strafe: 0 }; dragging = false; };
    let dragging = false;
    let panning = false;
    let last = [0, 0];
    const element = gl.domElement;
    const pointerDown = (event: PointerEvent) => {
      if (!bridge.current.enabled) return;
      dragging = true; panning = event.button === 1 || event.button === 2 || event.shiftKey;
      last = [event.clientX, event.clientY];
      element.setPointerCapture(event.pointerId);
      if (panning) event.preventDefault();
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging || !bridge.current.enabled) return;
      const dx = event.clientX - last[0];
      const dy = event.clientY - last[1];
      if (panning) {
        mouseMove.current.strafe -= dx * .025;
        mouseMove.current.forward += dy * .025;
      } else {
        // Drag right looks right, drag down looks down.
        yaw.current -= dx * 0.0042;
        pitch.current = MathUtils.clamp(pitch.current - dy * 0.003, -0.6, 0.5);
      }
      last = [event.clientX, event.clientY];
    };
    const pointerUp = () => { dragging = false; };
    const wheel = (event: WheelEvent) => {
      if (!bridge.current.enabled) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      mouseMove.current.forward -= MathUtils.clamp(event.deltaY * unit * .012, -3, 3);
      mouseMove.current.forward = MathUtils.clamp(mouseMove.current.forward, -6, 6);
    };
    const context = (event: MouseEvent) => { if (bridge.current.enabled) event.preventDefault(); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("contextmenu", context);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("contextmenu", context);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", clear);
    };
  }, [bridge, gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const state = bridge.current;
    if (revision.current !== state.inputRevision) {
      pressed.current.clear(); mouseMove.current = { forward: 0, strafe: 0 };
      revision.current = state.inputRevision;
    }
    if (!state.enabled) {
      pressed.current.clear();
      state.move = { forward: 0, strafe: 0, turn: 0 };
      mouseMove.current = { forward: 0, strafe: 0 };
      return;
    }
    if (state.travel) {
      const [x, z] = state.travel.position;
      const turn = MathUtils.euclideanModulo(state.travel.yaw - yaw.current + Math.PI, Math.PI * 2) - Math.PI;
      flight.current = { from: position.current.clone(), to: new Vector3(x, groundHeight(x, z) + EYE_HEIGHT, z), fromYaw: yaw.current, toYaw: yaw.current + turn, t: 0 };
      state.travel = null;
      pressed.current.clear();
      state.move = { forward: 0, strafe: 0, turn: 0 };
      mouseMove.current = { forward: 0, strafe: 0 };
    }
    if (flight.current) {
      const f = flight.current;
      f.t = state.reducedMotion ? 1 : Math.min(1, f.t + delta / 1.6);
      const ease = f.t < 0.5 ? 4 * f.t ** 3 : 1 - (-2 * f.t + 2) ** 3 / 2;
      position.current.lerpVectors(f.from, f.to, ease);
      // Stay low indoors so the camera never pops through the museum roof.
      const indoor = insideHall(f.from.x, f.from.z) || insideHall(f.to.x, f.to.z);
      position.current.y += Math.sin(f.t * Math.PI) * (indoor ? 0 : Math.min(60, f.from.distanceTo(f.to) * 0.3));
      yaw.current = MathUtils.lerp(f.fromYaw, f.toYaw, ease);
      pitch.current = MathUtils.lerp(pitch.current, -0.04, 0.1);
      if (f.t >= 1) { flight.current = null; floor.current = groundHeight(f.to.x, f.to.z); }
    } else {
      const keys = pressed.current;
      let forward = state.move.forward;
      let strafe = state.move.strafe;
      let turn = state.move.turn;
      for (const code of keys) {
        const kind = KEYS[code];
        if (kind === "forward") forward += SIGN[code];
        if (kind === "strafe") strafe += SIGN[code];
        if (kind === "turn") turn += SIGN[code];
      }
      yaw.current += turn * delta * 1.8;
      const speed = (keys.has("ShiftLeft") || keys.has("ShiftRight") ? RUN : WALK) * delta;
      const { x: dx, z: dz } = movementDelta(yaw.current, forward, strafe, speed);
      // Consume a bounded amount each frame to avoid tunnelling through walls
      // during a large wheel/trackpad gesture; retain the remainder smoothly.
      const mouse = mouseMove.current;
      const pending = Math.hypot(mouse.forward, mouse.strafe);
      const amount = Math.min(pending, 12 * delta);
      const pan = pending ? movementDelta(yaw.current, mouse.forward / pending, mouse.strafe / pending, amount) : { x: 0, z: 0 };
      if (pending) { mouse.forward *= (pending - amount) / pending; mouse.strafe *= (pending - amount) / pending; }
      const [x, z] = resolvePosition(position.current.x + dx + pan.x, position.current.z + dz + pan.z);
      const moving = Math.abs(forward) + Math.abs(strafe) > 0;
      bob.current = moving ? bob.current + delta * 9 : bob.current * 0.9;
      // Ease toward the surface height so steps and the podium feel like walking, not teleporting.
      floor.current = MathUtils.damp(floor.current, groundHeight(x, z), 12, delta);
      position.current.set(x, floor.current + EYE_HEIGHT + (state.reducedMotion ? 0 : Math.sin(bob.current) * 0.05), z);
    }
    camera.position.copy(position.current);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
  });

  return null;
}
