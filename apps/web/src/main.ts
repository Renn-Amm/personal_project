import { getEnding, getEndings, getRuns } from "@loopback/engine/services"

import {
  endingList,
  markOpen,
  markReached,
  runList,
  showEnding,
  showMessage,
} from "./archive/index.ts"
import boot from "./boot/index.ts"

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function pilotForm(): {
  form: HTMLFormElement
  input: HTMLInputElement
} {
  const form = document.createElement("form")
  form.className = "pilot"

  const label = document.createElement("label")
  label.textContent = "Pilot"
  label.htmlFor = "pilot"

  const input = document.createElement("input")
  input.id = "pilot"
  input.name = "pilot"
  input.placeholder = "Kai"
  input.autocomplete = "off"

  const button = document.createElement("button")
  button.type = "submit"
  button.textContent = "Load memories"

  form.append(label, input, button)

  return { form, input }
}

async function start(root: HTMLElement): Promise<void> {
  await boot(root)

  const heading = document.createElement("h1")
  heading.textContent = "LOOPBACK // memory archive"

  const status = document.createElement("p")
  status.className = "status"
  status.textContent = "Loading the endings..."

  root.replaceChildren(heading, status)

  let endings

  try {
    endings = await getEndings()
  } catch (error) {
    status.className = "error"
    status.textContent = messageOf(error)

    return
  }

  const { form, input } = pilotForm()
  const list = endingList(endings)
  const panel = document.createElement("section")
  panel.className = "panel"
  const runs = document.createElement("section")
  runs.className = "runs-box"

  let reached = new Set<string>()

  status.textContent = "Type a pilot to see which endings they have lived."
  showMessage(panel, "Pick an ending from the list.")
  root.replaceChildren(heading, status, form, list, panel, runs)

  list.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const id = event.target.closest<HTMLLIElement>("li[data-id]")?.dataset.id

    if (!id) {
      return
    }

    markOpen(list, id)
    showMessage(panel, "Decoding...")

    getEnding(id)
      .then((page) => showEnding(panel, page, reached.has(page.id)))
      .catch((error: unknown) => showMessage(panel, messageOf(error), "error"))
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const pilot = input.value.trim()

    if (!pilot) {
      status.textContent = "Type a pilot name first."

      return
    }

    getRuns(pilot)
      .then((found) => {
        reached = new Set(found.map((run) => run.ending))
        markReached(list, reached)
        status.className = "status"
        status.textContent = `${pilot} has lived ${reached.size} of ${endings.length} endings.`
        const title = document.createElement("h3")
        title.textContent = `Runs of ${pilot}`
        runs.replaceChildren(title, runList(found))
      })
      .catch((error: unknown) => {
        status.className = "error"
        status.textContent = messageOf(error)
      })
  })
}

const root = document.querySelector<HTMLElement>("#archive")

if (!root) {
  throw new Error(
    "The page has no #archive element, so there is nowhere to draw",
  )
}

await start(root)
