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
| `@loopback/game`   | `apps/game`       | The world, the story, the endings and the game loop                             |

`@loopback/game` depends on `@loopback/engine` through `workspace:*`. Shared tool versions live in the catalog in `pnpm-workspace.yaml`.

## Requirements

- Node.js 24
- pnpm 12 (downloaded for you through `devEngines` if missing)

## Play

```sh
pnpm install
pnpm start
```

Type the number of a choice and press Enter. Options:

```sh
pnpm start --name Aung
pnpm start --choices 1,1,2,1,1,2
```

`--choices` plays a fixed path without asking, which is also what the GitHub workflow uses.

## Lint

```sh
pnpm lint
```

Nx runs the type check, ESLint and Prettier in every package, with the engine first because the game depends on it.

## Module 1

The first version of each piece, one file per topic, is in the commit "Add core game types".
