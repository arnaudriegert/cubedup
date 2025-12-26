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
- **Design system**: use Tailwind's `@apply` in `styles/` for reusable classes; check there before adding inline Tailwind
- Prefer editing existing files over creating new ones
- **Keep this file up to date**: when you learn something, discover a pattern, or establish a convention—update this file

## Commands

```bash
yarn dev       # Development server
yarn build     # Production build
yarn lint      # ESLint check
yarn lint:fix  # ESLint auto-fix
```

## Architecture

```
src/
├── components/algorithm/   # AlgorithmDisplay, Breadcrumb, VariantSelector
├── components/cube/        # Cube, CubeDisplay, Face, Sticker
├── data/                   # ollCases, pllCases, triggers, algorithmRegistry
├── pages/                  # OLL, PLL, Triggers, Playground, F2L, Cross
├── types/                  # algorithm, cube, cubeState
├── utils/                  # algorithmTokenizer, moveParser, cubeState
└── styles/                 # design system (@apply)
```

| Area | Primary Files |
|------|---------------|
| Case data | `data/ollCases.ts`, `data/pllCases.ts`, `data/triggers.ts` |
| Algorithm display | `components/algorithm/AlgorithmDisplay.tsx` |
| Algorithm parsing | `utils/algorithmTokenizer.ts`, `utils/moveParser.ts` |
| Cube rendering | `components/cube/Cube.tsx`, `components/cube/Face.tsx` |
| Cube state | `utils/cubeState.ts`, `types/cubeState.ts` |

## Domain

### Algorithms

**ID Format:** `{category}-{caseKey}-{variantIndex}` — e.g., `oll-21-1`, `pll-ua-2`, `trigger-sexy`

**Structure:**
```typescript
interface Algorithm {
  decomposition: AlgorithmStep[]  // Source of truth
  simplifiedResult?: string       // With cancellation markup (~cancelled~)
}
interface AlgorithmStep {
  moves: string        // "R U R' U'"
  trigger?: string     // "{sexy}"
}
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

**Registry:**
```typescript
algorithmRegistry.get('oll-21-1')
algorithmRegistry.expandTrigger('{sexy}')
algorithmRegistry.getOLLCase(21)
```

**Type guards** (`types/cubeState.ts`):
```typescript
isFaceMove(base)     // R, L, U, D, F, B
isWideMove(base)     // r, l, u, d, f, b
isSliceMove(base)    // M, S, E
isCubeRotation(base) // x, y, z
```

**Token styling:** Moves (`text-slate-700`), Rotations (`text-purple-600`), Triggers (`text-indigo-600`), Cancelled (`line-through`)
