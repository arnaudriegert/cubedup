import {
  useState, useEffect, useRef, useCallback,
} from 'react'
import {
  Cube, CubeDisplay,
} from '../components/cube'
import SEOHead from '../components/SEOHead'
import { AlgorithmBreadcrumb } from '../components/algorithm'
import { useAnimatedCube } from '../hooks/useAnimatedCube'
import {
  Move, CubeState, CubeView,
} from '../types/cubeState'
import { AlgorithmId } from '../types/algorithm'
import {
  parseMoves, cleanAlgorithmString, invertAlgorithmString, moveToNotation,
} from '../utils/moveParser'
import { getAlgorithmsForCase } from '../data/cases'
import { getAlgorithm } from '../data/algorithms'
import { Color } from '../types/cube'
import { lookupCase, lookupAlgorithm } from '../utils/caseLookup'
import { parsePlaygroundUrl } from '../utils/algorithmLinks'
import { getAlgorithmNotation } from '../utils/algorithmExpander'
import { applyMask, type CFOPStep } from '../utils/pieceIdentity'
import './Playground.css'

// Color to Tailwind classes - used for dynamic button colors
const COLOR_STYLES: Record<Color, { bg: string; text: string }> = {
  [Color.WHITE]: { bg: 'bg-slate-200', text: 'text-slate-700' },
  [Color.YELLOW]: { bg: 'bg-yellow-400', text: 'text-yellow-950' },
  [Color.RED]: { bg: 'bg-red-500', text: 'text-white' },
  [Color.ORANGE]: { bg: 'bg-orange-500', text: 'text-white' },
  [Color.BLUE]: { bg: 'bg-blue-500', text: 'text-white' },
  [Color.GREEN]: { bg: 'bg-green-500', text: 'text-white' },
  [Color.GRAY]: { bg: 'bg-gray-400', text: 'text-white' },
}

// Face names for notation
type FaceName = 'U' | 'D' | 'F' | 'B' | 'R' | 'L'

// Map face name to cube state key
const FACE_TO_STATE: Record<FaceName, keyof CubeState> = {
  U: 'top', D: 'bottom', F: 'front', B: 'back', R: 'right', L: 'left',
}

// Map each face to its opposite
const OPPOSITE_FACE: Record<FaceName, FaceName> = {
  U: 'D', D: 'U', F: 'B', B: 'F', R: 'L', L: 'R',
}

// Map each face to its rotation axis
const FACE_ROTATION: Record<FaceName, { cw: string; ccw: string }> = {
  U: { cw: 'y', ccw: "y'" },
  D: { cw: "y'", ccw: 'y' },
  F: { cw: 'z', ccw: "z'" },
  B: { cw: "z'", ccw: 'z' },
  R: { cw: 'x', ccw: "x'" },
  L: { cw: "x'", ccw: 'x' },
}

// Map each face to its slice move (M, S, E)
// M = middle slice (between R/L), turns like L
// S = standing slice (between F/B), turns like F
// E = equator slice (between U/D), turns like D
const FACE_SLICE: Record<FaceName, { cw: string; ccw: string }> = {
  R: { cw: "M'", ccw: 'M' }, // R turns opposite to M
  L: { cw: 'M', ccw: "M'" }, // L turns same as M
  U: { cw: "E'", ccw: 'E' }, // U turns opposite to E
  D: { cw: 'E', ccw: "E'" }, // D turns same as E
  F: { cw: 'S', ccw: "S'" }, // F turns same as S
  B: { cw: "S'", ccw: 'S' }, // B turns opposite to S
}

// Move modifier modes (mutually exclusive)
type MoveMode = 'normal' | 'wide' | 'slice' | 'opposing' | 'rotation'

// Mode metadata for UI
const MODE_INFO: Record<MoveMode, { label: string; shortcut: string; title: string }> = {
  normal: { label: 'Normal', shortcut: '', title: 'Normal face moves' },
  wide: { label: 'Wide', shortcut: 'w', title: 'Wide moves (2 layers) [w]' },
  slice: { label: 'Slice', shortcut: 'i', title: 'Slice moves (middle layer) [i]' },
  opposing: { label: 'Opposing', shortcut: 'o', title: 'Opposing face [o]' },
  rotation: { label: 'Rotate', shortcut: 'c', title: 'Full cube rotation [c]' },
}

