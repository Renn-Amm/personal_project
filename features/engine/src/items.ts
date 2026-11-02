export interface Gadget {
  kind: "gadget"
  name: string
  charges: number
}

export interface Data {
  kind: "data"
  name: string
  bytes: number
  corrupted: boolean
}

export interface Keycard {
  kind: "keycard"
  name: string
  opens: string
}

export interface Memory {
  kind: "memory"
  name: string
  year: number
  text: string
}

export type Item = Gadget | Data | Keycard | Memory

export function useItem(item: Item): string {
  if (item.kind === "gadget") {
    return `The ${item.name} whines and fires. Charges left: ${item.charges - 1}.`
  }

  if (item.kind === "data") {
    return item.corrupted
      ? `The ${item.name} loads ${item.bytes} bytes of static.`
      : `The ${item.name} loads ${item.bytes} clean bytes. Something in it is still alive.`
  }

  if (item.kind === "keycard") {
    return `You swipe the ${item.name}. The ${item.opens} unlocks with a sound from another decade.`
  }

  if (item.kind === "memory") {
    return `A tape from ${item.year} plays: "${item.text}"`
  }

  throw new Error("Unknown item")
}
