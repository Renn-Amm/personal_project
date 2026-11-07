import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import buildApp from "./app.ts"

const folder = await mkdtemp(path.join(tmpdir(), "loopback-"))
const app = await buildApp(path.join(folder, "runs.json"))

const run = {
  player: "Kai",
  year: 2087,
  location: "city",
  choices: ["Listen to the screen.", "Trust Vega."],
  ending: "reboot",
}

await test("GET /story sends the whole story", async () => {
  const reply = await app.inject({ method: "GET", url: "/story" })

  assert.equal(reply.statusCode, 200)
  assert.ok(reply.json<{ scenes: unknown[] }>().scenes.length > 0)
})

await test("GET /endings lists every ending by id and title", async () => {
  const reply = await app.inject({ method: "GET", url: "/endings" })
  const ids = reply.json<{ id: string }[]>().map(({ id }) => id)

  assert.equal(reply.statusCode, 200)
  assert.deepEqual(ids, ["blackout", "loopback", "reboot", "scrap"])
})

await test("GET /endings/:id sends one ending or 404", async () => {
  const found = await app.inject({ method: "GET", url: "/endings/reboot" })
  const missing = await app.inject({ method: "GET", url: "/endings/utopia" })

  assert.equal(found.statusCode, 200)
  assert.equal(found.json<{ id: string }>().id, "reboot")
  assert.equal(missing.statusCode, 404)
  assert.match(missing.json<{ error: string }>().error, /utopia/)
})

await test("POST /runs saves a run and refuses broken ones", async () => {
  const saved = await app.inject({ method: "POST", url: "/runs", payload: run })

  assert.equal(saved.statusCode, 201)
  assert.equal(saved.json<{ id: number }>().id, 1)

  const broken = [
    {},
    { ...run, player: "" },
    { ...run, choices: "all of them" },
    { ...run, ending: "utopia" },
  ]

  for (const payload of broken) {
    const reply = await app.inject({ method: "POST", url: "/runs", payload })

    assert.equal(reply.statusCode, 400)
  }
})

await test("GET /runs needs a pilot and only sends their runs", async () => {
  await app.inject({
    method: "POST",
    url: "/runs",
    payload: { ...run, player: "Juno", ending: "scrap" },
  })

  const anonymous = await app.inject({ method: "GET", url: "/runs" })
  const kai = await app.inject({
    method: "GET",
    url: "/runs",
    headers: { "x-pilot": "kai" },
  })

  assert.equal(anonymous.statusCode, 401)
  assert.deepEqual(
    kai.json<{ player: string }[]>().map(({ player }) => player),
    ["Kai"],
  )
})

await test("runs survive a restart", async () => {
  const again = await buildApp(path.join(folder, "runs.json"))
  const reply = await again.inject({
    method: "GET",
    url: "/runs",
    headers: { "x-pilot": "Juno" },
  })

  assert.equal(reply.json<unknown[]>().length, 1)
  await again.close()
})

await app.close()
await rm(folder, { recursive: true, force: true })
