import { type Item } from "./items.ts"
import { type Trait, type Traits } from "./traits.ts"

export interface Effect {
  trait: Trait
  amount: number
}

interface TraitRequirement {
  kind: "trait"
  trait: Trait
  atLeast: number
  label: string
}

interface FlagRequirement {
  kind: "flag"
  flag: string
  label: string
}

export type Requirement = TraitRequirement | FlagRequirement

export interface Choice {
  label: string
  next: string
  effects: Effect[]
  flag?: string
  use?: Item
  requires?: Requirement
  secret?: boolean
}

export interface Scene {
  id: string
  location: string
  lines: string[]
  choices: Choice[]
}

export function isMet(
  requirement: Requirement,
  traits: Traits,
  flags: string[],
): boolean {
  if (requirement.kind === "trait") {
    return traits.atLeast(requirement.trait, requirement.atLeast)
  }

  if (requirement.kind === "flag") {
    return flags.includes(requirement.flag)
  }

  throw new Error("Unknown requirement")
}