// Transform a face move based on the current mode
function transformMove(face: FaceName, prime: boolean, mode: MoveMode): string {
  const suffix = prime ? "'" : ''

  switch (mode) {
    case 'wide':
      return face.toLowerCase() + suffix
    case 'slice': {
      const slice = FACE_SLICE[face]
      return prime ? slice.ccw : slice.cw
    }
    case 'opposing':
      return OPPOSITE_FACE[face] + suffix
    case 'rotation': {
      const rot = FACE_ROTATION[face]
      return prime ? rot.ccw : rot.cw
    }
    default:
      return face + suffix
  }
}

// Get center color of a face from cube state
function getFaceColor(cubeState: CubeState, face: FaceName): Color {
  return cubeState[FACE_TO_STATE[face]][4] // center sticker is index 4
}

// Face control panel - simplified to 2 buttons, mode transforms the moves
interface FacePanelProps {
  face: FaceName
  cubeState: CubeState
  onMove: (notation: string) => void
  mode: MoveMode
  vertical?: boolean
}

function FacePanel({ face, cubeState, onMove, mode, vertical = false }: FacePanelProps) {
  // Get actual colors from cube state
  const faceColor = getFaceColor(cubeState, face)
  const faceStyle = COLOR_STYLES[faceColor]

  // Handler that transforms the move based on current mode
  const handleFaceClick = (prime: boolean) => () => {
    const move = transformMove(face, prime, mode)
    onMove(move)
  }

  // Get labels for the buttons based on mode
  const label = transformMove(face, false, mode)
  const labelPrime = transformMove(face, true, mode)

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-1 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/80`}>
      <button
        onClick={handleFaceClick(false)}
        className={`face-btn ${faceStyle.bg} ${faceStyle.text}`}
        title={label}
      >
        {label}
      </button>
      <button
        onClick={handleFaceClick(true)}
        className={`face-btn ${faceStyle.bg} ${faceStyle.text}`}
        title={labelPrime}
      >
        {labelPrime}
      </button>
    </div>
  )
}

// Get visible faces based on view
function getVisibleFaces(view: CubeView): { face: FaceName; position: 'top' | 'left' | 'right' }[] {
  switch (view) {
    case 'top-front-right':
      return [
        { face: 'U', position: 'top' },
        { face: 'F', position: 'left' },
        { face: 'R', position: 'right' },
      ]
    case 'top-front-left':
      return [
        { face: 'U', position: 'top' },
        { face: 'F', position: 'right' },
        { face: 'L', position: 'left' },
      ]
    case 'bottom-front-right':
      return [
        { face: 'D', position: 'top' },
        { face: 'F', position: 'left' },
        { face: 'R', position: 'right' },
      ]
  }
}

// Compute initial state from URL params (runs once on module load)
function getInitialStateFromURL() {
  const params = new URLSearchParams(window.location.search)
  const parsed = parsePlaygroundUrl(params)

  // Algorithm ID takes priority (specific variant)
  if (parsed.algorithmId) {
    const result = lookupAlgorithm(parsed.algorithmId)
    const algo = getAlgorithm(parsed.algorithmId)
    if (result && algo) {
      const algoString = getAlgorithmNotation(parsed.algorithmId)
      const cleanedAlgo = cleanAlgorithmString(algoString)
      const inverseMoves = parseMoves(invertAlgorithmString(cleanedAlgo))
      return {
        inputValue: cleanedAlgo,
        loadedAlgorithmId: parsed.algorithmId,
        inverseMoves,
      }
    }
  }

  // Case ID (backward compatible - uses first algorithm)
  if (parsed.caseId) {
    const result = lookupCase(parsed.caseId)
    if (result) {
      const algorithms = getAlgorithmsForCase(result.caseId)
      if (algorithms.length > 0) {
        const algoString = getAlgorithmNotation(algorithms[0].id)
        const cleanedAlgo = cleanAlgorithmString(algoString)
        const inverseMoves = parseMoves(invertAlgorithmString(cleanedAlgo))
        return {
          inputValue: cleanedAlgo,
          loadedAlgorithmId: algorithms[0].id as AlgorithmId,
          inverseMoves,
        }
      }
    }
  }

  // Raw notation (from triggers page or manual input)
  // Unlike OLL/PLL cases where we show the "problem state" by running the inverse,
  // triggers are meant to be practiced on a solved cube to build muscle memory.
  if (parsed.notation) {
    const cleanedAlgo = cleanAlgorithmString(parsed.notation)
    return {
      inputValue: cleanedAlgo,
      loadedAlgorithmId: null as AlgorithmId | null,
      inverseMoves: [] as Move[],
    }
  }

  return {
    inputValue: '',
    loadedAlgorithmId: null as AlgorithmId | null,
    inverseMoves: [] as Move[],
  }
}

export default function Playground() {
  const {
    cubeState,
    currentMove,
    isAnimating,
    animationSpeed,
    queueMoves,
    queueMove,
    handleAnimationEnd,
    reset,
    setAnimationSpeed,
    moveQueueLength,
    applyMovesInstantly,
  } = useAnimatedCube({ animationSpeed: 300 })

  // Initialize state from URL params
  const [initialState] = useState(getInitialStateFromURL)
  const [view, setView] = useState<CubeView>('top-front-right')
  const [inputValue, setInputValue] = useState(initialState.inputValue)

  // Track the algorithm being played for progress display
  const [playingMoves, setPlayingMoves] = useState<Move[]>([])
  const [isInputFocused, setIsInputFocused] = useState(false)

  // Track loaded algorithm from URL (for breadcrumb)
  const [loadedAlgorithmId] = useState<AlgorithmId | null>(initialState.loadedAlgorithmId)

  // Modifier mode for move transformations (mutually exclusive)
  const [moveMode, setMoveMode] = useState<MoveMode>('normal')

  // CFOP step focus for piece masking
  const [focusStep, setFocusStep] = useState<CFOPStep>(null)

  // Toggle a mode - if already active, go back to normal
  const toggleMode = useCallback((mode: MoveMode) => {
    setMoveMode(current => current === mode ? 'normal' : mode)
  }, [])

  // Track if we've applied initial moves (prevents double-apply in React Strict Mode)
  const hasAppliedInitialMoves = useRef(false)

  // Apply inverse algorithm on mount (so cube shows "problem" state ready to solve)
  useEffect(() => {
    if (hasAppliedInitialMoves.current) return
    if (initialState.inverseMoves.length > 0) {
      hasAppliedInitialMoves.current = true
      applyMovesInstantly(initialState.inverseMoves)
    }
  }, [applyMovesInstantly, initialState.inverseMoves])

  // Calculate current position in the playing algorithm
  const playingPosition = playingMoves.length > 0 && (isAnimating || moveQueueLength > 0)
    ? playingMoves.length - moveQueueLength - (isAnimating ? 1 : 0)
    : -1

  // Clear playing state when animation finishes
  useEffect(() => {
    if (playingMoves.length > 0 && !isAnimating && moveQueueLength === 0) {
      const timer = setTimeout(() => {
        setPlayingMoves([])
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [playingMoves.length, isAnimating, moveQueueLength])

  // Global keyboard shortcuts for moves and mode toggling (when input not focused)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input
      if (document.activeElement?.tagName === 'INPUT') return

      // Skip if Cmd/Ctrl pressed (allow browser shortcuts like Cmd+R refresh)
      if (e.metaKey || e.ctrlKey) return

      const key = e.key

      // Mode toggle shortcuts (w/i/o/c)
      const modeShortcuts: Record<string, MoveMode> = {
        w: 'wide',
        i: 'slice',
        o: 'opposing',
        c: 'rotation',
      }

      if (modeShortcuts[key]) {
        toggleMode(modeShortcuts[key])
        e.preventDefault()
        return
      }

      // Skip move shortcuts if animation is playing
      if (playingMoves.length > 0) return

      // Face moves - case insensitive
      const faceKeys: Record<string, FaceName> = {
        R: 'R',
        r: 'R',
        L: 'L',
        l: 'L',
        U: 'U',
        u: 'U',
        D: 'D',
        d: 'D',
        F: 'F',
        f: 'F',
        B: 'B',
        b: 'B',
      }

      // Direct moves (rotations, slices)
      const directMoves: Record<string, string> = {
        x: 'x',
        y: 'y',
        z: 'z',
        M: 'M',
        m: 'M',
        S: 'S',
        s: 'S',
        E: 'E',
        e: 'E',
      }

      if (faceKeys[key]) {
        const face = faceKeys[key]
        // Wide and slice modes affect keyboard; opposing and rotation only affect buttons
        const keyboardMode = (moveMode === 'wide' || moveMode === 'slice') ? moveMode : 'normal'
        const move = transformMove(face, e.shiftKey, keyboardMode)
        const moves = parseMoves(move)
        if (moves.length > 0) {
          setPlayingMoves([])
          queueMove(moves[0])
        }
        e.preventDefault()
        return
      }

      if (directMoves[key]) {
        // Shift adds prime modifier
        const notation = e.shiftKey ? `${directMoves[key]}'` : directMoves[key]
        const moves = parseMoves(notation)
        if (moves.length > 0) {
          setPlayingMoves([])
          queueMove(moves[0])
        }
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playingMoves.length, queueMove, toggleMode, moveMode])

  // Valid characters for move notation
  const VALID_MOVE_CHARS = /^[RLUDFBMESxyzrludfb'2()]+$/

  const handleInputChange = (newValue: string) => {
    // Remove spaces
    const noSpaces = newValue.replace(/\s/g, '')
    // Only keep valid characters
    const validChars = noSpaces.split('').filter(char => VALID_MOVE_CHARS.test(char)).join('')
    setInputValue(validChars)
  }

  const handleExecuteMoves = (inverse: boolean = false) => {
    const notation = inverse ? invertAlgorithmString(inputValue) : inputValue
    const moves = parseMoves(notation)
    if (moves.length > 0) {
      setPlayingMoves(moves)
      queueMoves(moves)
    }
  }

  const handleAppendMoves = (notation: string) => {
    // Clean and append to existing input
    const cleanedNotation = notation.replace(/\s/g, '')
    setInputValue(prev => prev + cleanedNotation)
  }

  const handleReverseInput = () => {
    if (inputValue.trim()) {
      const inverted = invertAlgorithmString(inputValue)
      setInputValue(inverted.replace(/\s/g, ''))
    }
  }

  const handleClearInput = () => {
    setInputValue('')
  }

  const handleSingleMove = (notation: string) => {
    const moves = parseMoves(notation)
    if (moves.length > 0) {
      setPlayingMoves([])
      queueMove(moves[0])
    }
  }

  const handleReset = () => {
    reset()
    setPlayingMoves([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecuteMoves()
    }
  }

  return (
    <>
      <SEOHead
        title="Playground - Practice Cube Moves"
        description="Interactive Rubik's cube playground. Practice moves and algorithms with a visual 3D cube simulation."
        path="/playground"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Playground</h1>
        <p className="page-header-subtitle">
          Practice moves and algorithms on a virtual cube
        </p>
      </header>

      <main className="main-content-narrow">
        {/* Breadcrumb when loaded from a case/algorithm */}
        {loadedAlgorithmId && (
          <AlgorithmBreadcrumb algorithmId={loadedAlgorithmId} className="mb-4" />
        )}
        {/* Algorithm Control Panel - Token-first design */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4 md:p-5 mb-6">
          {/* Token display - always visible, clickable to edit */}
          <div
            className={`
              relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-text min-h-14
              ${playingMoves.length > 0
      ? 'bg-linear-to-br from-indigo-50 to-blue-50 border-indigo-200'
      : isInputFocused
        ? 'bg-white border-indigo-400 ring-2 ring-indigo-100'
        : 'bg-slate-50 border-slate-200 hover:border-slate-300'}
            `}
            onClick={() => {
              if (playingMoves.length === 0) {
                document.getElementById('move-input')?.focus()
              }
            }}
          >
            {/* Hidden input for capturing keystrokes */}
            <input
              id="move-input"
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              disabled={playingMoves.length > 0}
            />

            {/* Token display area */}
            <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 font-mono text-sm items-center">
              {(() => {
                const isPlaying = playingMoves.length > 0
                const moves = isPlaying ? playingMoves : parseMoves(inputValue)

                if (moves.length === 0 && !isPlaying) {
                  return (
                    <>
                      <span className="text-slate-400 text-sm">
                        {isInputFocused ? '' : 'Click to type moves...'}
                      </span>
                      {isInputFocused && (
                        <span className="w-0.5 h-5 bg-indigo-500 animate-pulse" />
                      )}
                    </>
                  )
                }

                return (
                  <>
                    {moves.map((move, index) => {
                      const isCurrentMove = isPlaying && index === playingPosition
                      const isCompleted = isPlaying && index < playingPosition
                      return (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-md transition-all duration-200 ${
                            isCurrentMove
                              ? 'bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md scale-110'
                              : isCompleted
                                ? 'text-slate-400 bg-white/50'
                                : 'text-slate-700 bg-white shadow-sm'
                          }`}
                        >
                          {moveToNotation(move)}
                        </span>
                      )
                    })}
                    {/* Blinking caret when focused and not playing */}
                    {isInputFocused && !isPlaying && (
                      <span className="w-0.5 h-5 bg-indigo-500 animate-pulse rounded-full" />
                    )}
                    {isPlaying && (
                      <span className="ml-2 text-slate-500 text-xs font-medium font-mono">
                        {playingPosition >= 0 ? playingPosition + 1 : playingMoves.length}/{playingMoves.length}
                      </span>
                    )}
                  </>
                )
              })()}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0 z-10 items-center">
              {/* Clear - native search style */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearInput()
                }}
                disabled={!inputValue.trim() || playingMoves.length > 0}
                title="Clear"
                className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 text-xs
                  hover:bg-slate-400 hover:text-slate-700 transition-all
                  disabled:opacity-0 disabled:cursor-default
                  flex items-center justify-center leading-none"
              >
                ×
              </button>
              {/* Reverse */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleReverseInput()
                }}
                disabled={!inputValue.trim() || playingMoves.length > 0}
                title="Reverse algorithm"
                className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-500 text-lg
                  hover:bg-indigo-200 hover:text-indigo-700 transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed
                  flex items-center justify-center"
              >
                ⇆
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleExecuteMoves(e.shiftKey)
                }}
                disabled={!inputValue.trim() || playingMoves.length > 0}
                title="Play (Shift+click for inverse)"
                className="playground-play-btn"
              >
                <span>▶</span>
                <span className="hidden sm:inline">Play</span>
              </button>
            </div>
          </div>

          {/* Quick Algorithms */}
          <div className="flex flex-wrap gap-2 items-center mt-3">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Append:</span>
            <button onClick={() => handleAppendMoves("RUR'U'")} className="playground-trigger-btn">Sexy</button>
            <button onClick={() => handleAppendMoves("R'FRF'")} className="playground-trigger-btn">Sledge</button>
            <button onClick={() => handleAppendMoves("R'U'RU'R'U2R")} className="playground-trigger-btn">Chair</button>
            <button onClick={() => handleAppendMoves("RUR'URU2R'")} className="playground-trigger-btn">Sune</button>
          </div>
        </div>

        {/* Cube Stage - Clean Spatial Layout */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          {(() => {
            const visible = getVisibleFaces(view)
            const topFace = visible.find(v => v.position === 'top')!
            const leftFace = visible.find(v => v.position === 'left')!
            const rightFace = visible.find(v => v.position === 'right')!

            return (
              <div className="flex flex-col items-center gap-6">
                {/* Mode toggles with keyboard shortcuts */}
                <div className="flex gap-2 flex-wrap justify-start items-center self-start mb-6">
                  {(['wide', 'slice', 'opposing', 'rotation'] as const).map(mode => {
                    const info = MODE_INFO[mode]
                    const isActive = moveMode === mode
                    return (
                      <button
                        key={mode}
                        onClick={() => toggleMode(mode)}
                        className={`modifier-toggle ${isActive ? 'modifier-toggle--active' : ''}`}
                        title={info.title}
                        aria-pressed={isActive}
                      >
                        {info.label}
                        <span className="modifier-shortcut">{info.shortcut}</span>
                      </button>
                    )
                  })}
                  <span className="text-xs text-slate-400 ml-4 flex items-center gap-1">
                    <span className="modifier-shortcut">⇧</span> for inverse
                  </span>
                </div>

                {/* Visible face controls - spatially positioned */}
                <div className="relative">
                  {/* Top/Bottom face control - position depends on view */}
                  {view !== 'bottom-front-right' && (
                    <div className="flex justify-center mb-3">
                      <FacePanel
                        face={topFace.face}
                        cubeState={cubeState}
                        onMove={handleSingleMove}
                        mode={moveMode}
                      />
                    </div>
                  )}

                  {/* Cube with controls positioned spatially */}
                  <div className="flex items-center gap-3">
                    {/* Left face control */}
                    <FacePanel
                      face={leftFace.face}
                      cubeState={cubeState}
                      onMove={handleSingleMove}
                      mode={moveMode}
                      vertical
                    />

                    {/* The Cube */}
                    <CubeDisplay size="large">
                      <Cube
                        cubeState={applyMask(cubeState, focusStep)}
                        currentMove={currentMove}
                        isAnimating={isAnimating}
                        animationSpeed={animationSpeed}
                        view={view}
                        size="normal"
                        onAnimationEnd={handleAnimationEnd}
                      />
                    </CubeDisplay>

                    {/* Right face control */}
                    <FacePanel
                      face={rightFace.face}
                      cubeState={cubeState}
                      onMove={handleSingleMove}
                      mode={moveMode}
                      vertical
                    />
                  </div>

                  {/* Bottom face control - only for BFR view */}
                  {view === 'bottom-front-right' && (
                    <div className="flex justify-center mt-3">
                      <FacePanel
                        face={topFace.face}
                        cubeState={cubeState}
                        onMove={handleSingleMove}
                        mode={moveMode}
                      />
                    </div>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center bg-slate-50/80 rounded-xl px-4 py-3 border border-slate-200 mt-4">
                  {/* CFOP mask toggles */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Show</span>
                    <div className="segmented-group">
                      <button
                        onClick={() => setFocusStep(null)}
                        className={`segmented-btn mask-btn ${focusStep === null ? 'segmented-btn--active' : ''}`}
                        title="Show all stickers"
                        aria-pressed={focusStep === null}
                      >
                        All
                      </button>
                      {([
                        { step: 'cross', label: 'C', title: 'Cross' },
                        { step: 'f2l', label: 'F', title: 'F2L' },
                        { step: 'oll', label: 'O', title: 'OLL' },
                        { step: 'pll', label: 'P', title: 'PLL' },
                      ] as const).map(({ step, label, title }) => {
                        const isActive = focusStep === step
                        return (
                          <button
                            key={step}
                            onClick={() => setFocusStep(step)}
                            className={`segmented-btn mask-btn ${isActive ? 'segmented-btn--active' : ''}`}
                            title={title}
                            aria-pressed={isActive}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-300" />

                  {/* View Selector with micro cube icons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">View</span>
                    <div className="segmented-group">
                      {/* TFR - Top Front Right */}
                      <button
                        onClick={() => setView('top-front-right')}
                        title="Top, Front, Right"
                        className={`segmented-btn view-selector-btn ${view === 'top-front-right' ? 'segmented-btn--active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="9,2 16,5 10,8 3,5" className="fill-slate-300" />
                          <polygon points="3,5 10,8 10,16 3,13" className="fill-slate-500" />
                          <polygon points="10,8 16,5 16,13 10,16" className="fill-slate-400" />
                        </svg>
                      </button>
                      {/* TFL - Top Front Left */}
                      <button
                        onClick={() => setView('top-front-left')}
                        title="Top, Front, Left"
                        className={`segmented-btn view-selector-btn ${view === 'top-front-left' ? 'segmented-btn--active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="10,2 3,5 9,8 16,5" className="fill-slate-300" />
                          <polygon points="9,8 3,5 3,13 9,16" className="fill-slate-400" />
                          <polygon points="16,5 9,8 9,16 16,13" className="fill-slate-500" />
                        </svg>
                      </button>
                      {/* BFR - Bottom Front Right */}
                      <button
                        onClick={() => setView('bottom-front-right')}
                        title="Bottom, Front, Right"
                        className={`segmented-btn view-selector-btn ${view === 'bottom-front-right' ? 'segmented-btn--active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="3,13 10,10 10,2 3,5" className="fill-slate-500" />
                          <polygon points="10,10 16,13 16,5 10,2" className="fill-slate-400" />
                          <polygon points="9,16 16,13 10,10 3,13" className="fill-slate-300" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-300" />

                  {/* Speed Control - inverted so right = faster */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">Speed</span>
                    <input
                      type="range"
                      min="100"
                      max="800"
                      step="50"
                      value={900 - animationSpeed}
                      onChange={e => setAnimationSpeed(900 - Number(e.target.value))}
                      className="w-24 h-2 bg-slate-300 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs text-slate-400 font-mono w-12">{animationSpeed}ms</span>
                  </div>

                  <div className="h-6 w-px bg-slate-300" />

                  {/* Reset Button */}
                  <button onClick={handleReset} className="playground-reset-btn">
                    Reset
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      </main>
    </>
  )
}
