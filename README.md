# LOOPBACK

A retro-future text adventure about a repair tech, a city AI and a night that keeps happening.

Neo-Barcelona, 2087. Kai Ren fixes dead tech in a pawn shop full of CRT screens. Tonight one of them shows a word he never typed: HALCYON, the AI that runs the city grid. Then a stranger from 2119 kicks the door in and says the city's memory will be wiped before sunrise, unless Kai goes back to 1987 and deletes the first line of code HALCYON was ever built from.

Every choice moves three traits: trust, courage and paradox. They decide which doors open later, who Kai becomes, and which ending he gets.

Personal project for M3 Advanced JavaScript and TypeScript.

## Module 1

Each file runs on its own with Node.

| File                | What it shows                                                                | Run                  |
| ------------------- | ---------------------------------------------------------------------------- | -------------------- |
| `src/location.ts`   | A `Location` interface with text, numbers, a boolean and arrays              | `npm run location`   |
| `src/items.ts`      | Four kinds of item in a union and one function that handles every kind       | `npm run items`      |
| `src/traits.ts`     | A `Traits` class that keeps trust, courage and paradox privately in a Record | `npm run traits`     |
| `src/checkpoint.ts` | A guard that checks a saved checkpoint before the game trusts it             | `npm run checkpoint` |

## Setup

Needs Node.js 22.18 or newer.

```sh
npm install
npm run lint
```
