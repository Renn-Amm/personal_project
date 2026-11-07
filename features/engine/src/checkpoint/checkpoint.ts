export interface Checkpoint {
  player: string
  year: number
  location: string
  choices: string[]
  ending: string
}

export type SavedRun = Checkpoint & {
  id: number
  savedAt: string
}

export type RunCard = Pick<SavedRun, "id" | "player" | "ending" | "savedAt">

export function isCheckpoint(value: unknown): value is Checkpoint {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("player" in value) ||
    typeof value.player !== "string" ||
    value.player.trim() === ""
  ) {
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

  return "ending" in value && typeof value.ending === "string"
}

export function isSavedRun(value: unknown): value is SavedRun {
  return (
    isCheckpoint(value) &&
    "id" in value &&
    typeof value.id === "number" &&
    "savedAt" in value &&
    typeof value.savedAt === "string"
  )
}

export function isSavedRunList(value: unknown): value is SavedRun[] {
  return Array.isArray(value) && value.every(isSavedRun)
}
