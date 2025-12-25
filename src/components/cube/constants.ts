// Grid size variants
export type GridSize = 'normal' | 'medium' | 'compact'
const GRID_SIZES: GridSize[] = ['normal', 'medium', 'compact']

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
