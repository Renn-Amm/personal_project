import { select } from "@inquirer/prompts"
import { type Choice, isMet } from "@loopback/engine/scene"
import { type Traits } from "@loopback/engine/traits"

export function effectsText(choice: Choice): string {
  const parts = choice.effects.map(
    (effect) =>
      `${effect.trait} ${effect.amount > 0 ? "+" : ""}${effect.amount}`,
  )

  return parts.length > 0 ? ` (${parts.join(", ")})` : ""
}

export function visible(
  choices: Choice[],
  traits: Traits,
  flags: string[],
): { choice: Choice; open: boolean }[] {
  return choices
    .map((choice) => ({
      choice,
      open: !choice.requires || isMet(choice.requires, traits, flags),
    }))
    .filter(({ choice, open }) => open || !choice.secret)
}

export async function ask(
  choices: Choice[],
  traits: Traits,
  flags: string[],
): Promise<Choice> {
  return select({
    message: "What do you do?",
    choices: visible(choices, traits, flags).map(({ choice, open }) => ({
      name: `${choice.label}${effectsText(choice)}`,
      value: choice,
      disabled: open ? false : `[locked: ${choice.requires?.label ?? ""}]`,
    })),
  })
}
