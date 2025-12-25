import React, {
  useState, useEffect, useMemo, useRef,
} from 'react'
import {
  CubeState, Move, FaceMove, WideMove, SliceMove, RotationAxis,
  CubeView, isFaceMove, isWideMove, isSliceMove,
} from '../../types/cubeState'
import { getMoveAnimation } from '../../utils/cubeState'
import {
  GridSize, FACE_SIZE_REM, STICKER_SIZE_REM,
  CUBE_VIEW_TRANSFORMS, CUBE_PERSPECTIVE_REM, TOP_FACE_BORDER_RADIUS,
} from './constants'
import { getStickerTransform } from './stickerUtils'
import { Color } from '../../types/cube'
import { colorToTailwind } from '../../utils/colors'

// All faces for cube rotations
const ALL_FACES: (keyof CubeState)[] = ['top', 'bottom', 'front', 'back', 'left', 'right']

// Gap/padding around each sticker (half of gap-0.5 = 0.0625rem on each side)
const STICKER_PADDING_REM = 0.0625

interface CubeProps {
  cubeState: CubeState
  // Animation props (all optional for static display)
  currentMove?: Move | null
  isAnimating?: boolean
  animationSpeed?: number
  onAnimationEnd?: () => void
  // Display props
  view?: CubeView
  size?: GridSize
  className?: string
}

// Which faces are visible for each view
const VISIBLE_FACES: Record<CubeView, (keyof CubeState)[]> = {
  'top-front-right': ['top', 'front', 'right'],
  'top-front-left': ['top', 'front', 'left'],
  'bottom-front-right': ['bottom', 'front', 'right'],
}

// Map face move to which cube state face it affects
const MOVE_TO_FACE: Record<FaceMove, keyof CubeState> = {
  R: 'right',
  L: 'left',
  U: 'top',
  D: 'bottom',
  F: 'front',
  B: 'back',
}

// Sticker identifier: face + index
interface StickerKey {
  face: keyof CubeState
  index: number
}

/**
 * Get all sticker keys that belong to a rotating layer (face move)
 */
function getRotatingStickers(faceMove: FaceMove): StickerKey[] {
  const mainFace = MOVE_TO_FACE[faceMove]
  const stickers: StickerKey[] = []

  // All 9 stickers of the main face
  for (let i = 0; i < 9; i++) {
    stickers.push({ face: mainFace, index: i })
  }

  // Edge stickers from adjacent faces
  const adjacentIndices: Record<FaceMove, { face: keyof CubeState; indices: number[] }[]> = {
    R: [
      { face: 'front', indices: [2, 5, 8] },
      { face: 'top', indices: [2, 5, 8] },
      { face: 'back', indices: [6, 3, 0] },
      { face: 'bottom', indices: [2, 5, 8] },
    ],
    L: [
      { face: 'front', indices: [0, 3, 6] },
      { face: 'top', indices: [0, 3, 6] },
      { face: 'back', indices: [8, 5, 2] },
      { face: 'bottom', indices: [0, 3, 6] },
    ],
    U: [
      { face: 'front', indices: [0, 1, 2] },
      { face: 'right', indices: [0, 1, 2] },
      { face: 'back', indices: [0, 1, 2] },
      { face: 'left', indices: [0, 1, 2] },
    ],
    D: [
      { face: 'front', indices: [6, 7, 8] },
      { face: 'right', indices: [6, 7, 8] },
      { face: 'back', indices: [6, 7, 8] },
      { face: 'left', indices: [6, 7, 8] },
    ],
    F: [
      { face: 'top', indices: [6, 7, 8] },
      { face: 'right', indices: [0, 3, 6] },
      { face: 'bottom', indices: [2, 1, 0] },
      { face: 'left', indices: [8, 5, 2] },
    ],
    B: [
      { face: 'top', indices: [0, 1, 2] },
      { face: 'right', indices: [2, 5, 8] },
      { face: 'bottom', indices: [8, 7, 6] },
      { face: 'left', indices: [6, 3, 0] },
    ],
  }

  for (const { face, indices } of adjacentIndices[faceMove]) {
    for (const index of indices) {
      stickers.push({ face, index })
    }
  }

  return stickers
}

/**
 * Get all sticker keys that belong to a rotating slice (M, S, E)
 */
