import { projects } from "@/content/projects/projects";
import { profile } from "@/content/profile";
import { HALL, type Place } from "./layout";
import type { WorldPanel } from "./places";

export type TourStop = {
  title: string;
  text: string;
  /** Where the visitor's camera is taken. */
  view: Place;
  /** Where ARIA stands for this stop. */
  robot: [number, number];
  panel?: WorldPanel;
};

const names = (from: number, to: number) => projects.slice(from, to).map((p) => p.title).join(", ");

export const TOUR: TourStop[] = [
  {
    title: "Welcome",
    text: `Hi, I’m ARIA! Welcome to ${profile.shortName}’s Portfolio World. I’ll walk you through his work. Follow me to the museum.`,
    view: { id: "tour-0", label: "Welcome", position: [0, 60], yaw: 0 },
    robot: [3.4, 52.5],
  },
  {
    title: "The Portfolio Museum",
    text: "The banners show the featured work. Watch the glass doors: they slide open as we arrive.",
    view: { id: "tour-1", label: "Museum", position: [0, 16], yaw: 0 },
    robot: [2.5, 8],
  },
  {
    title: "Inside the museum",
    text: "Real project screens hang on the walls, artifacts turn in the glass cases, and a Van Gogh waits on the back wall.",
    view: { id: "tour-2", label: "Lobby", position: [0, -8.5], yaw: 0 },
    robot: [4.5, -15],
  },
  {
    title: "West gallery",
    text: `${names(0, 4)}. Step close to any frame and press E for the full case study.`,
    view: { id: "tour-3", label: "West gallery", position: [-21, -24], yaw: Math.PI / 2 },
    robot: [-24, -17],
    panel: { kind: "project", slug: projects[0].slug },
  },
  {
    title: "East gallery",
    text: `${names(4, 7)}: full-stack builds with live demos you can open.`,
    view: { id: "tour-4", label: "East gallery", position: [21, -24], yaw: -Math.PI / 2 },
    robot: [24, -30],
    panel: { kind: "project", slug: projects[4]?.slug ?? projects[0].slug },
  },
  {
    title: "Art & artifacts",
    text: "The centrepiece is Van Gogh’s Two Poplars in the Alpilles. On the left: who Arvind is and how to reach him.",
    view: { id: "tour-5", label: "Back wall", position: [0, -27], yaw: 0 },
    robot: [4, -37],
  },
  {
    title: "Project Avenue",
    text: "Outside, Project Avenue lines up every project for a quick browse. Each display opens its case study.",
    view: { id: "tour-6", label: "Project Avenue", position: [0, 70], yaw: Math.PI },
    robot: [3, 78],
  },
  {
    title: "Skills Garden",
    text: "Each pillar is a skill group. Open one to see exactly which projects use each skill.",
    view: { id: "tour-7", label: "Skills Garden", position: [0, -47.5], yaw: 0 },
    robot: [3.5, -55],
    panel: { kind: "skill", index: 0 },
  },
  {
    title: "Journey Walk",
    text: `From ${profile.journey[0].title.toLowerCase()} to ${profile.journey[profile.journey.length - 1].title.toLowerCase()}: four steps that shaped how Arvind builds.`,
    view: { id: "tour-8", label: "Journey Walk", position: [-72, -47], yaw: 0 },
    robot: [-70, -57],
  },
  {
    title: "Contact Pier",
    text: `That’s the tour! Arvind is ${profile.availability.toLowerCase()}. Let’s build something together.`,
    view: { id: "tour-9", label: "Contact Pier", position: [0, 280], yaw: Math.PI },
    robot: [2.2, 289],
    panel: { kind: "contact" },
  },
];

export type TourEvent = { step: number | null };
export const setTourStep = (step: number | null) => window.dispatchEvent(new CustomEvent<TourEvent>("world:tour", { detail: { step } }));

/** Waypoints ARIA walks through, so it uses the museum door instead of walking through walls. */
export function robotRoute(from: [number, number], to: [number, number]): [number, number][] {
  const inside = (p: [number, number]) => p[0] > HALL.minX && p[0] < HALL.maxX && p[1] > HALL.minZ && p[1] < HALL.maxZ;
  if (inside(from) === inside(to)) return [to];
  const door: [number, number][] = [[0, HALL.maxZ - 4], [0, HALL.maxZ + 2], [0, 7]];
  return inside(from) ? [...door, to] : [...door.reverse(), to];
}
