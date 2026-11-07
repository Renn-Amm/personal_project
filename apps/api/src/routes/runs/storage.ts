import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  type Checkpoint,
  isSavedRunList,
  type SavedRun,
} from "@loopback/engine/checkpoint"

export class RunLog {
  private file: string
  private runs: SavedRun[] | undefined

  public constructor(file: string) {
    this.file = file
  }

  public async add(checkpoint: Checkpoint): Promise<SavedRun> {
    const runs = await this.all()
    const run: SavedRun = {
      ...checkpoint,
      id: runs.length + 1,
      savedAt: new Date().toISOString(),
    }

    runs.push(run)
    await mkdir(path.dirname(this.file), { recursive: true })
    await writeFile(this.file, JSON.stringify(runs, null, 2))

    return run
  }

  public async of(pilot: string): Promise<SavedRun[]> {
    const name = pilot.trim().toLowerCase()
    const runs = await this.all()

    return runs.filter((run) => run.player.toLowerCase() === name).reverse()
  }

  private async all(): Promise<SavedRun[]> {
    if (this.runs) {
      return this.runs
    }

    let text: string

    try {
      text = await readFile(this.file, "utf8")
    } catch {
      this.runs = []

      return this.runs
    }

    let value: unknown

    try {
      value = JSON.parse(text)
    } catch {
      value = undefined
    }

    this.runs = isSavedRunList(value) ? value : []

    return this.runs
  }
}
