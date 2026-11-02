interface Checkpoint {
  player: string
  year: number
  location: string
  choices: string[]
  ending?: string
}

function loadCheckpoint(text: string): Checkpoint {
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

const checkpoints = [
  '{"player":"Kai","year":1987,"location":"garage","choices":["go","talk"],"ending":"reboot"}',
  '{"player":"Kai","year":2087,"location":"pawn-shop","choices":[]}',
  '{"player":"Kai","year":"1987","location":"garage","choices":[]}',
  '{"year":2087,"location":"pawn-shop","choices":[]}',
  '{"player":"Kai","year":2087,"location":"pawn-shop","choices":[1,2]}',
  '{"player":"Kai","year":2087,"location":"pawn-shop","choices":[],"ending":false}',
  '{"player":"Kai","year":20',
  "null",
]

for (const text of checkpoints) {
  try {
    const checkpoint = loadCheckpoint(text)
    console.log(
      `Loaded: ${checkpoint.player} in ${checkpoint.location}, ${checkpoint.year}, after ${checkpoint.choices.length} choices${checkpoint.ending ? `, last ending ${checkpoint.ending}` : ""}`,
    )
  } catch (error) {
    console.log(`Rejected: ${error instanceof Error ? error.message : error}`)
  }
}
