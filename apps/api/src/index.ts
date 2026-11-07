import path from "node:path"

import buildApp from "./app.ts"

const app = await buildApp(
  path.join(import.meta.dirname, "..", "saves", "runs.json"),
)

const address = await app.listen({ port: 3000 })

console.log(`LOOPBACK archive online at ${address}`)
