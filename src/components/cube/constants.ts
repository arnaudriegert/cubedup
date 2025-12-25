import type { CubeView } from '../../types/cubeState'

// Grid size variants
export type GridSize = 'normal' | 'medium' | 'compact'
const GRID_SIZES: GridSize[] = ['normal', 'medium', 'compact']

// Cube view transforms (shared by AnimatedCube and IsometricCube)
export const CUBE_VIEW_TRANSFORMS: Record<CubeView, string> = {
  'top-front-right': 'rotateX(-20deg) rotateY(-20deg)',
  'top-front-left': 'rotateX(-20deg) rotateY(20deg)',
  'bottom-front-right': 'rotateX(20deg) rotateY(-30deg)',
}

// Perspective for 3D cube rendering (in rem)
export const CUBE_PERSPECTIVE_REM = 37.5

// Border radius classes for top face stickers (positions 0-8)
// Used by AnimatedCube and Sticker components
export const TOP_FACE_BORDER_RADIUS: Record<number, string> = {
  0: 'rounded-sm',     // top-left corner
  1: 'rounded-b-xl',   // top-middle (rounded on inner/bottom side)
  2: 'rounded-sm',     // top-right corner
  3: 'rounded-r-xl',   // middle-left (rounded on inner/right side)
  4: 'rounded-2xl',    // center
  5: 'rounded-l-xl',   // middle-right (rounded on inner/left side)
  6: 'rounded-sm',     // bottom-left corner
  7: 'rounded-t-xl',   // bottom-middle (rounded on inner/top side)
  8: 'rounded-sm',     // bottom-right corner
}

// Border radius for side sticker middle positions
export const SIDE_MIDDLE_BORDER_RADIUS: Record<string, string> = {
  back: 'rounded-t-xl',
  front: 'rounded-b-xl',
  left: 'rounded-l-xl',
  right: 'rounded-r-xl',
}

// Tailwind classes - explicit strings so Tailwind can detect them at build time
export const STICKER_CLASSES: Record<GridSize, string> = {
  normal: 'size-12',  // 3rem
  medium: 'size-8',   // 2rem
  compact: 'size-4',  // 1rem
}

export const SIDE_HORIZONTAL_CLASSES: Record<GridSize, string> = {
  normal: 'w-12 h-8',
  medium: 'w-8 h-5',
  compact: 'w-4 h-2',
}

export const SIDE_VERTICAL_CLASSES: Record<GridSize, string> = {
  normal: 'w-8 h-12',
  medium: 'w-5 h-8',
  compact: 'w-2 h-4',
}

export const GRID_SPACING_CLASS = 'gap-0.5 p-0.5'

// Derive face size from sticker and spacing classes
const parseTwSize = (cls: string) => parseInt(cls.match(/size-(\d+)/)?.[1] ?? '0') * 0.25
const parseTwSpacing = (cls: string) => parseFloat(cls.match(/gap-([\d.]+)/)?.[1] ?? '0') * 0.25

// Sticker size in rem
export const STICKER_SIZE_REM = Object.fromEntries(
  GRID_SIZES.map(size => [size, parseTwSize(STICKER_CLASSES[size])]),
) as Record<GridSize, number>

// Face = 3 stickers + 2 gaps + 2 paddings
export const FACE_SIZE_REM = Object.fromEntries(
  GRID_SIZES.map(size => [
    size,
    3 * parseTwSize(STICKER_CLASSES[size]) + 4 * parseTwSpacing(GRID_SPACING_CLASS),
  ]),
) as Record<GridSize, number>
