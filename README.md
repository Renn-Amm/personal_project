# LOOPBACK

A retro-future text adventure about a repair tech, a city AI and a night that keeps happening.

Neo-Barcelona, 2087. Rain, neon, and a megacorp called Omnivault Dynamics that owns the grid, the police drones and most of the sky. Kai Ren fixes dead tech in a pawn shop full of CRT screens. Tonight one of them types a word he never typed: HALCYON, the AI that runs the city. Then a woman with a chrome arm kicks the door in. Her name is Vega, she says she is from 2119, and she says the city will lose every memory it has before sunrise.

To stop it, Kai has to get past Omnivault security with help from Juno, a netrunner with one mechanical eye and a bad feeling about Vega, then ride a time-travelling ice cream van back to 1987 and destroy the first program HALCYON was ever built from.

Nothing about that night is what it looks like.

## How it plays

- Every choice moves three traits: **trust**, **courage** and **paradox**.
- Some choices stay locked until you have the right gear or have heard the right story.
- Four endings, depending on what you did and who you became along the way.
- Inspired by 80s sci-fi, the original space opera trilogies and cyberpunk. Every line is written fresh.
- The game remembers your last run. Get caught in a loop and the next night starts a little differently.

## Packages

| Package            | Folder            | What it holds                                                                   |
| ------------------ | ----------------- | ------------------------------------------------------------------------------- |
| `@loopback/engine` | `features/engine` | Locations, items, the `Traits` keeper, scenes and choices, the checkpoint guard |
| `@loopback/game`   | `apps/game`       | The `loopback` command, the story file and the game loop                        |

`@loopback/game` depends on `@loopback/engine` through `workspace:*`. Shared tool versions live in the catalog in `pnpm-workspace.yaml`.

Inside `apps/game/src`, each folder is a modlet that the rest of the game reaches only through its `index.ts`:

- `story` loads and checks the story file, and decides the ending
- `commands/play` runs the night, with a private `ask` that shows the choices
- `commands/memory` looks back at an ending

## Requirements

- Node.js 24
- pnpm 12 (downloaded for you through `devEngines` if missing)

## Play

```sh
pnpm install
pnpm start play
pnpm start play Aung
pnpm start play Aung --choices 1,2,1,2,1,1,1
pnpm start memory reboot
pnpm start memory scrap --spoilers
pnpm start --help
```

- `play` asks for your name if you leave it out, then lets you pick each choice with the arrow keys. Locked choices show what they need.
- `--choices` plays a fixed path without asking, which is also what the GitHub workflow uses.
- `memory` shows an ending you have reached. Endings you have not reached stay hidden unless you add `--spoilers`.
- Press Ctrl+C at any question to leave quietly.

## The story file

The whole story lives in `apps/game/src/story/loopback.json`: the `locations`, the `scenes` with their `choices`, and the four `endings`. Each choice has a `label`, the `next` scene (or `@ending`), its `effects` on the traits, and optionally a `flag`, an item to `use`, a `requires` lock and `secret`. Change a line or add a scene there, and the game picks it up the next time it starts. If the file is missing, is not valid JSON or has a piece in the wrong shape, the game says which one and stops.

## Lint

```sh
pnpm lint
```

Nx runs the type check, ESLint and Prettier in every package, with the engine first because the game depends on it.

## Module 1

The first version of each piece, one file per topic, is in the commit "Add core game types".
