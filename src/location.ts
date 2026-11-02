interface Location {
  id: string
  name: string
  year: number
  description: string
  exits: string[]
  items: string[]
  isGlitched: boolean
  danger: number
}

const pawnShop: Location = {
  id: "pawn-shop",
  name: "Ren's Repair & Pawn",
  year: 2087,
  description:
    "Rain on neon. Forty dead CRT screens stacked to the ceiling, and one of them keeps flickering a word you never typed: HALCYON.",
  exits: ["street", "rooftop"],
  items: ["walkman", "flux cassette"],
  isGlitched: true,
  danger: 1,
}

const yearsFromNow = pawnShop.year - 2026

console.log(`== ${pawnShop.name} (${pawnShop.year}) ==`)
console.log(pawnShop.description)
console.log(`That is ${yearsFromNow} years after this code was written.`)
console.log(`Exits: ${pawnShop.exits.join(", ")}`)
console.log(`On the counter: ${pawnShop.items.join(" and ")}`)
