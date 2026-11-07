export interface Location {
  id: string
  name: string
  year: number
  description: string
  exits: string[]
  items: string[]
  isGlitched: boolean
  danger: number
}

export function header(location: Location): string {
  const glitch = location.isGlitched ? " [signal unstable]" : ""

  return `== ${location.name}, ${location.year}${glitch} ==`
}
