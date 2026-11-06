import { type Location, type Scene } from "@loopback/engine"

export type Ending = "blackout" | "loopback" | "reboot" | "scrap"

export interface EndingText {
  title: string
  lines: string[]
}

export interface Story {
  locations: Location[]
  scenes: Scene[]
  endings: Record<Ending, EndingText>
}
