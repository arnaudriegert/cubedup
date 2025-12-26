/**
 * AlgorithmDisplay - Unified algorithm display component
 *
 * Replaces both AlgorithmBox (case pages) and Playground inline tokens.
 * Supports:
 * - Static mode: for case cards with hover-to-expand triggers
 * - Playback mode: for Playground with current move highlighting
 * - Decomposition features everywhere (trigger expansion, step boundaries, cancellations)
 */

import { useState, useMemo } from 'react'
import type { Algorithm } from '../../types/algorithm'
import {
  tokenizeAlgorithm,
  tokenizeNotation,
  buildShorthandFromSteps,
  buildFullFromSteps,
  type AlgorithmToken,
} from '../../utils/algorithmTokenizer'
import { parseMoves, moveToNotation } from '../../utils/moveParser'
import type { Move } from '../../types/cubeState'
import PinBadge from '../PinBadge'

export type DisplayMode = 'static' | 'playback'
export type TriggerExpansion = 'hover' | 'always' | 'never'
export type DisplaySize = 'sm' | 'md' | 'lg'

export interface AlgorithmDisplayProps {
  // Data source (one of these)
  algorithm?: Algorithm
  notation?: string

  // Display mode
  mode?: DisplayMode

  // Playback props (for mode='playback')
  currentMoveIndex?: number
  totalMoves?: number
  playingLabel?: string

  // Decomposition features
  expandTriggers?: TriggerExpansion
  showCancellations?: boolean
  pinnable?: boolean

  // Styling
  size?: DisplaySize
  showProgress?: boolean
  className?: string

  // Use parent's hover group for expansion (e.g., 'algocard')
  // When set, expansion happens when parent group is hovered
  parentHoverGroup?: string
}

// Size-based styling
const SIZE_STYLES: Record<DisplaySize, { token: string; text: string }> = {
  sm: { token: 'px-1.5 py-0.5 text-xs', text: 'text-xs' },
  md: { token: 'px-2 py-1 text-sm', text: 'text-sm' },
  lg: { token: 'px-3 py-1.5 text-base', text: 'text-base' },
}

// Token state styling
const TOKEN_STATES = {
  default: 'text-slate-700 bg-white shadow-sm',
  current: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md scale-110',
  completed: 'text-slate-400 bg-white/50',
  cancelled: 'line-through opacity-40 bg-slate-100 decoration-slate-500 decoration-2',
  highlighted: 'font-bold text-indigo-700',
  // Trigger tokens get a distinct pill style
  trigger: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
}

// Alternating colors for consecutive same-category steps
const PARITY_COLORS = {
  // For moves that came from a trigger expansion (indigo tints - subtle variation)
  trigger: {
    even: 'bg-indigo-100 text-indigo-800',
    odd: 'bg-indigo-50 text-indigo-700',
  },
  // For regular non-trigger moves (more visible contrast)
  moves: {
    even: 'bg-slate-200 text-slate-700',
    odd: 'bg-slate-50 text-slate-600',
  },
}

interface TokenProps {
  token: AlgorithmToken
  state: 'default' | 'current' | 'completed'
  size: DisplaySize
}

function Token({ token, state, size }: TokenProps) {
  const sizeStyle = SIZE_STYLES[size]

  // Skip space tokens - flex gap handles spacing
  if (token.type === 'space') {
    return null
  }

  // Handle trigger tokens (shown as distinct pill badge)
  if (token.type === 'trigger') {
    // Apply parity-based alternation for consecutive triggers
    // Using subtle indigo variation (same hue, different shade) - darker first
    const parity = token.stepParity || 'even'
    let baseStyle = parity === 'even'
      ? 'bg-indigo-200 text-indigo-800 border border-indigo-400'
      : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
    if (token.isCancelled) baseStyle = TOKEN_STATES.cancelled
    if (token.isHighlighted) baseStyle = `${baseStyle} ${TOKEN_STATES.highlighted}`

    return (
      <span
        className={`${sizeStyle.token} rounded-full italic transition-all duration-200 ${baseStyle}`}
        title={token.rawMoves ? `${token.rawMoves}` : undefined}
      >
        {token.value}
      </span>
    )
  }

  // Handle rotation tokens (cube rotations x/y/z) - distinct purple styling
  if (token.type === 'rotation') {
    // Rotation-specific styling (purple) - only override for special states
    let stateStyle = ''
    if (state === 'current') stateStyle = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md scale-110'
    if (state === 'completed') stateStyle = 'text-purple-300 bg-purple-50/50'
    if (token.isCancelled) stateStyle = TOKEN_STATES.cancelled
    if (token.isHighlighted) stateStyle = 'font-bold text-purple-800'

    return (
      <span
        className={`${sizeStyle.token} rounded-md font-mono transition-all duration-200 ${stateStyle || 'text-purple-600 bg-purple-50 shadow-sm'}`}
      >
        {token.value}
      </span>
    )
  }

  // Regular move tokens - apply parity-based color alternation
  const parity = token.stepParity || 'even'
  const parityCategory = token.isFromTrigger ? 'trigger' : 'moves'
  const parityStyle = PARITY_COLORS[parityCategory][parity]

  let baseStyle = state === 'default' ? parityStyle : TOKEN_STATES[state]
  if (token.isCancelled) baseStyle = `${parityStyle} ${TOKEN_STATES.cancelled}`
  if (token.isHighlighted) baseStyle = `${parityStyle} ${TOKEN_STATES.highlighted}`

  return (
    <span
      className={`${sizeStyle.token} rounded-md shadow-sm transition-all duration-200 ${baseStyle}`}
    >
      {token.value}
    </span>
  )
}

