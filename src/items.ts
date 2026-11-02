interface Gadget {
  kind: "gadget"
  name: string
  charges: number
}

interface Data {
  kind: "data"
  name: string
  bytes: number
  corrupted: boolean
}

interface Keycard {
  kind: "keycard"
  name: string
  opens: string
}

interface Memory {
  kind: "memory"
  name: string
  year: number
  text: string
}

type Item = Gadget | Data | Keycard | Memory

function useItem(item: Item): string {
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

const items: Item[] = [
  { kind: "gadget", name: "EMP walkman", charges: 2 },
  { kind: "data", name: "HALCYON.BAS floppy", bytes: 4096, corrupted: false },
  { kind: "keycard", name: "rooftop keycard", opens: "rooftop door" },
  {
    kind: "memory",
    name: "grandpa's tape",
    year: 1987,
    text: "Nothing is written yet, kid. That is the whole point.",
  },
]

for (const item of items) {
  console.log(useItem(item))
}
