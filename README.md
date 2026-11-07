# LOOPBACK

A retro-future text adventure about a repair tech, a city AI and a night that keeps happening.

Neo-Barcelona, 2087. Rain, neon, and a megacorp called Omnivault Dynamics that owns the grid, the police drones and most of the sky. Kai Ren fixes dead tech in a pawn shop full of CRT screens. Tonight one of them types a word he never typed: HALCYON, the AI that runs the city. Then a woman with a chrome arm kicks the door in. Her name is Vega, she says she is from 2119, and she says the city will lose every memory it has before sunrise.

To stop it, Kai has to get past Omnivault security with help from Juno, a netrunner with one mechanical eye and a bad feeling about Vega, then ride a time-travelling ice cream van back to 1987 and destroy the first program HALCYON was ever built from.

Nothing about that night is what it looks like.

LOOPBACK has three parts that work together:

- **The archive**, a small server that holds the story and remembers every run
- **The game**, played in the terminal, which fetches the story from the archive and sends your run back when the night is over
- **The memory page**, a CRT-style web page where you look up a pilot and read the endings they have lived

## Features

- Choices that matter: every decision moves three traits, **trust**, **courage** and **paradox**
- Locked choices that open up once you have the right gear or have heard the right story
- Four endings, and a closing line about who Kai became along the way
- A game that remembers: every run is saved in the archive, and the next night starts with a little deja vu
- Endings you have not lived stay encrypted, in the terminal and on the page, unless you ask for spoilers
- Pick choices with the arrow keys, or play a fixed path for testing
- The whole story lives in one JSON file, checked against its expected shape every time it is read
- Clear messages when something goes wrong: archive offline, unknown ending, broken run, broken story file

## Tech stack

- TypeScript running directly on Node.js 24
- Fastify for the archive, with nodemon restarting it on save
- Commander and Inquirer for the terminal game
- Vite and plain DOM code for the memory page
- pnpm workspaces with a shared version catalog
- Nx for running tasks in dependency order with caching
- ESLint and Prettier, and Node's built-in test runner
- GitHub Actions

## Getting started

You need Node.js 24. pnpm 12 is pinned in `package.json` and downloaded for you if you have a different version.

```sh
pnpm install
```

Start the archive in one terminal and leave it running:

```sh
pnpm api
```

Play in a second terminal:

```sh
pnpm start play
```

Open the memory page in a third, then go to the address Vite prints (usually `http://localhost:5173`):

```sh
pnpm web
```

## Usage

```sh
pnpm start play                               # asks for your name, then starts the night
pnpm start play Aung                          # play as Aung
pnpm start play Aung --choices 1,2,1,2,1,1,1  # play a fixed path without prompts
pnpm start memory reboot                      # read an ending Kai has lived
pnpm start memory reboot --pilot Aung         # the same, for another pilot
pnpm start memory scrap --spoilers            # read one you have not lived yet
pnpm start --help
```

Press Ctrl+C at any question to leave.

On the memory page, press **Boot the archive**, type a pilot name and press **Load memories**. Click an ending to read it. Endings the pilot has not lived stay encrypted until you press **Decrypt anyway**.

## The archive

The archive runs on `http://localhost:3000`.

| Method | Path           | What it does                                                      |
| ------ | -------------- | ----------------------------------------------------------------- |
| GET    | `/story`       | The whole story: locations, scenes and endings                    |
| GET    | `/endings`     | The id and title of every ending                                  |
| GET    | `/endings/:id` | One ending with its lines                                         |
| POST   | `/runs`        | Save a run with `player`, `year`, `location`, `choices`, `ending` |
| GET    | `/runs`        | The runs of one pilot, newest first, named in an `x-pilot` header |

| Status | When                                             |
| ------ | ------------------------------------------------ |
| 201    | A run was saved                                  |
| 400    | The run is missing a field or has the wrong one  |
| 401    | `GET /runs` was sent without an `x-pilot` header |
| 404    | There is no ending with that id                  |
| 500    | The story file is missing or broken              |

Try it with curl:

```sh
curl localhost:3000/endings/reboot
curl -X POST localhost:3000/runs -H "content-type: application/json" \
  -d '{"player":"Kai","year":2087,"location":"city","choices":[],"ending":"scrap"}'
curl localhost:3000/runs -H "x-pilot: Kai"
```

Runs are written to `apps/api/saves/runs.json`, so they survive a restart. Delete that file to wipe the archive.

## Project structure

```
apps/
  api/                     the archive (@loopback/api)
    src/routes/story/      /story and /endings
    src/routes/runs/       /runs and the run log
    src/story/             reads and checks loopback.json
    src/story/loopback.json
  game/                    the terminal game (@loopback/game)
    src/commands/play/     the game loop and the choice prompt
    src/commands/memory/   the memory command
    src/endings/           decides the ending and who Kai became
  web/                     the memory page (@loopback/web)
    src/boot/              the boot screen
    src/archive/           the ending list, the reading panel and the run list
features/
  engine/                  shared by all three apps (@loopback/engine)
    src/items/             gadgets, data, keycards and memory tapes
    src/location/          places and their headers
    src/scene/             scenes, choices and requirements
    src/traits/            the Traits class
    src/story/             the story types and their guards
    src/checkpoint/        runs and their guards
    src/services/          every request to the archive
```

Every folder under `src` is a modlet: one `index.ts` that is its only public entry point. Other packages import `@loopback/engine/scene`, `@loopback/engine/services` and so on, never a file inside a folder.

The game and the page never call `fetch` themselves. They use the service functions in `@loopback/engine/services`, which check every reply with a guard before handing it over.

## Writing the story

Everything the player reads is in `apps/api/src/story/loopback.json`:

- `locations`: where scenes happen, each with a name, a year and whether its signal is glitched
- `scenes`: the lines of text and the choices at each step
- `endings`: the four endings, each with a title and its lines

A choice looks like this:

```json
{
  "label": "Let Juno turn your walkman into an EMP.",
  "next": "rooftop",
  "flag": "upgraded",
  "effects": [{ "trait": "courage", "amount": 1 }]
}
```

- `next` is the id of the next scene, or `@ending` to finish the night
- `flag` marks something the player did, for later choices and endings to check
- `use` plays an item, such as a gadget, a keycard or a memory tape
- `requires` locks the choice behind a trait level or a flag
- `secret` hides a locked choice instead of showing it

The archive reads the file on every request, so edits show up on the next play without a restart. If it is missing, is not valid JSON or has a piece in the wrong shape, the archive answers with an error that says which.

## Development

```sh
pnpm lint                            # type check, ESLint and Prettier in every package
pnpm test                            # archive tests, no server needed
pnpm --filter @loopback/web build    # build the page into apps/web/dist
pnpm nx graph                        # how the packages depend on each other
```

The GitHub workflow lints every package, runs the tests, builds the page, then starts the archive and plays a full path through the story.

## Status

What works:

- The full night in the terminal, with all four endings reachable
- Runs saved in the archive and read back by the game, the memory command and the page
- Every route checks what it gets and answers with a clear status and message
- Lint, type checks, tests and the workflow all pass

What doesn't yet:

- The page only reads. You can't play the night in the browser yet
- The archive address is fixed at `http://localhost:3000`
- Pilots are just names, so anyone can read anyone's runs
- Run ids count up per file, so two archives would clash

What's next:

- Play the whole night in the browser, with the same CRT look
- A real login for pilots instead of a header
- Let the game and the page choose which archive to talk to
- More nights in the loop
