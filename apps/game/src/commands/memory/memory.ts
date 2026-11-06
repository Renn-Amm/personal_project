import loadStory, { isEnding } from "../../story/index.ts"
import { readLastRun } from "../../lib/save.ts"

interface Options {
  spoilers?: boolean
}

export default async function memory(
  ending: string,
  options: Options,
): Promise<void> {
  const story = await loadStory()

  if (!isEnding(ending)) {
    throw new Error(
      `There is no ending called "${ending}". Try ${Object.keys(story.endings).join(", ")}.`,
    )
  }

  const lastRun = await readLastRun()
  const reached = lastRun?.seen?.includes(ending) ?? false
  const { title, lines } = story.endings[ending]

  console.log(title)
  console.log(
    reached ? "You have lived this one." : "You have not lived this one yet.",
  )
  console.log()

  if (!reached && !options.spoilers) {
    console.log(
      "The memory is still encrypted. Add --spoilers to read it anyway.",
    )

    return
  }

  for (const line of lines) {
    console.log(line)
  }
}
