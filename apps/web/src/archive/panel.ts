import { type EndingPage } from "@loopback/engine/story"

export function showEnding(
  panel: HTMLElement,
  page: EndingPage,
  reached: boolean,
): void {
  const title = document.createElement("h2")
  title.textContent = page.title

  if (reached) {
    panel.replaceChildren(title, ...paragraphs(page.lines))

    return
  }

  const locked = document.createElement("p")
  locked.className = "warning"
  locked.textContent =
    "This memory is still encrypted. Live this ending first, or decrypt it and spoil it."

  const decrypt = document.createElement("button")
  decrypt.type = "button"
  decrypt.textContent = "Decrypt anyway"
  decrypt.addEventListener(
    "click",
    () => {
      panel.replaceChildren(title, ...paragraphs(page.lines))
    },
    { once: true },
  )

  panel.replaceChildren(title, locked, decrypt)
}

export function showMessage(
  panel: HTMLElement,
  text: string,
  kind: "info" | "error" = "info",
): void {
  const message = document.createElement("p")
  message.className = kind
  message.textContent = text
  panel.replaceChildren(message)
}

function paragraphs(lines: string[]): HTMLParagraphElement[] {
  return lines.map((text) => {
    const line = document.createElement("p")
    line.textContent = text

    return line
  })
}
