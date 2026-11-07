import { type RunCard } from "@loopback/engine/checkpoint"

export function runList(runs: RunCard[]): HTMLElement {
  if (runs.length === 0) {
    const empty = document.createElement("p")
    empty.textContent = "No runs in the archive yet. Play a night first."

    return empty
  }

  const list = document.createElement("ol")
  list.className = "runs"

  for (const run of runs) {
    const item = document.createElement("li")
    const when = new Date(run.savedAt).toLocaleString()

    item.textContent = `Run #${run.id}: ${run.ending}, ${when}`
    list.append(item)
  }

  return list
}
