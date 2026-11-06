import {
  type Choice,
  header,
  type Scene,
  Traits,
  useItem,
} from "@loopback/engine"

import loadStory, {
  decideEnding as pickEnding,
  growth,
} from "../../story/index.ts"
import { readLastRun, saveRun } from "../../lib/save.ts"
import { ask, effectsText, visible } from "./ask.ts"

interface Options {
  choices?: string
}

export default async function play(
  pilot: string,
  options: Options,
): Promise<void> {
  const story = await loadStory()
  const planned = options.choices?.split(",").map(Number) ?? []
  const interactive = process.stdin.isTTY && planned.length === 0

  const traits = new Traits()
  const flags: string[] = []
  const taken: string[] = []

  const personalise = (line: string): string =>
    line.replaceAll("Kai", pilot).replaceAll("KAI", pilot.toUpperCase())

  const findScene = (id: string): Scene => {
    const scene = story.scenes.find((candidate) => candidate.id === id)

    if (!scene) {
      throw new Error(`404: scene "${id}" not found in this timeline`)
    }

    return scene
  }

  const pick = async (choices: Choice[]): Promise<Choice> => {
    if (interactive) {
      return ask(choices, traits, flags)
    }

    const shown = visible(choices, traits, flags)
    const open = shown.filter((entry) => entry.open).map(({ choice }) => choice)

    for (const { choice, open: isOpen } of shown) {
      const number = open.indexOf(choice) + 1

      console.log(
        isOpen
          ? `  ${number}. ${choice.label}${effectsText(choice)}`
          : `  [locked: ${choice.requires?.label ?? ""}] ${choice.label}`,
      )
    }

    const picked = open[(planned.shift() ?? 1) - 1] ?? open[0]

    console.log(`> ${open.indexOf(picked) + 1}`)

    return picked
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
    const location = story.locations.find(
      (place) => place.id === current.location,
    )

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

    const choice = await pick(current.choices)

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

  const ending = pickEnding(traits, flags)
  const finale = story.locations.find((place) => place.id === "city")

  console.log()

  if (finale) {
    console.log(header(finale))
    console.log()
  }

  console.log(story.endings[ending].title)
  console.log()

  for (const line of story.endings[ending].lines) {
    console.log(personalise(line))
  }

  console.log()
  console.log(`Who ${pilot} became:`)

  for (const line of growth(traits)) {
    console.log(`- ${line}`)
  }

  const seen = new Set([...(lastRun?.seen ?? []), ending])

  await saveRun({
    player: pilot,
    year: 2087,
    location: "city",
    choices: taken,
    ending,
    seen: [...seen],
  })
}
