import { input } from "@inquirer/prompts"
import { program } from "commander"

import memory from "./commands/memory/index.ts"
import play from "./commands/play/index.ts"

program
  .name("loopback")
  .description("A retro-future text adventure about memory and machines")

program
  .command("play")
  .description("Live the night of 23:47, one choice at a time")
  .argument("[pilot]", "the name of the repair tech")
  .option("-c, --choices <list>", "play a fixed path, such as 1,2,1")
  .action(async (pilot: string | undefined, options: { choices?: string }) => {
    const name =
      pilot ??
      (await input({
        message: "What is your name, repair tech?",
        default: "Kai",
      }))

    await play(name, options)
  })

program
  .command("memory")
  .description("Look back at an ending: blackout, loopback, reboot or scrap")
  .argument("<ending>", "the ending to remember")
  .option("-p, --pilot <name>", "whose memories to look through", "Kai")
  .option("-s, --spoilers", "read an ending you have not reached yet")
  .action(memory)

try {
  await program.parseAsync()
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    process.exitCode = 130
  } else {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