function getSliceRotatingStickers(sliceMove: SliceMove): StickerKey[] {
  const stickers: StickerKey[] = []

  // Slice moves only affect middle layer stickers (no face rotation)
  const sliceIndices: Record<SliceMove, { face: keyof CubeState; indices: number[] }[]> = {
    // M: middle column (indices 1, 4, 7) on front, top, back, bottom
    M: [
      { face: 'front', indices: [1, 4, 7] },
      { face: 'top', indices: [1, 4, 7] },
      { face: 'back', indices: [7, 4, 1] },
      { face: 'bottom', indices: [1, 4, 7] },
    ],
    // S: middle slice parallel to front (indices 3, 4, 5 on top/bottom, 1, 4, 7 on left/right)
    S: [
      { face: 'top', indices: [3, 4, 5] },
      { face: 'right', indices: [1, 4, 7] },
      { face: 'bottom', indices: [5, 4, 3] },
      { face: 'left', indices: [7, 4, 1] },
    ],
    // E: middle row (indices 3, 4, 5) on front, right, back, left
    E: [
      { face: 'front', indices: [3, 4, 5] },
      { face: 'right', indices: [3, 4, 5] },
      { face: 'back', indices: [3, 4, 5] },
      { face: 'left', indices: [3, 4, 5] },
    ],
  }

  for (const { face, indices } of sliceIndices[sliceMove]) {
    for (const index of indices) {
      stickers.push({ face, index })
    }
  }

  return stickers
}

/**
 * Get all sticker keys that belong to a wide move (face + slice combined)
 * Wide moves rotate two layers: the face and the adjacent middle slice
 */
function getWideRotatingStickers(wideMove: WideMove): StickerKey[] {
  // Map wide moves to face + slice combinations
  const wideMoveMap: Record<WideMove, { face: FaceMove; slice: SliceMove }> = {
    r: { face: 'R', slice: 'M' },
    l: { face: 'L', slice: 'M' },
    u: { face: 'U', slice: 'E' },
    d: { face: 'D', slice: 'E' },
    f: { face: 'F', slice: 'S' },
    b: { face: 'B', slice: 'S' },
  }

  const { face, slice } = wideMoveMap[wideMove]

  // Combine face stickers and slice stickers
  const faceStickers = getRotatingStickers(face)
  const sliceStickers = getSliceRotatingStickers(slice)

  // Merge and deduplicate (though there shouldn't be overlap)
  const allStickers = [...faceStickers]
  for (const sticker of sliceStickers) {
    if (!allStickers.some(s => s.face === sticker.face && s.index === sticker.index)) {
      allStickers.push(sticker)
    }
  }

  return allStickers
}

/**
 * Check if a sticker is in the rotating layer
 */
function isInRotatingLayer(
  face: keyof CubeState,
  index: number,
  rotatingStickers: StickerKey[],
): boolean {
  return rotatingStickers.some((s) => s.face === face && s.index === index)
}

/**
 * Cube renders a 3D cube with individual stickers.
 * Supports optional animation - pass currentMove/isAnimating/onAnimationEnd for animated mode.
 * For static display, just pass cubeState.
 */
