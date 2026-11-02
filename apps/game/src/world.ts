import {
  type Data,
  type Gadget,
  type Keycard,
  type Location,
  type Memory,
} from "@loopback/engine"

export const locations: Location[] = [
  {
    id: "pawn-shop",
    name: "Ren's Repair & Pawn",
    year: 2087,
    description: "Neo-Barcelona. Rain, neon and forty dead CRT screens.",
    exits: ["street", "rooftop"],
    items: ["walkman", "flux cassette"],
    isGlitched: true,
    danger: 1,
  },
  {
    id: "night-market",
    name: "Night Market, Omnivault Plaza",
    year: 2087,
    description: "Noodle steam, chrome clinics and cables everywhere.",
    exits: ["pawn-shop", "rooftop"],
    items: ["jammer", "ramen"],
    isGlitched: true,
    danger: 2,
  },
  {
    id: "rooftop",
    name: "The Rooftop",
    year: 2087,
    description: "A pink ice cream van with a reactor where the freezer was.",
    exits: ["pawn-shop"],
    items: ["chronovan"],
    isGlitched: false,
    danger: 2,
  },
  {
    id: "garage",
    name: "The Garage Under the Shop",
    year: 1987,
    description: "Solder, orange soda and a boombox playing synth.",
    exits: ["street"],
    items: ["home computer", "floppy disk", "cassette"],
    isGlitched: false,
    danger: 0,
  },
  {
    id: "city",
    name: "Neo-Barcelona",
    year: 2087,
    description: "The whole city, seen from the roof at sunrise.",
    exits: [],
    items: [],
    isGlitched: false,
    danger: 0,
  },
]

export const walkman: Gadget = {
  kind: "gadget",
  name: "EMP walkman",
  charges: 1,
}

export const floppy: Data = {
  kind: "data",
  name: "HALCYON.BAS floppy",
  bytes: 4096,
  corrupted: false,
}

export const keycard: Keycard = {
  kind: "keycard",
  name: "rooftop keycard",
  opens: "rooftop door",
}

export const tape: Memory = {
  kind: "memory",
  name: "grandpa's tape",
  year: 1987,
  text: "Nothing is written yet, kiddo. Not the future, not you. That is the whole point.",
}
