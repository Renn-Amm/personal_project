import { type EndingCard } from "@loopback/engine/story"

export function endingList(endings: EndingCard[]): HTMLUListElement {
  const list = document.createElement("ul")
  list.className = "endings"

  for (const ending of endings) {
    const item = document.createElement("li")
    item.dataset.id = ending.id

    const title = document.createElement("span")
    title.className = "title"
    title.textContent = ending.title

    const state = document.createElement("span")
    state.className = "state"
    state.textContent = "encrypted"

    item.append(title, state)
    list.append(item)
  }

  return list
}

export function markReached(list: HTMLUListElement, reached: Set<string>) {
  for (const item of list.querySelectorAll<HTMLLIElement>("li[data-id]")) {
    const lived = reached.has(item.dataset.id ?? "")
    const state = item.querySelector(".state")

    item.classList.toggle("reached", lived)

    if (state) {
      state.textContent = lived ? "lived" : "encrypted"
    }
  }
}

export function markOpen(list: HTMLUListElement, id: string) {
  for (const item of list.querySelectorAll<HTMLLIElement>("li[data-id]")) {
    item.classList.toggle("open", item.dataset.id === id)
  }
}
