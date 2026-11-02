import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { createInterface } from "node:readline/promises"
import { parseArgs } from "node:util"

import {
  type Checkpoint,
  type Choice,
  header,
  isMet,
  loadCheckpoint,
  type Scene,
  Traits,
  useItem,
} from "@loopback/engine"

import { type Ending, endings, scenes } from "./story.ts"
import { locations } from "./world.ts"

const { values } = parseArgs({
  options: {
    name: { type: "string", short: "n", default: "Kai" },
    choices: { type: "string", short: "c" },
  },
})

const player = values.name
const planned = values.choices?.split(",").map(Number) ?? []
const interactive = process.stdin.isTTY && planned.length === 0
const saveFile = path.join(
  import.meta.dirname,
  "..",
  "saves",
  "checkpoint.json",
)

const traits = new Traits()
const flags: string[] = []
const taken: string[] = []

const terminal = interactive
  ? createInterface({ input: process.stdin, output: process.stdout })
  : null

function personalise(line: string): string {
  return line.replaceAll("Kai", player).replaceAll("KAI", player.toUpperCase())
}

function findScene(id: string): Scene {
  const scene = scenes.find((candidate) => candidate.id === id)

  if (!scene) {
    throw new Error(`404: scene "${id}" not found in this timeline`)
  }

  return scene
}

function effectsText(choice: Choice): string {
  const parts = choice.effects.map(
    (effect) =>
      `${effect.trait} ${effect.amount > 0 ? "+" : ""}${effect.amount}`,
  )

  return parts.length > 0 ? ` (${parts.join(", ")})` : ""
}

async function pick(available: Choice[]): Promise<Choice> {
  if (terminal) {
    while (true) {
      const answer = Number(await terminal.question("> "))
      const choice = available[answer - 1]

      if (choice) {
        return choice
      }

      console.log(`Pick a number from 1 to ${available.length}.`)
    }
  }

  const index = (planned.shift() ?? 1) - 1
  const choice = available[index] ?? available[0]

  console.log(`> ${available.indexOf(choice) + 1}`)

  return choice
}

async function readLastRun(): Promise<Checkpoint | null> {
  let text: string

  try {
    text = await readFile(saveFile, "utf8")
  } catch {
    return null
  }

  try {
    return loadCheckpoint(text)
  } catch (error) {
    console.log(
      `[corrupted memory] ${error instanceof Error ? error.message : error}. Starting a clean timeline.`,
    )

    return null
  }
}

function decideEnding(): Ending {
  if (flags.includes("deleted")) {
    return "blackout"
  }

  if (flags.includes("ran") || traits.atLeast("paradox", 5)) {
    return "loopback"
  }

  if (flags.includes("reasoned")) {
    return "reboot"
  }

  return "scrap"
}

function growth(): string[] {
  const lines: string[] = []

  lines.push(
    traits.atLeast("courage", 4)
      ? "The guy who used to hide behind the counter is gone."
      : traits.atLeast("courage", 2)
        ? "You are braver than you were at 23:47."
        : "You still flinch when a door slams. Maybe next loop.",
  )

  lines.push(
    traits.atLeast("trust", 3)
      ? "You learned that trusting someone is a choice, not a weakness."
      : traits.atLeast("trust", 1)
        ? "You trust a few people now. Carefully."
        : "You trust your own two hands, and nobody else.",
  )

  if (traits.atLeast("paradox", 3)) {
    lines.push("Time has started to notice you.")
  }

  return lines
}

console.log("L O O P B A C K")
console.log("A retro-future story about memory, machines and second chances.")

const lastRun = await readLastRun()

if (lastRun) {
  console.log()
  console.log(
    `Deja vu. Somewhere, a version of ${lastRun.player} already lived this night and reached ${lastRun.ending ?? "nothing"} after ${lastRun.choices.length} choices.`,
  )

  if (lastRun.ending === "loopback") {
    flags.push("deja-vu")
  }
}

let current = findScene("intro")
let lastLocation = ""

while (true) {
  const location = locations.find((place) => place.id === current.location)

  if (location && location.id !== lastLocation) {
    console.log()
    console.log(header(location))
    lastLocation = location.id
  }

  console.log()

  for (const line of current.lines) {
    console.log(personalise(line))
  }

  console.log()

  const available: Choice[] = []

  for (const choice of current.choices) {
    if (!choice.requires || isMet(choice.requires, traits, flags)) {
      available.push(choice)
      console.log(
        `  ${available.length}. ${choice.label}${effectsText(choice)}`,
      )
    } else if (!choice.secret) {
      console.log(`  [locked: ${choice.requires.label}] ${choice.label}`)
    }
  }

  const choice = await pick(available)

  taken.push(choice.label)

  if (choice.use) {
    console.log(useItem(choice.use))
  }

  for (const effect of choice.effects) {
    traits.shift(effect.trait, effect.amount)
  }

  if (choice.flag) {
    flags.push(choice.flag)
  }

  console.log(traits.report())

  if (choice.next === "@ending") {
    break
  }

  current = findScene(choice.next)
}

terminal?.close()

const ending = decideEnding()

console.log()
console.log(header(locations[locations.length - 1]))
console.log()
console.log(endings[ending].title)
console.log()

for (const line of endings[ending].lines) {
  console.log(personalise(line))
}

console.log()
console.log(`Who ${player} became:`)

for (const line of growth()) {
  console.log(`- ${line}`)
}

const checkpoint: Checkpoint = {
  player,
  year: 2087,
  location: "city",
  choices: taken,
  ending,
}

await mkdir(path.dirname(saveFile), { recursive: true })
await writeFile(saveFile, JSON.stringify(checkpoint, null, 2))
