"use client";

import { Bounds, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import credits from "@/public/models/world/credits.json";
import { Model, type ModelName } from "./model";
import styles from "./world.module.css";

const entries = Object.entries(credits) as [ModelName, { title: string; author: string; source: string; license: string }][];
const destinations: Partial<Record<ModelName, string>> = {
  tree: "plaza", island: "coast", "food-stand": "cafe", supercar: "plaza",
  "jyn-erso": "plaza", "poe-dameron": "plaza", "cassian-andor": "plaza", "mace-windu": "plaza", sweeper: "plaza",
  "store-building": "city", "tower-building": "city", "simple-building": "city", office: "city",
  "bird-monster": "sculpture", rhino: "park", "flying-bird": "park", hummingbird: "park", plane: "aviation",
  helicopter: "aviation", museum: "architecture", "loft-16": "architecture", turbine: "skills",
};

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className={styles.modelError}>This model couldn’t load. Select another model to continue.</p> : this.props.children; }
}

export function ModelLibrary({ onTravel }: { onTravel: (place: string) => void }) {
  const [selected, setSelected] = useState<ModelName>("tree");
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = entries.find(([name]) => name === selected)![1];
  const place = destinations[selected];
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return <section className={styles.modelLibrary} aria-labelledby="model-library-title">
    <header><p>YOUR DOWNLOADED COLLECTION</p><h2 id="model-library-title">{entries.length} models to explore</h2><span>Select any model to see it up close. Drag to rotate, scroll to zoom, right-drag to pan.</span></header>
    <div className={styles.modelLayout}>
      <aside><label htmlFor="model-search">Find a model</label><input id="model-search" type="search" placeholder="Trees, birds, cars, buildings…" value={query} onChange={event => setQuery(event.target.value)} /><div className={styles.modelList}>
        {entries.filter(([name, credit]) => `${name} ${credit.title}`.toLowerCase().includes(query.toLowerCase())).map(([name, credit]) => <button key={name} type="button" aria-pressed={name === selected} onClick={() => { setSelected(name); setPaused(false); }}><span>{credit.title}</span><small>{destinations[name] ? "In the world + preview" : "Collection preview"}</small></button>)}
        {entries.every(([name, credit]) => !`${name} ${credit.title}`.toLowerCase().includes(query.toLowerCase())) && <p>No matching models.</p>}
      </div></aside>
      <div><div className={styles.modelViewer}>
        <PreviewBoundary key={selected}><Canvas key={selected} dpr={[1, 1.25]} frameloop={hidden ? "never" : paused ? "demand" : "always"} camera={{ position: [6, 4, 7], fov: 45 }} aria-label={`3D preview of ${active.title}`}>
          <color attach="background" args={["#dbe5e5"]} /><hemisphereLight args={["#ffffff", "#6d7164", 2.2]} /><directionalLight position={[5, 8, 6]} intensity={2.5} />
          <Suspense fallback={<Html center><span className={styles.modelLoading}>Loading {active.title}…</span></Html>}>
            <Bounds fit clip observe margin={1.3}><Model name={selected} height={3} timeScale={paused ? 0 : 1} /></Bounds>
          </Suspense>
          <OrbitControls makeDefault enableDamping={!paused} />
        </Canvas></PreviewBoundary>
      </div><div className={styles.modelInfo}><h3>{active.title}</h3><p>By {active.author.replace(/ \(.*\)/, "")}</p><div><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button>{place && <button type="button" onClick={() => onTravel(place)}>Visit its area →</button>}<a href={active.source} target="_blank" rel="noreferrer">Original model ↗</a></div><small>{active.license.replace(/ \(.*\)/, "")}{!place && " · Available here; not yet placed in the landscape."}</small></div></div>
    </div>
  </section>;
}
