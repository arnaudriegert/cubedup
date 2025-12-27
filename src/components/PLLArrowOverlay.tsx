import type {
  PLLSwapInfo, CornerPosition, EdgePosition,
} from '../types/algorithm'
import { GridSize } from './cube'

interface PLLArrowOverlayProps {
  swaps: PLLSwapInfo
  size?: GridSize
}

// Position coordinates as percentages of the face (not the entire grid)
// These represent center points of stickers on the 3x3 face
const POSITIONS: Record<CornerPosition | EdgePosition, {
  x: number
  y: number
}> = {
  // Corners (corner sticker centers)
  BL: {
    x: 17,
    y: 17,
  },
  BR: {
    x: 83,
    y: 17,
  },
  FL: {
    x: 17,
    y: 83,
  },
  FR: {
    x: 83,
    y: 83,
  },
  // Edges (edge sticker centers)
  B: {
    x: 50,
    y: 17,
  },
  L: {
    x: 17,
    y: 50,
  },
  R: {
    x: 83,
    y: 50,
  },
  F: {
    x: 50,
    y: 83,
  },
}

// Layout dimensions for positioning the overlay over the face
// Based on LastLayerGrid: side bar (w-8/h-8) + gap-1 + face + gap-1 + side bar
const LAYOUT: Record<GridSize, {
  sideWidth: number
  gap: number
  faceSize: number
}> = {
  normal: {
    sideWidth: 36,
    gap: 4,
    faceSize: 152,
  },   // w-8=32px + p-0.5=4px padding, gap-1=4px, face=3*48+4*2
  medium: {
    sideWidth: 24,
    gap: 4,
    faceSize: 100,
  },   // w-5=20px + 4px padding, gap-1=4px, face=3*32+4*2
  compact: {
    sideWidth: 12,
    gap: 4,
    faceSize: 52,
  },    // w-2=8px + 4px padding, gap-1=4px, face=3*16+4*2
}

// Colors for different cycle types (must contrast with yellow top face)
// Avoid cube colors: red, orange, blue, green, yellow, white
export const CORNER_COLOR = '#db2777' // pink-600 - corner pieces (BL, BR, FL, FR)
export const EDGE_COLOR = '#7c3aed'   // violet-600 - edge pieces (B, L, R, F)

function Arrow({
  from,
  to,
  color,
  bidirectional = false,
}: {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  color: string
  bidirectional?: boolean
}) {
  const markerId = `arrow-${from.x}-${from.y}-${to.x}-${to.y}`

  return (
    <g>
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
        {bidirectional && (
          <marker
            id={`${markerId}-start`}
            markerWidth="6"
            markerHeight="6"
            refX="1"
            refY="3"
            orient="auto"
          >
            <path d="M6,0 L0,3 L6,6 Z" fill={color} />
          </marker>
        )}
      </defs>
      <line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke={color}
        strokeWidth="2"
        markerEnd={`url(#${markerId})`}
        markerStart={bidirectional ? `url(#${markerId}-start)` : undefined}
        opacity="0.8"
      />
    </g>
  )
}

function CycleArrow({
  positions,
  color,
}: {
  positions: (CornerPosition | EdgePosition)[]
  color: string
}) {
  if (positions.length === 2) {
    // Simple swap - bidirectional arrow
    const [p1, p2] = positions
    return (
      <Arrow
        from={POSITIONS[p1]}
        to={POSITIONS[p2]}
        color={color}
        bidirectional
      />
    )
  }

  if (positions.length === 3) {
    // 3-cycle - draw straight arrows forming a triangle
    const [p1, p2, p3] = positions.map(p => POSITIONS[p])

    return (
      <g>
        <Arrow from={p1} to={p2} color={color} />
        <Arrow from={p2} to={p3} color={color} />
        <Arrow from={p3} to={p1} color={color} />
      </g>
    )
  }

  return null
}

/**
 * PLLArrowOverlay - SVG overlay showing swap/cycle arrows on PLL diagrams
 */
export default function PLLArrowOverlay({
  swaps, size = 'normal',
}: PLLArrowOverlayProps) {
  const layout = LAYOUT[size]
  const offset = layout.sideWidth + layout.gap
  const faceSize = layout.faceSize

  return (
    <svg
      className="absolute pointer-events-none"
      viewBox="0 0 100 100"
      style={{
        width: faceSize,
        height: faceSize,
        top: offset,
        left: offset,
      }}
    >
      {/* Draw corner cycles */}
      {swaps.corners?.map((cycle, i) => (
        <CycleArrow
          key={`corner-${i}`}
          positions={cycle.positions as CornerPosition[]}
          color={CORNER_COLOR}
        />
      ))}
      {/* Draw edge cycles */}
      {swaps.edges?.map((cycle, i) => (
        <CycleArrow
          key={`edge-${i}`}
          positions={cycle.positions as EdgePosition[]}
          color={EDGE_COLOR}
        />
      ))}
    </svg>
  )
}
