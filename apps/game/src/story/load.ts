import { readFile } from "node:fs/promises"
import path from "node:path"

import { isStory } from "./guards.ts"
import { type Story } from "./types.ts"

export default async function loadStory(name = "loopback"): Promise<Story> {
  const file = path.join(import.meta.dirname, `${name}.json`)

  let text: string

  try {
    text = await readFile(file, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`The story file "${name}.json" is missing`, {
        cause: error,
      })
    }

    throw error
  }

  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new Error(`The story file "${name}.json" is not valid JSON`)
  }

  if (!isStory(value)) {
    throw new Error(
      `The story file "${name}.json" is missing a scene, a choice or an ending, or has one in the wrong shape`,
    )
  }

  return value
}
