import { type Location } from "../location/index.ts"
import { type Scene } from "../scene/index.ts"

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

export type EndingCard = Pick<EndingText, "title"> & {
  id: Ending
}

export type EndingPage = EndingCard & EndingText
