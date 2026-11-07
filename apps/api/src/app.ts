import cors from "@fastify/cors"
import Fastify, { type FastifyInstance } from "fastify"

import runs from "./routes/runs/index.ts"
import story from "./routes/story/index.ts"

export default async function buildApp(
  runsFile: string,
): Promise<FastifyInstance> {
  const app = Fastify()

  await app.register(cors)
  await app.register(story)
  await app.register(runs, { file: runsFile })

  return app
}