/**
 * Render tokens - groups tokens by stepIndex to prevent line breaks within a step
 */
function TokenList({ tokens, state, size }: { tokens: AlgorithmToken[]; state: 'default' | 'current' | 'completed'; size: DisplaySize }) {
  // Group tokens by stepIndex to prevent line breaks within a step
  const groups: Array<{ stepIndex: number | undefined; tokens: AlgorithmToken[] }> = []
  let currentGroup: { stepIndex: number | undefined; tokens: AlgorithmToken[] } | null = null

  for (const token of tokens) {
    // Skip groupStart/groupEnd tokens
    if (token.type === 'groupStart' || token.type === 'groupEnd' || token.type === 'space') {
      continue
    }

    if (currentGroup === null || currentGroup.stepIndex !== token.stepIndex) {
      currentGroup = { stepIndex: token.stepIndex, tokens: [] }
      groups.push(currentGroup)
    }
    currentGroup.tokens.push(token)
  }

  return (
    <>
      {groups.map((group, groupIdx) => (
        <span key={groupIdx} className="inline-flex flex-wrap items-center gap-1">
          {group.tokens.map((token, tokenIdx) => (
            <Token key={tokenIdx} token={token} state={state} size={size} />
          ))}
        </span>
      ))}
    </>
  )
}

/**
 * Static mode display with hover-to-expand functionality
 */
