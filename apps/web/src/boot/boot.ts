const bootLines = [
  "OMNIVAULT DYNAMICS // MEMORY ARCHIVE",
  "NEO-BARCELONA, 23:47",
  "SIGNAL UNSTABLE. SOME MEMORIES ARE ENCRYPTED.",
]

export default function boot(root: HTMLElement): Promise<void> {
  const screen = document.createElement("section")
  screen.className = "boot"

  for (const text of bootLines) {
    const line = document.createElement("p")
    line.textContent = text
    screen.append(line)
  }

  const button = document.createElement("button")
  button.type = "button"
  button.textContent = "Boot the archive"
  screen.append(button)

  root.replaceChildren(screen)
  button.focus()

  return new Promise((resolve) => {
    function onBoot(): void {
      button.removeEventListener("click", onBoot)
      resolve()
    }

    button.addEventListener("click", onBoot)
  })
}
