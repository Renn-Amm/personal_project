import { isCheckpoint } from "@loopback/engine/checkpoint"
import { isEnding } from "@loopback/engine/story"
import { type FastifyPluginAsync } from "fastify"

import { RunLog } from "./storage.ts"

interface RunsOptions {
  file: string
}

interface PilotHeader {
  "x-pilot"?: string
}

const runs: FastifyPluginAsync<RunsOptions> = async (fastify, options) => {
  const log = new RunLog(options.file)

  fastify.post<{ Body: unknown }>("/runs", async (request, reply) => {
    const checkpoint = request.body

    if (!isCheckpoint(checkpoint)) {
      return reply.code(400).send({
        error:
          "A run needs a player, a year, a location, a list of choices and an ending",
      })
    }

    if (!isEnding(checkpoint.ending)) {
      return reply
        .code(400)
        .send({ error: `There is no ending called "${checkpoint.ending}"` })
    }

    return reply.code(201).send(await log.add(checkpoint))
  })

  fastify.get<{ Headers: PilotHeader }>("/runs", async (request, reply) => {
    const pilot = request.headers["x-pilot"]

    if (!pilot?.trim()) {
      return reply
        .code(401)
        .send({ error: "Say who you are with an x-pilot header" })
    }

    return log.of(pilot)
  })
}

export default runs
