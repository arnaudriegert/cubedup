/**
 * AlgorithmDisplay - Unified algorithm display component
 *
 * Replaces both AlgorithmBox (case pages) and Playground inline tokens.
 * Supports:
 * - Static mode: for case cards with hover-to-expand triggers
 * - Playback mode: for Playground with current move highlighting
 * - Decomposition features everywhere (trigger expansion, step boundaries, cancellations)
 */

import {
  useState, useEffect, useMemo,
} from 'react'
import type { Algorithm } from '../../types/algorithm'
import {
  tokenizeNotation,
  tokenizeExpandedAlgorithm,
  tokenizeNewAlgorithmShorthand,
  buildShorthandFromNewAlgorithm,
  type AlgorithmToken,
} from '../../utils/algorithmTokenizer'
import { expandAlgorithmObject } from '../../utils/algorithmExpander'
import {
  parseMoves, moveToNotation, movesToNotation,
} from '../../utils/moveParser'
import type { Move } from '../../types/cubeState'
import './AlgorithmDisplay.css'

export type DisplayMode = 'static' | 'playback'
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
  showCancellations?: boolean

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

// Token state styling - using CSS classes from AlgorithmDisplay.css
const TOKEN_STATES = {
  default: 'algo-token-default',
  current: 'algo-token-current',
  completed: 'algo-token-completed',
  cancelled: 'algo-token-cancelled',
  highlighted: 'font-bold text-indigo-700',
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

/**
 * Represents a group of tokens that participate in a cancellation.
 * Either has a result token (partial cancel) or just cancelled tokens (full cancel).
 */
interface CancellationGroupData {
  id: number
  cancelledTokens: AlgorithmToken[]
  resultToken?: AlgorithmToken
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
        className={`${sizeStyle.token} algo-token-trigger ${baseStyle}`}
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
    if (state === 'current') stateStyle = 'algo-token-rotation-current'
    if (state === 'completed') stateStyle = 'algo-token-rotation-completed'
    if (token.isCancelled) stateStyle = TOKEN_STATES.cancelled
    if (token.isHighlighted) stateStyle = 'font-bold text-purple-800'

    return (
      <span
        className={`${sizeStyle.token} algo-token-rotation ${stateStyle || 'algo-token-rotation-default'}`}
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
      className={`${sizeStyle.token} algo-token shadow-sm ${baseStyle}`}
    >
      {token.value}
    </span>
  )
}

/**
 * Renders a cancellation group with click-to-reveal behavior.
 * - Partial cancellation (F F → F2): Shows F2 with underline hint, click reveals "~F F~ → F2"
 * - Full cancellation (R R' → ∅): Shows × indicator, click reveals "~R R'~"
 */
function CancellationGroup({
  group,
  size,
}: {
  group: CancellationGroupData
  size: DisplaySize
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sizeStyle = SIZE_STYLES[size]

  // Format cancelled moves for title tooltip
  const cancelledNotation = group.cancelledTokens.map(t => t.value).join(' ')

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(prev => !prev)
  }

  if (group.resultToken) {
    // Partial cancellation - show result, click to reveal cancelled moves
    const parity = group.resultToken.stepParity || 'even'
    const parityCategory = group.resultToken.isFromTrigger ? 'trigger' : 'moves'
    const parityStyle = PARITY_COLORS[parityCategory][parity]

    return (
      <span className="inline-flex items-center gap-0.5">
        {isExpanded && (
          <>
            {/* Show cancelled moves with strikethrough when expanded */}
            {group.cancelledTokens.map((token, idx) => (
              <span
                key={idx}
                onClick={handleClick}
                className={`${sizeStyle.token} algo-token ${parityStyle} algo-cancel-partial cursor-pointer`}
              >
                {token.value}
              </span>
            ))}
            <span className="algo-cancel-arrow">→</span>
          </>
        )}
        {/* Always show the result */}
        <span
          onClick={handleClick}
          className={`${sizeStyle.token} algo-token ${parityStyle} algo-cancel-result ${
            isExpanded ? 'algo-cancel-result-expanded' : 'algo-cancel-result-collapsed'
          }`}
          title={isExpanded ? 'Click to collapse' : `Combined from: ${cancelledNotation} (click to reveal)`}
        >
          {group.resultToken.value}
        </span>
      </span>
    )
  }

  // Full cancellation - show small indicator, click to reveal cancelled moves
  return (
    <span className="inline-flex items-center gap-0.5">
      {isExpanded ? (
        <>
          {/* Show cancelled moves with strikethrough when expanded */}
          {group.cancelledTokens.map((token, idx) => (
            <span
              key={idx}
              onClick={handleClick}
              className={`${sizeStyle.token} algo-token algo-cancel-expanded cursor-pointer`}
            >
              {token.value}
            </span>
          ))}
        </>
      ) : (
        <span
          onClick={handleClick}
          className={`${sizeStyle.token} algo-cancel-indicator`}
          title={`Cancelled: ${cancelledNotation} (click to reveal)`}
        >
          ×
        </span>
      )}
    </span>
  )
}

/**
 * A renderable item: either a regular token or a cancellation group
 */
type RenderItem =
  | { type: 'token'; token: AlgorithmToken }
  | { type: 'cancellation'; group: CancellationGroupData }

/**
 * Render tokens - groups tokens by stepIndex to prevent line breaks within a step
 * Handles cancellation groups with hover-to-reveal behavior
 */
function TokenList({ tokens, state, size }: { tokens: AlgorithmToken[]; state: 'default' | 'current' | 'completed'; size: DisplaySize }) {
  // Build cancellation groups from tokens
  const cancellationGroups = new Map<number, CancellationGroupData>()

  for (const token of tokens) {
    if (token.cancellationId === undefined) continue

    let group = cancellationGroups.get(token.cancellationId)
    if (!group) {
      group = { id: token.cancellationId, cancelledTokens: [] }
      cancellationGroups.set(token.cancellationId, group)
    }

    if (token.isCancelled) {
      group.cancelledTokens.push(token)
    } else if (token.isResult) {
      group.resultToken = token
    }
  }

  // Build render items: regular tokens + cancellation groups (inserted at correct position)
  const renderItems: RenderItem[] = []
  const processedCancellationIds = new Set<number>()

  for (const token of tokens) {
    // Skip groupStart/groupEnd/space tokens
    if (token.type === 'groupStart' || token.type === 'groupEnd' || token.type === 'space') {
      continue
    }

    // Check if this token is part of a cancellation
    if (token.cancellationId !== undefined) {
      const group = cancellationGroups.get(token.cancellationId)!

      // For result tokens (partial cancellation), render the cancellation group
      if (token.isResult && !processedCancellationIds.has(token.cancellationId)) {
        processedCancellationIds.add(token.cancellationId)
        renderItems.push({ type: 'cancellation', group })
        continue
      }

      // For cancelled tokens
      if (token.isCancelled) {
        // For full cancellations (no result), render the group at first cancelled token
        if (!group.resultToken && !processedCancellationIds.has(token.cancellationId)) {
          processedCancellationIds.add(token.cancellationId)
          renderItems.push({ type: 'cancellation', group })
        }
        // Skip cancelled tokens - they're rendered as part of the group
        continue
      }
    }

    // Regular token
    renderItems.push({ type: 'token', token })
  }

  // Group render items by stepIndex to prevent line breaks within a step
  const stepGroups: Array<{ stepIndex: number | undefined; items: RenderItem[] }> = []
  let currentGroup: { stepIndex: number | undefined; items: RenderItem[] } | null = null

  for (const item of renderItems) {
    const stepIndex = item.type === 'token'
      ? item.token.stepIndex
      : (item.group.resultToken?.stepIndex ?? item.group.cancelledTokens[0]?.stepIndex)

    if (currentGroup === null || currentGroup.stepIndex !== stepIndex) {
      currentGroup = { stepIndex, items: [] }
      stepGroups.push(currentGroup)
    }
    currentGroup.items.push(item)
  }

  return (
    <>
      {stepGroups.map((group, groupIdx) => (
        <span key={groupIdx} className="algo-step-group">
          {group.items.map((item, itemIdx) => {
            if (item.type === 'cancellation') {
              return <CancellationGroup key={`cancel-${item.group.id}`} group={item.group} size={size} />
            }
            return <Token key={itemIdx} token={item.token} state={state} size={size} />
          })}
        </span>
      ))}
    </>
  )
}

/**
 * Detect if the device supports hover (desktop vs touch)
 * On touch devices, we use tap to toggle; on desktop, CSS hover works
 */
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // hover: none means touch device
    setIsTouch(!window.matchMedia('(hover: hover)').matches)
  }, [])

  return isTouch
}

