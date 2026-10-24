"use client";

import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Component, type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { profile, profileEmailUrl } from "@/content/profile";
import { City } from "./city";
import { Directory } from "./directory";
import { Guide } from "./guide";
import { PLACES } from "./layout";
import { Museum } from "./museum";
import { DetailPanel } from "./detail-panel";
import { TOUR, setTourStep } from "./tour";
import { INTERACTABLES, type WorldPanel } from "./places";
import { Player, type PlayerBridge } from "./player";
import { SUN, Terrain } from "./terrain";
import { SkyLife, Traffic } from "./traffic";
import styles from "./world.module.css";

const ModelLibrary = dynamic(() => import("./model-library").then(module => module.ModelLibrary), {
  loading: () => <p style={{ padding: 32 }}>Opening your model collection…</p>,
});

/** Mounts children only after `delay` ms so the first view renders before the rest of the world streams in. */
function Stage({ delay, children }: { delay: number; children: ReactNode }) {
  const [ready, setReady] = useState(delay === 0);
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, ready]);
  return ready ? <Suspense fallback={null}>{children}</Suspense> : null;
}

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

type Panel = "directory" | "credits" | "ticket" | "places" | "models" | "detail" | null;
type Credit = { file: string; title: string; author: string; source: string; license: string };

function Scene({ bridge, onTicket, entered, onReady }: { bridge: React.RefObject<PlayerBridge>; onTicket: () => void; entered: boolean; onReady: () => void }) {
  const [dpr, setDpr] = useState(1.25);
  const setDprValue = useThree(state => state.setDpr);
  const signaled = useRef(false);
  useEffect(() => { setDprValue(dpr); }, [dpr, setDprValue]);
  useFrame(() => { if (!signaled.current) { signaled.current = true; onReady(); } });
  return (
    <>
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.25)} />
      <AdaptiveDpr pixelated={false} />
      <fog attach="fog" args={["#cfe0ea", 160, 820]} />
      <hemisphereLight args={["#e4f2ff", "#6f8a52", 1.25]} />
      <directionalLight
        position={SUN} intensity={2.4} castShadow={dpr > 1}
        shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004}
        shadow-camera-left={-70} shadow-camera-right={70} shadow-camera-top={70} shadow-camera-bottom={-70} shadow-camera-far={500}
      />
      {/* Local studio-style environment so glass and metal reflect light (no HDR download). */}
      <Environment resolution={128} frames={1} background={false}>
        <mesh scale={100}><sphereGeometry args={[1, 32, 16]} /><meshBasicMaterial color="#bcd8ea" side={1} /></mesh>
        <Lightformer form="rect" intensity={3} color="#fff4dc" position={[30, 40, 20]} scale={[40, 20, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#dfefff" position={[-40, 10, -20]} scale={[60, 10, 1]} target={[0, 0, 0]} />
        <mesh position-y={-30} rotation-x={-Math.PI / 2} scale={200}><planeGeometry /><meshBasicMaterial color="#7d9a5d" /></mesh>
      </Environment>
      <Terrain />
      <Museum onTicket={onTicket} />
      <Guide />
      <Player bridge={bridge} />
      <NearbyPrompt />
      {entered && <>
        <Stage delay={300}><City /></Stage>
        <Stage delay={1400}><Traffic /></Stage>
        <Stage delay={2400}><SkyLife /></Stage>
      </>}
    </>
  );
}

function Loading({ onEnter, onSkip, onModels, onTour, ready }: { onEnter: () => void; onSkip: () => void; onModels: () => void; onTour: () => void; ready: boolean }) {
  const { progress, active, total } = useProgress();
  return (
    <div className={styles.welcome} role="dialog" aria-labelledby="welcome-title">
      <p>WELCOME TO</p>
      <h2 id="welcome-title">Arvind’s Portfolio World</h2>
      <span>A small island city built around one landmark: my portfolio museum. Walk up to any display and press E (or click it) to read the full project, skill or career story.</span>
      <span className={styles.progressLabel} aria-live="polite">{ready ? "Ready to explore · scenery loads as you go" : `Preparing arrival ${Math.round(active && total ? progress : 0)}%`}</span>
      <div className={styles.progress} aria-label="Loading world"><i style={{ width: `${ready ? 100 : Math.max(6, active ? progress : 0)}%` }} /></div>
      <div className={styles.welcomeActions}>
        <button type="button" onClick={onTour} disabled={!ready}>Take the tour with ARIA</button>
        <button type="button" className={styles.ghost} onClick={onEnter} disabled={!ready}>Explore freely</button>
        <button type="button" className={styles.ghost} onClick={onSkip}>Skip to portfolio</button>
        <button type="button" className={styles.ghost} onClick={onModels}>See downloaded models</button>
      </div>
      <small>WASD to walk · drag to look · right-drag to pan · scroll to move</small>
    </div>
  );
}

