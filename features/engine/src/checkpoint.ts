export interface Checkpoint {
  player: string
  year: number
  location: string
  choices: string[]
  ending?: string
}

export function loadCheckpoint(text: string): Checkpoint {
  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new Error("The checkpoint is not valid JSON")
  }

  if (!isCheckpoint(value)) {
    throw new Error(
      "The checkpoint needs a player, a year, a location, a list of choices and, if present, an ending as text",
    )
  }

  return value
}

function isCheckpoint(value: unknown): value is Checkpoint {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("player" in value) || typeof value.player !== "string") {
    return false
  }

  if (!("year" in value) || typeof value.year !== "number") {
    return false
  }

  if (!("location" in value) || typeof value.location !== "string") {
    return false
  }

  if (
    !("choices" in value) ||
    !Array.isArray(value.choices) ||
    !value.choices.every((choice) => typeof choice === "string")
  ) {
    return false
  }

  if ("ending" in value && typeof value.ending !== "string") {
    return false
  }

  return true
}
