import { endingIds, isEnding } from "@loopback/engine/story"
import { type FastifyPluginAsync } from "fastify"

import loadStory from "#story"

interface EndingParams {
  id: string
}

const story: FastifyPluginAsync = async (fastify) => {
  fastify.get("/story", async () => loadStory())

  fastify.get("/endings", async () => {
    const { endings } = await loadStory()

    return endingIds.map((id) => ({ id, title: endings[id].title }))
  })

  fastify.get<{ Params: EndingParams }>(
    "/endings/:id",
    async (request, reply) => {
      const { id } = request.params

      if (!isEnding(id)) {
        return reply.code(404).send({
          error: `There is no ending called "${id}". Try ${endingIds.join(", ")}.`,
        })
      }

      const { endings } = await loadStory()

      return { id, ...endings[id] }
    },
  )
}

export default story