function Credits() {
  const [credits, setCredits] = useState<Credit[]>([]);
  useEffect(() => {
    fetch("/models/world/credits.json").then((r) => r.json()).then((data: Record<string, Credit>) => setCredits(Object.values(data))).catch(() => setCredits([]));
  }, []);
  return (
    <div className={styles.credits}>
      <h2>Credits</h2>
      <p>3D models used with thanks to their creators.</p>
      <ul>
        {credits.map((c) => (
          <li key={c.file}><a href={c.source} target="_blank" rel="noreferrer">{c.title}</a> by {c.author.replace(/ \(.*\)/, "")} · <small>{c.license.replace(/ \(.*\)/, "")}</small></li>
        ))}
        <li>RobotExpressive by Tomás Laulhé (Quaternius), modified by Don McCurdy · <small>CC0</small></li>
        <li>Sedan from Kenney Car Kit · <small>CC0</small></li>
      </ul>
    </div>
  );
}

function Ticket({ onTravel }: { onTravel: () => void }) {
  return (
    <div className={styles.ticket}>
      <div>
        <small>ADMIT ONE · FREE ENTRY</small>
        <h2>Portfolio Museum</h2>
        <p>{profile.name}<br />{profile.role}</p>
        <span>Featured exhibits: Staffly · Meals SDK · Apex Admin Panels</span>
      </div>
      <aside><b>No. {String(new Date().getDate()).padStart(2, "0")}{new Date().getMonth() + 1}26</b><button type="button" onClick={onTravel}>Go to entrance</button></aside>
    </div>
  );
}

function TouchPad({ bridge }: { bridge: React.RefObject<PlayerBridge> }) {
  const hold = (key: "forward" | "turn", value: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => { event.currentTarget.setPointerCapture(event.pointerId); if (bridge.current.enabled) bridge.current.move[key] = value; },
    onPointerUp: () => { bridge.current.move[key] = 0; },
    onPointerCancel: () => { bridge.current.move[key] = 0; },
    onLostPointerCapture: () => { bridge.current.move[key] = 0; },
  });
  return (
    <div className={styles.touchPad} aria-label="Movement controls">
      <button type="button" aria-label="Walk forward" {...hold("forward", 1)}>▲</button>
      <button type="button" aria-label="Turn left" {...hold("turn", 1)}>◀</button>
      <button type="button" aria-label="Walk backward" {...hold("forward", -1)}>▼</button>
      <button type="button" aria-label="Turn right" {...hold("turn", -1)}>▶</button>
    </div>
  );
}

/** Announces the nearest thing with details so the HUD can offer "Press E". */
function NearbyPrompt() {
  const elapsed = useRef(0);
  const current = useRef<string | null>(null);
  useFrame(({ camera }, delta) => {
    if ((elapsed.current += delta) < 0.25) return;
    elapsed.current = 0;
    let best: (typeof INTERACTABLES)[number] | null = null;
    let bestDistance = 9;
    for (const item of INTERACTABLES) {
      const distance = Math.hypot(camera.position.x - item.x, camera.position.z - item.z);
      if (distance < bestDistance) { best = item; bestDistance = distance; }
    }
    const key = best?.label ?? null;
    if (key === current.current) return;
    current.current = key;
    window.dispatchEvent(new CustomEvent("world:near", { detail: best }));
  });
  return null;
}

