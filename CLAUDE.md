# CLAUDE.md

## Project Overview

**CubedUp** - React web app for learning Rubik's cube CFOP method (Cross, F2L, OLL, PLL). Visual pattern recognition and algorithm practice with interactive 3D cube displays.

**Stack:** React 19, TypeScript, Vite, TailwindCSS 4, React Router 7, GitHub Pages

## Design Philosophy

The app teaches algorithms by revealing their structure, not just memorizing move sequences.

- **Triggers as building blocks**: Algorithms decompose into reusable triggers (`{sexy}`, `{sledge}`, `{chair}`). Show learners how complex algorithms are just combinations of patterns they already know.
- **Left/right symmetry**: Triggers come in mirror pairs. Learn one side, understand both. The UI reflects this pairing.
- **Inverse relationships**: Many cases are inverses of each other (OLL 24↔25, chair↔sune). Highlight these connections—learning one means you've nearly learned the other.
- **Cancellations**: When triggers combine, moves cancel. Show this visually (`~U' U~`) to help learners understand why certain combinations are efficient.
- **Learning path**: Built on two-step OLL (edges first, then corners) and two-step PLL (corners first, then edges). This reduces the initial case count and leverages shared triggers.

These principles should guide all feature decisions. Ask: does this help the learner see the underlying structure?

## Code Quality

- **No tech debt**: refactor as you go, don't accumulate shortcuts
- **No suppression comments**: no `eslint-disable`, `@ts-expect-error`, `@ts-ignore`
- **No unused code**: delete it, don't comment it out
- **Follow IDE diagnostics**: address Tailwind, React, TypeScript recommendations
- **Test in browser**: use MCP chrome-devtools to verify changes visually
- **Linting runs automatically** via Claude hook after file edits
- **CSS organization**: shared classes in `styles/` using `@apply`; component-specific CSS next to component (use `@reference "tailwindcss"` at top). Tailwind v4 `@apply` only works with Tailwind utilities—can't compose custom classes. Keep classes generic; apply layout-specific properties locally.
- Prefer editing existing files over creating new ones
- **Keep this file up to date**: see [Maintaining This File](#maintaining-this-file) at the end

## Commands

```bash
yarn dev       # Development server
yarn build     # Production build
yarn lint      # ESLint check
yarn lint:fix  # ESLint auto-fix
```

The user will run the development server themself — ask them to do it if you're testing your code in the browser MCP and you see it's not running.
The development server makes the app available under http://localhost:5173/cubedup/ (don't forget the /cubedup/).

## Architecture

```
src/
├── components/algorithm/   # AlgorithmDisplay, Breadcrumb
├── components/cube/        # Cube, CubeDisplay, Face, Sticker, FaceButton
├── data/                   # algorithms (static Map), cases (metadata)
├── pages/                  # OLL, PLL, Triggers, Playground, F2L, Cross
├── types/                  # algorithm, cube, cubeState
├── utils/                  # algorithmExpander, patternDerivation, cancellation
└── styles/                 # design system (@apply)
```

| Area | Primary Files |
|------|---------------|
| Algorithm data | `data/algorithms.ts` (static Map), `data/cases.ts` (metadata) |
| Pattern derivation | `utils/patternDerivation.ts`, `utils/derivedPatterns.ts` (from algorithms) |
| Algorithm display | `components/algorithm/AlgorithmDisplay.tsx` |
| Algorithm expansion | `utils/algorithmExpander.ts`, `utils/cancellation.ts` |
| Algorithm parsing | `utils/algorithmTokenizer.ts`, `utils/moveParser.ts` |
| Cube rendering | `components/cube/Cube.tsx`, `components/cube/Face.tsx` |
| Cube state | `utils/cubeState.ts`, `types/cubeState.ts` |

## Domain

### Algorithms

**ID Format:** `{category}-{caseKey}-{variantIndex}` — e.g., `oll-21-1`, `pll-ua-2`, `sexy`

**Structure (static Map):**
```typescript
// data/algorithms.ts - single static Map
algorithms.get('sexy')      // Direct access by ID
algorithms.get('oll-21-1')  // OLL case variant

interface Algorithm {
  id: AlgorithmId             // Required
  steps: AlgorithmStep[]      // Source of truth
  inverse?: AlgorithmId       // Inverse reference
  mirror?: AlgorithmId        // Left/right mirror
  tags?: string[]             // ['trigger', 'oll', 'solved-cross']
}

// Steps can be raw moves OR references to other algorithms
type AlgorithmStep =
  | { moves: string }                    // "R U R' U'"
  | { ref: AlgorithmId; repeat?: number } // { ref: 'sexy', repeat: 2 }
```

**Algorithm Expansion:**
```typescript
// Recursively resolves refs and computes cancellations at runtime
const expanded = expandAlgorithmObject(algo)
expanded.moves          // Final move sequence
expanded.movesWithMeta  // Moves with cancellation flags
```

**Tokenizer:** Converts to `AlgorithmToken[]` with types: `move`, `rotation`, `trigger`, `groupStart`, `groupEnd`, `space`

### Cube

**Standard orientation:** Yellow top, blue front

**Moves:** Face (R L U D F B), Wide (r l u d f b), Slice (M S E), Rotations (x y z)

**Face indexing:** `0 1 2 / 3 4 5 / 6 7 8` (looking at face)

## Playground

Interactive 3D cube to visualize algorithms in motion. Animates moves step-by-step with synchronized algorithm display highlighting. Used for demos from case pages and direct algorithm testing.

**URL parameters:**
- `?algo=oll-21-1` — Load by ID; pre-runs inverse to show problem state
- `?notation=R U R' U'` — Raw moves; starts solved (for trigger muscle memory)

## Patterns

**Algorithm Lookups:**
```typescript
// data/algorithms.ts
getAlgorithm('oll-21-1')           // Get algorithm by ID
getTriggers()                       // All trigger algorithms

// data/cases.ts
getCase('oll-21')                  // Case metadata
getAlgorithmsForCase('oll-21')     // All algorithm variants for a case
ollGroups, pllGroups               // Case groupings
```

**Type guards** (`types/cubeState.ts`):
```typescript
isFaceMove(base)     // R, L, U, D, F, B
isWideMove(base)     // r, l, u, d, f, b
isSliceMove(base)    // M, S, E
isCubeRotation(base) // x, y, z
```

**Token styling:** Moves (`text-slate-700`), Rotations (`text-purple-600`), Triggers (`text-indigo-600`), Cancelled (`line-through`)

---

## Maintaining This File

When you discover a reusable pattern or convention, update this file.

- **General to specific**: the file flows from high-level (overview, philosophy) to concrete (architecture, patterns). Place new content where it fits this progression.
- **Principles over examples**: document the rule, not the instance. Avoid specific file names or one-off fixes.
- **Concise and consistent**: match the tone and formatting of surrounding content. Edit existing entries rather than adding duplicates.
- **Keep it current**: remove outdated information. This file should reflect how the codebase works now.
