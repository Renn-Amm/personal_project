import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { type Checkpoint, loadCheckpoint } from "@loopback/engine"

const saveFile = path.join(
  import.meta.dirname,
  "..",
  "..",
  "saves",
  "checkpoint.json",
)

export async function readLastRun(): Promise<Checkpoint | undefined> {
  let text: string

  try {
    text = await readFile(saveFile, "utf8")
  } catch {
    return undefined
  }

  try {
    return loadCheckpoint(text)
  } catch (error) {
    console.log(
      `[corrupted memory] ${error instanceof Error ? error.message : error}. Starting a clean timeline.`,
    )

    return undefined
  }
}

export async function saveRun(checkpoint: Checkpoint): Promise<void> {
  await mkdir(path.dirname(saveFile), { recursive: true })
  await writeFile(saveFile, JSON.stringify(checkpoint, null, 2))
}
