import {
  useState, useMemo, useEffect, useRef,
} from 'react'
import {
  Cube, CubeDisplay, FaceButton,
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
import {
  ollGroups, pllGroups, getCase, getAlgorithmsForCase,
} from '../data/cases'
import { getAlgorithm } from '../data/algorithms'
import type { Case } from '../types/algorithm'
import { Color } from '../types/cube'
import {
  lookupCase, lookupAlgorithm, AlgorithmLookupResult,
} from '../utils/caseLookup'
import { parsePlaygroundUrl } from '../utils/algorithmLinks'
import { getAlgorithmNotation } from '../utils/algorithmExpander'
import './Playground.css'

// Flatten cases for dropdown
interface CaseOption {
  label: string
  caseData: Case
}

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
const FACE_ROTATION: Record<FaceName, { cw: string; ccw: string; symbols: [string, string] }> = {
  U: { cw: 'y', ccw: "y'", symbols: ['↺', '↻'] },
  D: { cw: "y'", ccw: 'y', symbols: ['↻', '↺'] },
  F: { cw: 'z', ccw: "z'", symbols: ['↺', '↻'] },
  B: { cw: "z'", ccw: 'z', symbols: ['↻', '↺'] },
  R: { cw: 'x', ccw: "x'", symbols: ['↺', '↻'] },
  L: { cw: "x'", ccw: 'x', symbols: ['↻', '↺'] },
}

// Get center color of a face from cube state
function getFaceColor(cubeState: CubeState, face: FaceName): Color {
  return cubeState[FACE_TO_STATE[face]][4] // center sticker is index 4
}

// Face control panel - cleaner layout with dynamic colors
interface FacePanelProps {
  face: FaceName
  cubeState: CubeState
  onMove: (notation: string) => void
  vertical?: boolean
}

function FacePanel({ face, cubeState, onMove, vertical = false }: FacePanelProps) {
  const opposite = OPPOSITE_FACE[face]
  const rotation = FACE_ROTATION[face]

  // Get actual colors from cube state
  const faceColor = getFaceColor(cubeState, face)
  const oppositeColor = getFaceColor(cubeState, opposite)
  const faceStyle = COLOR_STYLES[faceColor]
  const oppositeStyle = COLOR_STYLES[oppositeColor]

  return (
    <div className={`
      flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2
      bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/80
    `}>
      {/* Main face - always in a row */}
      <div className="flex flex-row gap-1">
        <FaceButton face={face} size="lg" colorStyle={faceStyle} onClick={() => onMove(face)} />
        <FaceButton face={face} prime size="lg" colorStyle={faceStyle} onClick={() => onMove(`${face}'`)} />
      </div>

      {/* Secondary controls: opposite + rotation */}
      <div className={`flex ${vertical ? 'flex-row' : 'flex-col'} gap-1`}>
        {/* Opposite face - smaller, muted */}
        <div className="flex gap-0.5">
          <FaceButton face={opposite} size="sm" colorStyle={oppositeStyle} opacity={0.5} onClick={() => onMove(opposite)} title={opposite} />
          <FaceButton face={opposite} prime size="sm" colorStyle={oppositeStyle} opacity={0.5} onClick={() => onMove(`${opposite}'`)} title={`${opposite}'`} />
        </div>

        {/* Rotation - minimal */}
        <div className="flex gap-0.5">
          <button onClick={() => onMove(rotation.ccw)} className="rotation-btn" title={rotation.ccw}>
            {rotation.symbols[0]}
          </button>
          <button onClick={() => onMove(rotation.cw)} className="rotation-btn" title={rotation.cw}>
            {rotation.symbols[1]}
          </button>
        </div>
      </div>
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
        loadedCase: null as AlgorithmLookupResult | null,
        selectedOLL: result.type === 'oll' ? result.caseId : '',
        selectedPLL: result.type === 'pll' ? result.caseId : '',
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
          loadedCase: null as AlgorithmLookupResult | null,
          selectedOLL: result.type === 'oll' ? result.caseId : '',
          selectedPLL: result.type === 'pll' ? result.caseId : '',
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
      loadedCase: null as AlgorithmLookupResult | null,
      selectedOLL: '',
      selectedPLL: '',
      inverseMoves: [] as Move[],
    }
  }

  return {
    inputValue: '',
    loadedAlgorithmId: null as AlgorithmId | null,
    loadedCase: null as AlgorithmLookupResult | null,
    selectedOLL: '',
    selectedPLL: '',
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
  const [selectedOLL, setSelectedOLL] = useState(initialState.selectedOLL)
  const [selectedPLL, setSelectedPLL] = useState(initialState.selectedPLL)

  // Track the algorithm being played for progress display
  const [playingMoves, setPlayingMoves] = useState<Move[]>([])
  const [playingLabel, setPlayingLabel] = useState<string>('')
  const [isInputFocused, setIsInputFocused] = useState(false)

  // Track loaded algorithm from URL (for breadcrumb)
  const [loadedAlgorithmId] = useState<AlgorithmId | null>(initialState.loadedAlgorithmId)

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

  // Flatten OLL cases for dropdown
  const ollOptions = useMemo(() => {
    const options: CaseOption[] = []
    for (const group of ollGroups) {
      for (const entry of group.cases) {
        for (const caseId of entry) {
          const caseData = getCase(caseId)
          if (caseData) {
            options.push({
              label: `OLL ${caseData.number} - ${caseData.name}`,
              caseData,
            })
          }
        }
      }
    }
    return options.sort((a, b) => (a.caseData.number ?? 0) - (b.caseData.number ?? 0))
  }, [])

  // Flatten PLL cases for dropdown
  const pllOptions = useMemo(() => {
    const options: CaseOption[] = []
    for (const group of pllGroups) {
      for (const entry of group.cases) {
        for (const caseId of entry) {
          const caseData = getCase(caseId)
          if (caseData) {
            options.push({
              label: `PLL ${caseData.name}`,
              caseData,
            })
          }
        }
      }
    }
    return options.sort((a, b) => a.caseData.name.localeCompare(b.caseData.name))
  }, [])

  // Calculate current position in the playing algorithm
  const playingPosition = playingMoves.length > 0 && (isAnimating || moveQueueLength > 0)
    ? playingMoves.length - moveQueueLength - (isAnimating ? 1 : 0)
    : -1

  // Clear playing state when animation finishes
  useEffect(() => {
    if (playingMoves.length > 0 && !isAnimating && moveQueueLength === 0) {
      const timer = setTimeout(() => {
        setPlayingMoves([])
        setPlayingLabel('')
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [playingMoves.length, isAnimating, moveQueueLength])

  // Populate input when selecting OLL
  const handleOLLSelect = (label: string) => {
    setSelectedOLL(label)
    setSelectedPLL('')
    const caseData = ollOptions.find(o => o.label === label)?.caseData
    if (caseData) {
      const algorithms = getAlgorithmsForCase(caseData.id)
      if (algorithms.length > 0) {
        const algoString = getAlgorithmNotation(algorithms[0].id)
        setInputValue(cleanAlgorithmString(algoString))
      }
    }
  }

  // Populate input when selecting PLL
  const handlePLLSelect = (label: string) => {
    setSelectedPLL(label)
    setSelectedOLL('')
    const caseData = pllOptions.find(o => o.label === label)?.caseData
    if (caseData) {
      const algorithms = getAlgorithmsForCase(caseData.id)
      if (algorithms.length > 0) {
        const algoString = getAlgorithmNotation(algorithms[0].id)
        setInputValue(cleanAlgorithmString(algoString))
      }
    }
  }

  // Valid characters for move notation
  const VALID_MOVE_CHARS = /^[RLUDFBMESxyzrludfb'2()]+$/

  const handleInputChange = (newValue: string) => {
    // Remove spaces
    const noSpaces = newValue.replace(/\s/g, '')
    // Only keep valid characters
    const validChars = noSpaces.split('').filter(char => VALID_MOVE_CHARS.test(char)).join('')
    setInputValue(validChars)
    setSelectedOLL('')
    setSelectedPLL('')
  }

  const handleExecuteMoves = (inverse: boolean = false) => {
    const notation = inverse ? invertAlgorithmString(inputValue) : inputValue
    const moves = parseMoves(notation)
    if (moves.length > 0) {
      const label = selectedOLL || selectedPLL || ''
      setPlayingMoves(moves)
      setPlayingLabel(label ? `${label}${inverse ? ' (inverse)' : ''}` : '')
      queueMoves(moves)
    }
  }

  const handleAppendMoves = (notation: string) => {
    // Clean and append to existing input
    const cleanedNotation = notation.replace(/\s/g, '')
    setInputValue(prev => prev + cleanedNotation)
    setSelectedOLL('')
    setSelectedPLL('')
  }

  const handleReverseInput = () => {
    if (inputValue.trim()) {
      const inverted = invertAlgorithmString(inputValue)
      setInputValue(inverted.replace(/\s/g, ''))
      setSelectedOLL('')
      setSelectedPLL('')
    }
  }

  const handleClearInput = () => {
    setInputValue('')
    setSelectedOLL('')
    setSelectedPLL('')
  }

  const handleSingleMove = (notation: string) => {
    const moves = parseMoves(notation)
    if (moves.length > 0) {
      setPlayingMoves([])
      setPlayingLabel('')
      queueMove(moves[0])
    }
  }

  const handleReset = () => {
    reset()
    setPlayingMoves([])
    setPlayingLabel('')
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
                      <span className="ml-2 text-slate-500 text-xs font-medium">
                        {playingLabel && <span className="text-indigo-600">{playingLabel} · </span>}
                        <span className="font-mono">{playingPosition >= 0 ? playingPosition + 1 : playingMoves.length}/{playingMoves.length}</span>
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

          {/* Quick Algorithms & OLL/PLL Selectors */}
          <div className="flex flex-wrap gap-2 items-center mt-3">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Append:</span>
            <button onClick={() => handleAppendMoves("RUR'U'")} className="playground-trigger-btn">Sexy</button>
            <button onClick={() => handleAppendMoves("R'FRF'")} className="playground-trigger-btn">Sledge</button>
            <button onClick={() => handleAppendMoves("RUR'URU2R'")} className="playground-trigger-btn">Sune</button>
            <button onClick={() => handleAppendMoves("R'U'RU'R'U2R")} className="playground-trigger-btn">Anti-Sune</button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <select
              value={selectedOLL}
              onChange={e => handleOLLSelect(e.target.value)}
              className="playground-select"
            >
              <option value="">OLL...</option>
              {ollOptions.map(option => (
                <option key={option.label} value={option.label}>{option.label}</option>
              ))}
            </select>
            <select
              value={selectedPLL}
              onChange={e => handlePLLSelect(e.target.value)}
              className="playground-select"
            >
              <option value="">PLL...</option>
              {pllOptions.map(option => (
                <option key={option.label} value={option.label}>{option.label}</option>
              ))}
            </select>
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
                {/* Visible face controls - spatially positioned */}
                <div className="relative">
                  {/* Top/Bottom face control - position depends on view */}
                  {view !== 'bottom-front-right' && (
                    <div className="flex justify-center mb-3">
                      <FacePanel face={topFace.face} cubeState={cubeState} onMove={handleSingleMove} />
                    </div>
                  )}

                  {/* Cube with controls positioned spatially */}
                  <div className="flex items-center gap-3">
                    {/* Left face control */}
                    <FacePanel face={leftFace.face} cubeState={cubeState} onMove={handleSingleMove} vertical />

                    {/* The Cube */}
                    <CubeDisplay size="large">
                      <Cube
                        cubeState={cubeState}
                        currentMove={currentMove}
                        isAnimating={isAnimating}
                        animationSpeed={animationSpeed}
                        view={view}
                        size="normal"
                        onAnimationEnd={handleAnimationEnd}
                      />
                    </CubeDisplay>

                    {/* Right face control */}
                    <FacePanel face={rightFace.face} cubeState={cubeState} onMove={handleSingleMove} vertical />
                  </div>

                  {/* Bottom face control - only for BFR view */}
                  {view === 'bottom-front-right' && (
                    <div className="flex justify-center mt-3">
                      <FacePanel face={topFace.face} cubeState={cubeState} onMove={handleSingleMove} />
                    </div>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center bg-slate-50/80 rounded-xl px-4 py-3 border border-slate-200">
                  {/* View Selector with micro cube icons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">View</span>
                    <div className="flex gap-1 bg-slate-200/80 p-1 rounded-lg">
                      {/* TFR - Top Front Right */}
                      <button
                        onClick={() => setView('top-front-right')}
                        title="Top, Front, Right"
                        className={`view-selector-btn ${view === 'top-front-right' ? 'view-selector-btn-active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="9,2 16,5 10,8 3,5" className="fill-slate-300" />
                          <polygon points="3,5 10,8 10,16 3,13" className="fill-slate-500" />
                          <polygon points="10,8 16,5 16,13 10,16" className="fill-slate-400" />
                        </svg>
                        <span className="text-[9px] text-slate-500 font-medium">TFR</span>
                      </button>
                      {/* TFL - Top Front Left */}
                      <button
                        onClick={() => setView('top-front-left')}
                        title="Top, Front, Left"
                        className={`view-selector-btn ${view === 'top-front-left' ? 'view-selector-btn-active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="10,2 3,5 9,8 16,5" className="fill-slate-300" />
                          <polygon points="9,8 3,5 3,13 9,16" className="fill-slate-400" />
                          <polygon points="16,5 9,8 9,16 16,13" className="fill-slate-500" />
                        </svg>
                        <span className="text-[9px] text-slate-500 font-medium">TFL</span>
                      </button>
                      {/* BFR - Bottom Front Right */}
                      <button
                        onClick={() => setView('bottom-front-right')}
                        title="Bottom, Front, Right"
                        className={`view-selector-btn ${view === 'bottom-front-right' ? 'view-selector-btn-active' : ''}`}
                      >
                        <svg width="20" height="18" viewBox="0 0 20 18">
                          <polygon points="3,13 10,10 10,2 3,5" className="fill-slate-500" />
                          <polygon points="10,10 16,13 16,5 10,2" className="fill-slate-400" />
                          <polygon points="9,16 16,13 10,10 3,13" className="fill-slate-300" />
                        </svg>
                        <span className="text-[9px] text-slate-500 font-medium">BFR</span>
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