export default function Cube({
  cubeState,
  currentMove = null,
  isAnimating = false,
  animationSpeed = 200,
  onAnimationEnd,
  view = 'top-front-right',
  size = 'normal',
  className = '',
}: CubeProps) {
  const faceSize = FACE_SIZE_REM[size]
  const stickerSize = STICKER_SIZE_REM[size]

  // Animation state - two-phase approach to prevent flashing:
  // Phase 1: Reset rotation to 0 with transition disabled (instant)
  // Phase 2: Enable transition, then animate to target
  const [rotation, setRotation] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const hasCalledEndRef = useRef(false)
  const animationIdRef = useRef(0) // Track animation sequence to handle cleanup

  // Get animation info
  const animationInfo = useMemo(() => {
    if (!currentMove || !isAnimating) return null

    const animation = getMoveAnimation(currentMove)
    const visibleFaces = VISIBLE_FACES[view]

    // For cube rotations (x, y, z), all stickers rotate
    if (animation.isFullCube) {
      // Get ALL stickers from ALL faces for full cube rotation
      const allStickers: StickerKey[] = []
      for (const face of ALL_FACES) {
        for (let i = 0; i < 9; i++) {
          allStickers.push({ face, index: i })
        }
      }
      return {
        animation,
        rotatingStickers: allStickers,
        isFullCube: true,
        hasVisibleRotation: true, // Full cube rotation is always visible
      }
    }

    // Get rotating stickers based on move type
    let rotatingStickers: StickerKey[]
    if (isFaceMove(currentMove.base)) {
      rotatingStickers = getRotatingStickers(currentMove.base)
    } else if (isWideMove(currentMove.base)) {
      rotatingStickers = getWideRotatingStickers(currentMove.base)
    } else if (isSliceMove(currentMove.base)) {
      rotatingStickers = getSliceRotatingStickers(currentMove.base)
    } else {
      rotatingStickers = []
    }

    // Check if any rotating stickers are visible
    const hasVisibleRotation = rotatingStickers.some((s) => visibleFaces.includes(s.face))

    return {
      animation,
      rotatingStickers,
      isFullCube: false,
      hasVisibleRotation,
    }
  }, [currentMove, isAnimating, view])

  // Trigger animation with two-phase approach to prevent flashing
  useEffect(() => {
    if (animationInfo?.hasVisibleRotation) {
      hasCalledEndRef.current = false
      const currentAnimationId = ++animationIdRef.current

      // Phase 1: Reset rotation to 0 with transition disabled (instant reset)
      setRotation(0)
      setTransitionEnabled(false)

      // Phase 2: After browser paints the reset, enable transition
      const raf1 = requestAnimationFrame(() => {
        if (animationIdRef.current !== currentAnimationId) return
        setTransitionEnabled(true)

        // Phase 3: After browser applies transition property, animate to target
        const raf2 = requestAnimationFrame(() => {
          if (animationIdRef.current !== currentAnimationId) return
          setRotation(animationInfo.animation.degrees)
        })
        // Store raf2 for potential cleanup (not strictly needed since we check animationId)
        return () => cancelAnimationFrame(raf2)
      })

      return () => cancelAnimationFrame(raf1)
    }
  }, [animationInfo])

  // Handle non-visible rotations (complete immediately)
  useEffect(() => {
    if (animationInfo && !animationInfo.hasVisibleRotation && !hasCalledEndRef.current) {
      hasCalledEndRef.current = true
      const timer = setTimeout(() => onAnimationEnd?.(), 10)
      return () => clearTimeout(timer)
    }
    if (!animationInfo) {
      hasCalledEndRef.current = false
    }
  }, [animationInfo, onAnimationEnd])

  const handleTransitionEnd = () => {
    if (!hasCalledEndRef.current) {
      hasCalledEndRef.current = true
      onAnimationEnd?.()
    }
  }

  // Get cube transform based on view
  const getCubeTransform = (): string => {
    return CUBE_VIEW_TRANSFORMS[view] ?? CUBE_VIEW_TRANSFORMS['top-front-right']
  }

  // Get rotation axis CSS property
  const getRotationTransform = (axis: RotationAxis, degrees: number): string => {
    return `rotate${axis.toUpperCase()}(${degrees}deg)`
  }

  const visibleFaces = VISIBLE_FACES[view]

  // Render a single sticker with its black background
  // Each sticker is a black container with the colored sticker inside
  const renderSticker = (face: keyof CubeState, index: number, color: Color) => {
    const bgColor = colorToTailwind[color] || colorToTailwind[Color.GRAY]
    const transform = getStickerTransform(face, index, size)
    const borderRadius = TOP_FACE_BORDER_RADIUS[index]

    // Container size includes the padding for the black border
    const containerSize = stickerSize + STICKER_PADDING_REM * 2

    return (
      <div
        key={`${face}-${index}`}
        className="absolute bg-gray-800"
        style={{
          width: `${containerSize}rem`,
          height: `${containerSize}rem`,
          marginLeft: `${-containerSize / 2}rem`,
          marginTop: `${-containerSize / 2}rem`,
          left: '50%',
          top: '50%',
          padding: `${STICKER_PADDING_REM}rem`,
          transform,
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className={`w-full h-full ${bgColor} ${borderRadius}`}
        />
      </div>
    )
  }

  // Collect stickers for rendering
  const staticStickers: React.ReactElement[] = []
  const rotatingStickers: React.ReactElement[] = []

  // Static stickers: only from visible faces, excluding rotating ones
  for (const face of visibleFaces) {
    for (let index = 0; index < 9; index++) {
      if (animationInfo && isInRotatingLayer(face, index, animationInfo.rotatingStickers)) {
        // This sticker is rotating, will be added below
        continue
      }
      const color = cubeState[face][index]
      staticStickers.push(renderSticker(face, index, color))
    }
  }

  // Rotating stickers: from ALL faces in the rotating layer (they become visible during rotation)
  if (animationInfo) {
    for (const { face, index } of animationInfo.rotatingStickers) {
      const color = cubeState[face][index]
      rotatingStickers.push(renderSticker(face, index, color))
    }
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${faceSize * 1.8}rem`,
        height: `${faceSize * 1.8}rem`,
        perspective: `${CUBE_PERSPECTIVE_REM}rem`,
      }}
    >
      <div
        className="absolute inset-0 transform-3d"
        style={{ transform: getCubeTransform() }}
      >
        {/* Static stickers (not rotating) */}
        {staticStickers}

        {/* Rotating layer with animation */}
        {animationInfo?.hasVisibleRotation && (
          <div
            className="absolute inset-0 transform-3d"
            style={{
              transform: getRotationTransform(animationInfo.animation.axis, rotation),
              transition: transitionEnabled ? `transform ${animationSpeed}ms ease-out` : 'none',
              transformOrigin: 'center center',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {rotatingStickers}
          </div>
        )}
      </div>
    </div>
  )
}
