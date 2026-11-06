import {
  type Choice,
  type Effect,
  type Item,
  type Location,
  type Requirement,
  type Scene,
  type Trait,
} from "@loopback/engine"

import { type Ending, type EndingText, type Story } from "./types.ts"

const endingIds: Ending[] = ["blackout", "loopback", "reboot", "scrap"]

export function isStory(value: unknown): value is Story {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("locations" in value) ||
    !Array.isArray(value.locations) ||
    !value.locations.every(isLocation)
  ) {
    return false
  }

  if (
    !("scenes" in value) ||
    !Array.isArray(value.scenes) ||
    !value.scenes.every(isScene)
  ) {
    return false
  }

  return "endings" in value && isEndings(value.endings)
}

function isLocation(value: unknown): value is Location {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "year" in value &&
    typeof value.year === "number" &&
    "description" in value &&
    typeof value.description === "string" &&
    "exits" in value &&
    isTextList(value.exits) &&
    "items" in value &&
    isTextList(value.items) &&
    "isGlitched" in value &&
    typeof value.isGlitched === "boolean" &&
    "danger" in value &&
    typeof value.danger === "number"
  )
}

function isScene(value: unknown): value is Scene {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "location" in value &&
    typeof value.location === "string" &&
    "lines" in value &&
    isTextList(value.lines) &&
    "choices" in value &&
    Array.isArray(value.choices) &&
    value.choices.every(isChoice)
  )
}

function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("next" in value) || typeof value.next !== "string") {
    return false
  }

  if (
    !("effects" in value) ||
    !Array.isArray(value.effects) ||
    !value.effects.every(isEffect)
  ) {
    return false
  }

  if ("flag" in value && typeof value.flag !== "string") {
    return false
  }

  if ("use" in value && !isItem(value.use)) {
    return false
  }

  if ("requires" in value && !isRequirement(value.requires)) {
    return false
  }

  if ("secret" in value && typeof value.secret !== "boolean") {
    return false
  }

  return true
}

function isEffect(value: unknown): value is Effect {
  return (
    typeof value === "object" &&
    value !== null &&
    "trait" in value &&
    isTrait(value.trait) &&
    "amount" in value &&
    typeof value.amount === "number"
  )
}

function isRequirement(value: unknown): value is Requirement {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("kind" in value)) {
    return false
  }

  if (value.kind === "trait") {
    return (
      "trait" in value &&
      isTrait(value.trait) &&
      "atLeast" in value &&
      typeof value.atLeast === "number"
    )
  }

  if (value.kind === "flag") {
    return "flag" in value && typeof value.flag === "string"
  }

  return false
}

function isItem(value: unknown): value is Item {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("name" in value) || typeof value.name !== "string") {
    return false
  }

  if (!("kind" in value)) {
    return false
  }

  if (value.kind === "gadget") {
    return "charges" in value && typeof value.charges === "number"
  }

  if (value.kind === "data") {
    return (
      "bytes" in value &&
      typeof value.bytes === "number" &&
      "corrupted" in value &&
      typeof value.corrupted === "boolean"
    )
  }

  if (value.kind === "keycard") {
    return "opens" in value && typeof value.opens === "string"
  }

  if (value.kind === "memory") {
    return (
      "year" in value &&
      typeof value.year === "number" &&
      "text" in value &&
      typeof value.text === "string"
    )
  }

  return false
}

function isEndings(value: unknown): value is Record<Ending, EndingText> {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return endingIds.every((id) => {
    if (!(id in value)) {
      return false
    }

    const ending: unknown = Object.entries(value).find(
      ([key]) => key === id,
    )?.[1]

    return (
      typeof ending === "object" &&
      ending !== null &&
      "title" in ending &&
      typeof ending.title === "string" &&
      "lines" in ending &&
      isTextList(ending.lines)
    )
  })
}

function isTrait(value: unknown): value is Trait {
  return value === "trust" || value === "courage" || value === "paradox"
}

function isTextList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

export function isEnding(value: string): value is Ending {
  return endingIds.some((id) => id === value)
}