function StaticDisplay({
  tokens,
  shorthandTokens,
  hasShorthand,
  pinnable,
  size,
  className,
  useParentHover,
}: {
  tokens: AlgorithmToken[]
  shorthandTokens: AlgorithmToken[]
  hasShorthand: boolean
  pinnable: boolean
  size: DisplaySize
  className: string
  useParentHover: boolean
}) {
  const [isPinned, setIsPinned] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasShorthand && pinnable) {
      setIsPinned(prev => !prev)
    }
  }

  // No toggle needed if there's no shorthand
  if (!hasShorthand) {
    return (
      <div className={`flex flex-wrap gap-1.5 items-center font-mono justify-center ${className}`}>
        <TokenList tokens={tokens} state="default" size={size} />
      </div>
    )
  }

  // Determine hover classes based on whether we use parent's hover group
  // When useParentHover=true, we expect parent to have group/algocard
  const shorthandHoverClass = useParentHover
    ? 'group-hover/algocard:hidden'
    : 'group-hover/algo:hidden'
  const fullHoverClass = useParentHover
    ? 'group-hover/algocard:flex'
    : 'group-hover/algo:flex'

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer ${useParentHover ? '' : 'group/algo'} ${className}`}
    >
      {isPinned && pinnable && <PinBadge className="absolute -top-2 -right-2 z-10" />}

      {/* Shorthand view: shown by default, hidden on hover or when pinned */}
      <div className={`flex flex-wrap gap-1.5 items-center font-mono justify-center ${isPinned ? 'hidden' : shorthandHoverClass}`}>
        <TokenList tokens={shorthandTokens} state="default" size={size} />
      </div>

      {/* Full view: hidden by default, shown on hover or when pinned */}
      <div className={`flex flex-wrap gap-1.5 items-center font-mono justify-center ${isPinned ? '' : `hidden ${fullHoverClass}`}`}>
        <TokenList tokens={tokens} state="default" size={size} />
      </div>
    </div>
  )
}

/**
 * Playback mode display with current move highlighting
 */
function PlaybackDisplay({
  moves,
  currentMoveIndex,
  totalMoves,
  playingLabel,
  showProgress,
  size,
  className,
}: {
  moves: Move[]
  currentMoveIndex: number
  totalMoves: number
  playingLabel?: string
  showProgress: boolean
  size: DisplaySize
  className: string
}) {
  const isPlaying = currentMoveIndex >= 0

  return (
    <div className={`flex flex-wrap gap-1.5 font-mono items-center ${className}`}>
      {moves.map((move, index) => {
        const isCurrentMove = isPlaying && index === currentMoveIndex
        const isCompleted = isPlaying && index < currentMoveIndex
        const state = isCurrentMove ? 'current' : isCompleted ? 'completed' : 'default'

        return (
          <span
            key={index}
            className={`${SIZE_STYLES[size].token} rounded-md transition-all duration-200 ${TOKEN_STATES[state]}`}
          >
            {moveToNotation(move)}
          </span>
        )
      })}

      {showProgress && isPlaying && (
        <span className="ml-2 text-slate-500 text-xs font-medium">
          {playingLabel && <span className="text-indigo-600">{playingLabel} · </span>}
          <span className="font-mono">
            {currentMoveIndex >= 0 ? currentMoveIndex + 1 : totalMoves}/{totalMoves}
          </span>
        </span>
      )}
    </div>
  )
}

/**
 * Main AlgorithmDisplay component
 */
export default function AlgorithmDisplay({
  algorithm,
  notation,
  mode = 'static',
  currentMoveIndex = -1,
  totalMoves,
  playingLabel,
  expandTriggers = 'hover',
  showCancellations = true,
  pinnable = false,
  size = 'md',
  showProgress = false,
  className = '',
  parentHoverGroup,
}: AlgorithmDisplayProps) {
  // Parse tokens based on input type
  const { tokens, shorthandTokens, hasShorthand, moves } = useMemo(() => {
    if (algorithm) {
      // Use algorithm decomposition
      // For hover mode, fullTokens needs expanded triggers to show on hover
      const shouldExpandForFull = expandTriggers === 'always' || expandTriggers === 'hover'
      const fullTokens = tokenizeAlgorithm(algorithm, {
        expandTriggers: shouldExpandForFull,
        useSimplified: showCancellations,
      })

      // Build shorthand if triggers exist
      const shorthand = buildShorthandFromSteps(algorithm.decomposition)
      const full = algorithm.simplifiedResult || buildFullFromSteps(algorithm.decomposition)
      const hasShorthandView = shorthand !== full

      const shortTokens = hasShorthandView
        ? tokenizeAlgorithm(algorithm, { expandTriggers: false, useSimplified: false })
        : fullTokens

      // Parse moves for playback mode
      const cleanFull = full.replace(/[()[\]{}~*]/g, '').replace(/\s+/g, ' ').trim()
      const parsedMoves = parseMoves(cleanFull)

      return {
        tokens: fullTokens,
        shorthandTokens: shortTokens,
        hasShorthand: hasShorthandView,
        moves: parsedMoves,
      }
    }

    if (notation) {
      // Use raw notation
      const fullTokens = tokenizeNotation(notation, {
        expandTriggers: expandTriggers === 'always',
      })
      const parsedMoves = parseMoves(notation)

      return {
        tokens: fullTokens,
        shorthandTokens: fullTokens,
        hasShorthand: false,
        moves: parsedMoves,
      }
    }

    return {
      tokens: [],
      shorthandTokens: [],
      hasShorthand: false,
      moves: [],
    }
  }, [algorithm, notation, expandTriggers, showCancellations])

  // Playback mode
  if (mode === 'playback') {
    return (
      <PlaybackDisplay
        moves={moves}
        currentMoveIndex={currentMoveIndex}
        totalMoves={totalMoves ?? moves.length}
        playingLabel={playingLabel}
        showProgress={showProgress}
        size={size}
        className={className}
      />
    )
  }

  // Static mode
  const shouldShowHoverExpand = expandTriggers === 'hover' && hasShorthand
  return (
    <StaticDisplay
      tokens={tokens}
      shorthandTokens={shorthandTokens}
      hasShorthand={shouldShowHoverExpand}
      pinnable={pinnable}
      size={size}
      className={className}
      useParentHover={!!parentHoverGroup}
    />
  )
}