export function PortfolioWorld({ forceFallback = false }: { forceFallback?: boolean }) {
  const bridge = useRef<PlayerBridge>({ move: { forward: 0, strafe: 0, turn: 0 }, travel: null, enabled: false });
  const [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [detail, setDetail] = useState<WorldPanel | null>(null);
  const [nearby, setNearby] = useState<{ label: string; panel: WorldPanel } | null>(null);
  useEffect(() => {
    const near = (event: Event) => setNearby((event as CustomEvent<{ label: string; panel: WorldPanel } | null>).detail);
    window.addEventListener("world:near", near);
    return () => window.removeEventListener("world:near", near);
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.code !== "KeyE" || !nearby || !bridge.current.enabled) return;
      setDetail(nearby.panel);
      setPanel("detail");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [nearby]);
  useEffect(() => {
    const open = (event: Event) => { setDetail((event as CustomEvent<WorldPanel>).detail); setPanel("detail"); };
    window.addEventListener("world:panel", open);
    return () => window.removeEventListener("world:panel", open);
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => { setReduced(media.matches); bridge.current.reducedMotion = media.matches; };
    const visibility = () => setHidden(document.hidden);
    motion(); visibility();
    media.addEventListener("change", motion); document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    bridge.current.enabled = entered && panel === null && !hidden;
    if (!bridge.current.enabled) {
      bridge.current.move = { forward: 0, strafe: 0, turn: 0 };
      bridge.current.inputRevision = (bridge.current.inputRevision ?? 0) + 1;
    }
  }, [entered, panel, hidden]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPanel(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const [tourStep, setStep] = useState<number | null>(null);
  const goToStep = (step: number | null) => {
    setStep(step);
    setTourStep(step);
    setPanel(null);
    setEntered(true);
    if (step !== null) bridge.current.travel = TOUR[step].view;
  };
  const goToStepRef = useRef(goToStep);
  goToStepRef.current = goToStep;
  useEffect(() => {
    const start = () => goToStepRef.current(0);
    window.addEventListener("world:tour-start", start);
    return () => window.removeEventListener("world:tour-start", start);
  }, []);

  if (forceFallback || failed || reduced) return <main className={styles.fallback}><Directory standalone /></main>;

  const travel = (id: string) => {
    bridge.current.travel = PLACES.find((p) => p.id === id) ?? null;
    setEntered(true);
    setPanel(null);
  };

  return (
    <main className={styles.world}>
      <Boundary fallback={<Directory standalone />}>
        <Canvas
          className={styles.canvas} shadows dpr={[1, 1.25]} gl={{ antialias: true, powerPreference: "high-performance" }}
          frameloop={hidden || panel !== null ? "never" : "always"}
          camera={{ fov: 62, near: 0.3, far: 3000, position: [0, 1.7, 60] }}
          onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", () => setFailed(true), { once: true })}
          aria-label="Interactive 3D island city with Arvind's portfolio museum"
        >
          <Suspense fallback={null}><Scene bridge={bridge} entered={entered} onReady={() => setReady(true)} onTicket={() => setPanel("ticket")} /></Suspense>
        </Canvas>
      </Boundary>

      <header className={styles.hud}>
        <span className={styles.brand}>ARVIND M <small>PORTFOLIO WORLD</small></span>
        <nav aria-label="World menu">
          <button type="button" onClick={() => goToStep(tourStep === null ? 0 : null)}>{tourStep === null ? "Tour with ARIA" : "End tour"}</button>
          <button type="button" aria-expanded={panel === "places"} onClick={() => setPanel(panel === "places" ? null : "places")}>Places</button>
          <button type="button" onClick={() => setPanel("ticket")}>Art ticket</button>
          <button type="button" onClick={() => setPanel("directory")}>Directory</button>
          <button type="button" onClick={() => setPanel("models")}>Your models</button>
          <button type="button" onClick={() => setPanel("credits")}>Credits</button>
          <Link href="/">Classic portfolio ↗</Link>
        </nav>
      </header>

      {panel === "places" ? (
        <ul className={styles.places}>
          {PLACES.map((place) => <li key={place.id}><button type="button" onClick={() => travel(place.id)}>{place.label}{place.description ? <small>{place.description}</small> : null}</button></li>)}
        </ul>
      ) : null}

      {panel && panel !== "places" ? (
        <div className={styles.overlay} onClick={() => setPanel(null)}>
          <div className={styles.sheet} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={() => setPanel(null)} aria-label="Close">✕</button>
            {panel === "directory" ? <Directory /> : null}
            {panel === "credits" ? <Credits /> : null}
            {panel === "ticket" ? <Ticket onTravel={() => travel("entrance")} /> : null}
            {panel === "models" ? <ModelLibrary onTravel={travel} /> : null}
            {panel === "detail" && detail ? <DetailPanel detail={detail} /> : null}
          </div>
        </div>
      ) : null}

      {!entered && panel === null ? <Loading ready={ready} onEnter={() => setEntered(true)} onSkip={() => { setEntered(true); setPanel("directory"); }} onModels={() => setPanel("models")} onTour={() => goToStep(0)} /> : null}

      {entered && tourStep !== null && panel === null ? (
        <section className={styles.tour} aria-live="polite" aria-label="Guided tour">
          <small>ARIA · STOP {tourStep + 1} OF {TOUR.length}</small>
          <h2>{TOUR[tourStep].title}</h2>
          <p>{TOUR[tourStep].text}</p>
          <div>
            <button type="button" className={styles.ghost} onClick={() => goToStep(tourStep - 1)} disabled={tourStep === 0}>Back</button>
            {TOUR[tourStep].panel ? <button type="button" className={styles.ghost} onClick={() => { setDetail(TOUR[tourStep].panel!); setPanel("detail"); }}>Open details</button> : null}
            {tourStep < TOUR.length - 1
              ? <button type="button" onClick={() => goToStep(tourStep + 1)}>Next stop →</button>
              : <button type="button" onClick={() => goToStep(null)}>Finish tour</button>}
            <button type="button" className={styles.linkButton} onClick={() => goToStep(null)}>End tour</button>
          </div>
        </section>
      ) : null}

      {entered && nearby && panel === null ? (
        <button type="button" className={`${styles.prompt} ${tourStep !== null ? styles.promptHigh : ""}`} onClick={() => { setDetail(nearby.panel); setPanel("detail"); }}>
          <kbd>E</kbd>{nearby.label}
        </button>
      ) : null}

      <footer className={styles.footer}>
        <span>WASD · drag: look · right/middle drag: pan · scroll: move · Shift: run</span>
        <div>
          <a href={profile.resumeUrl} download>Résumé</a>
          <a href={profileEmailUrl} className={styles.cta}>Contact me</a>
        </div>
      </footer>
      {entered && panel === null ? <TouchPad bridge={bridge} /> : null}
    </main>
  );
}
