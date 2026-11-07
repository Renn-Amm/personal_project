import { getEnding, getRuns } from "@loopback/engine/services"

interface Options {
  pilot: string
  spoilers?: boolean
}

export default async function memory(
  ending: string,
  options: Options,
): Promise<void> {
  const [page, runs] = await Promise.all([
    getEnding(ending),
    getRuns(options.pilot),
  ])
  const reached = runs.some((run) => run.ending === page.id)

  console.log(page.title)
  console.log(
    reached
      ? `${options.pilot} has lived this one.`
      : `${options.pilot} has not lived this one yet.`,
  )
  console.log()

  if (!reached && !options.spoilers) {
    console.log(
      "The memory is still encrypted. Add --spoilers to read it anyway.",
    )

    return
  }

  for (const line of page.lines) {
    console.log(line)
  }
}
