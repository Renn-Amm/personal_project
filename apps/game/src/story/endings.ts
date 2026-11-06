import { type Traits } from "@loopback/engine"

import { type Ending } from "./types.ts"

export function decideEnding(traits: Traits, flags: string[]): Ending {
  if (flags.includes("deleted")) {
    return "blackout"
  }

  if (flags.includes("ran") || traits.atLeast("paradox", 5)) {
    return "loopback"
  }

  if (flags.includes("reasoned")) {
    return "reboot"
  }

  return "scrap"
}

export function growth(traits: Traits): string[] {
  const lines = [courageLine(traits), trustLine(traits)]

  if (traits.atLeast("paradox", 3)) {
    lines.push("Time has started to notice you.")
  }

  return lines
}

function courageLine(traits: Traits): string {
  if (traits.atLeast("courage", 4)) {
    return "The guy who used to hide behind the counter is gone."
  }

  if (traits.atLeast("courage", 2)) {
    return "You are braver than you were at 23:47."
  }

  return "You still flinch when a door slams. Maybe next loop."
}

function trustLine(traits: Traits): string {
  if (traits.atLeast("trust", 3)) {
    return "You learned that trusting someone is a choice, not a weakness."
  }

  if (traits.atLeast("trust", 1)) {
    return "You trust a few people now. Carefully."
  }

  return "You trust your own two hands, and nobody else."
}
