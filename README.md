# LOOPBACK

A retro-future text adventure about a repair tech, a city AI and a night that keeps happening.

Neo-Barcelona, 2087. Rain, neon, and a megacorp called Omnivault Dynamics that owns the grid, the police drones and most of the sky. Kai Ren fixes dead tech in a pawn shop full of CRT screens. Tonight one of them types a word he never typed: HALCYON, the AI that runs the city. Then a woman with a chrome arm kicks the door in. Her name is Vega, she says she is from 2119, and she says the city will lose every memory it has before sunrise.

To stop it, Kai has to get past Omnivault security with help from Juno, a netrunner with one mechanical eye and a bad feeling about Vega, then ride a time-travelling ice cream van back to 1987 and destroy the first program HALCYON was ever built from.

Nothing about that night is what it looks like.

## Features

- Choices that matter: every decision moves three traits, **trust**, **courage** and **paradox**
- Locked choices that open up once you have the right gear or have heard the right story
- Four endings, and a closing line about who Kai became along the way
- A game that remembers: get caught in a loop and the next night starts a little differently
- A memory log of the endings you have reached, with the rest kept hidden
- Pick choices with the arrow keys, or play a fixed path for testing
- The whole story lives in one JSON file, checked against its expected shape on every start

## Tech stack

- TypeScript running directly on Node.js 24
- Commander and Inquirer for the command line
- pnpm workspaces with a shared version catalog
- Nx for running tasks in dependency order with caching
- ESLint and Prettier
- GitHub Actions

## Getting started

```sh
pnpm install
pnpm start play
```

pnpm 12 is pinned in `package.json` and downloaded for you if you have a different version.

## Usage

```sh
pnpm start play                               # asks for your name, then starts the night
pnpm start play Aung                          # play as Aung
pnpm start play Aung --choices 1,2,1,2,1,1,1  # play a fixed path without prompts
pnpm start memory reboot                      # look back at an ending you reached
pnpm start memory scrap --spoilers            # read one you have not reached yet
pnpm start --help
```

Press Ctrl+C at any question to leave.

## Project structure

```
apps/
  game/                    the loopback command
    src/commands/play/     the game loop and the choice prompt
    src/commands/memory/   the memory log
    src/story/             loads and checks the story, decides the ending
    src/story/loopback.json
features/
  engine/                  locations, items, traits, scenes and the checkpoint guard
```

`@loopback/game` depends on `@loopback/engine`. Each folder under `apps/game/src` has a single `index.ts` that is its only public entry point, so the rest of the game never reaches into its files.

## Writing the story

Everything the player reads is in `apps/game/src/story/loopback.json`:

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

Edit the file and the game picks it up on the next start. If it is missing, is not valid JSON or has a piece in the wrong shape, the game says which and stops.

## Development

```sh
pnpm lint          # type check, ESLint and Prettier in every package
pnpm nx graph      # how the packages depend on each other
```

The GitHub workflow lints both packages and plays a full path through the story on every change.

## Roadmap

- A server that hosts the story, so it can be played from anywhere
- A browser version with a CRT look
- More nights in the loop