/**
 * Static mode display with hover-to-expand functionality
 * - Desktop: hover reveals expanded view (CSS-based)
 * - Mobile: tap toggles expanded view (JS-based)
 */
function StaticDisplay({
  tokens,
  shorthandTokens,
  hasShorthand,
  size,
  className,
  useParentHover,
}: {
  tokens: AlgorithmToken[]
  shorthandTokens: AlgorithmToken[]
  hasShorthand: boolean
  size: DisplaySize
  className: string
  useParentHover: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isTouch = useIsTouchDevice()

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle on touch devices
    if (hasShorthand && isTouch) {
      e.stopPropagation()
      setIsExpanded(prev => !prev)
    }
  }

  // No toggle needed if there's no shorthand
  if (!hasShorthand) {
    return (
      <div className={`flex algo-token-container ${className}`}>
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
      className={`relative ${useParentHover ? '' : 'group/algo'} ${className}`}
    >
      {/* Shorthand view: shown by default, hidden on hover (desktop) or when expanded (mobile) */}
      <div className={`algo-token-container ${isExpanded ? 'hidden' : `flex ${shorthandHoverClass}`}`}>
        <TokenList tokens={shorthandTokens} state="default" size={size} />
      </div>

      {/* Full view: hidden by default, shown on hover (desktop) or when expanded (mobile) */}
      <div className={`algo-token-container ${isExpanded ? 'flex' : `hidden ${fullHoverClass}`}`}>
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
    <div className={`flex algo-token-container ${className}`}>
      {moves.map((move, index) => {
        const isCurrentMove = isPlaying && index === currentMoveIndex
        const isCompleted = isPlaying && index < currentMoveIndex
        const state = isCurrentMove ? 'current' : isCompleted ? 'completed' : 'default'

        return (
          <span
            key={index}
            className={`${SIZE_STYLES[size].token} algo-token ${TOKEN_STATES[state]}`}
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
  showCancellations = true,
  size = 'md',
  showProgress = false,
  className = '',
  parentHoverGroup,
}: AlgorithmDisplayProps) {
  // Parse tokens based on input type
  const { tokens, shorthandTokens, hasShorthand, moves } = useMemo(() => {
    if (algorithm) {
      // Expand algorithm and tokenize
      const expanded = expandAlgorithmObject(algorithm)
      const fullTokens = tokenizeExpandedAlgorithm(expanded, { showCancellations })

      // Build shorthand (shows trigger names)
      const shorthand = buildShorthandFromNewAlgorithm(algorithm)
      const full = movesToNotation(expanded.moves)
      const hasShorthandView = shorthand !== full

      const shortTokens = hasShorthandView
        ? tokenizeNewAlgorithmShorthand(algorithm)
        : fullTokens

      return {
        tokens: fullTokens,
        shorthandTokens: shortTokens,
        hasShorthand: hasShorthandView,
        moves: expanded.moves,
      }
    }

    if (notation) {
      // Use raw notation
      const fullTokens = tokenizeNotation(notation)
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
  }, [algorithm, notation, showCancellations])

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

  // Static mode - hover to expand triggers when shorthand is available
  return (
    <StaticDisplay
      tokens={tokens}
      shorthandTokens={shorthandTokens}
      hasShorthand={hasShorthand}
      size={size}
      className={className}
      useParentHover={!!parentHoverGroup}
    />
  )
}
