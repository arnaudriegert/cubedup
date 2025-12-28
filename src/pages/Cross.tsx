import {
  useCallback, useMemo, useState,
} from 'react'
import { AlgoCardRow } from '../components/algorithm'
import { CentersToggle } from '../components/CentersToggle'
import { Cube, CubeDisplay } from '../components/cube'
import SEOHead from '../components/SEOHead'
import type { AlgorithmId } from '../types/algorithm'
import { getAlgorithm } from '../data/algorithms'
import { expandAlgorithmObject } from '../utils/algorithmExpander'
import {
  movesToNotation, parseMoves, invertAlgorithmString,
} from '../utils/moveParser'
import { createSolvedCube, applyMoves } from '../utils/cubeState'
import { applyMask, type CFOPStep } from '../utils/pieceIdentity'
import { useAnimatedCubeGrid } from '../hooks/useAnimatedCubeGrid'
import type { CubeState } from '../types/cubeState'

// Y rotations for showing all 4 orientations of a pattern
const Y_ROTATIONS = ['', 'y', 'y2', "y'"] as const

// Generate setup moves for a y-rotation variant (y rotation + inverse algorithm)
function getSetupMoves(notation: string, yRotation: string) {
  const inverseAlgo = invertAlgorithmString(notation)
  const fullNotation = yRotation ? `${yRotation} ${inverseAlgo}` : inverseAlgo
  return parseMoves(fullNotation)
}

// Generate initial cube state from setup moves
function generateInitialState(notation: string, yRotation: string): CubeState {
  return applyMoves(createSolvedCube(), getSetupMoves(notation, yRotation))
}

// Component for showing a single cross case with left OR right orientation
interface CrossCaseCardProps {
  slot: 'left' | 'right'
  algorithmId: AlgorithmId
  mask: CFOPStep
}

function CrossCaseCard({ slot, algorithmId, mask }: CrossCaseCardProps) {
  const isLeft = slot === 'left'
  const label = isLeft ? 'Left Side' : 'Right Side'
  const view = isLeft ? 'top-front-left' : 'top-front-right'

  // Get algorithm from the map (guaranteed to exist for valid IDs)
  const algorithm = getAlgorithm(algorithmId)!

  // Expand algorithm to get notation
  const expanded = expandAlgorithmObject(algorithm)
  const notation = movesToNotation(expanded.moves)

  // Memoize initial states and setup moves
  const initialStates = useMemo(
    () => Y_ROTATIONS.map(y => generateInitialState(notation, y)) as [CubeState, CubeState, CubeState, CubeState],
    [notation],
  )
  const setupMoves = useMemo(
    () => Y_ROTATIONS.map(y => getSetupMoves(notation, y)),
    [notation],
  )

  // Use grid hook for synchronized animation
  const { cubes, isAnimating, isFinished, play, reset } = useAnimatedCubeGrid({
    initialStates,
    animationSpeed: 300,
  })

  // Handle demo click
  const handleDemo = useCallback(() => {
    if (isAnimating) return
    if (isFinished) {
      reset(setupMoves)
    } else {
      play(parseMoves(notation), setupMoves)
    }
  }, [isAnimating, isFinished, notation, setupMoves, play, reset])

  return (
    <div className="case-card">
      <h4 className="case-card-title text-center">{label}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4 justify-items-center mb-4 md:mb-6">
        {cubes.map((cube, i) => (
          <CubeDisplay key={i}>
            <Cube
              cubeState={applyMask(cube.cubeState, mask)}
              currentMove={cube.currentMove}
              isAnimating={cube.isAnimating}
              animationSpeed={cube.animationSpeed}
              onAnimationEnd={cube.handleAnimationEnd}
              view={view}
              size="medium"
            />
          </CubeDisplay>
        ))}
      </div>
      <AlgoCardRow
        algorithm={algorithm}
        onDemo={handleDemo}
        isPlaying={isAnimating}
        isFinished={isFinished}
      />
    </div>
  )
}

export default function Cross() {
  const [hideCenters, setHideCenters] = useState(false)
  const mask: CFOPStep = hideCenters ? 'cross-no-centers' : 'cross'

  return (
    <>
      <SEOHead
        title="Cross Patterns"
        description="Learn efficient cross planning for the Rubik's Cube. Practice pattern recognition across all color orientations for faster inspection planning."
        path="/cross"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Cross Patterns</h1>
        <p className="page-header-subtitle">
          Train pattern recognition across all colors and orientations
        </p>
      </header>

      <main className="main-content-wide">
        {/* Introduction */}
        <div className="section-card mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <CubeDisplay>
              <Cube
                cubeState={applyMask(createSolvedCube(), mask)}
                view="bottom-front-right"
                size="normal"
              />
            </CubeDisplay>
            <div className="text-left max-w-lg">
              <p className="body-text mb-3">
                The cross has four edges, each requiring the same insertion patterns—just from different
                angles. This page trains you to recognize these patterns <strong>regardless of which
                  edge you're solving</strong>.
              </p>
              <p className="help-text mb-3">
                Each case shows <strong>four cubes</strong>: the same pattern rotated to all four front
                colors. Left and right variants train both hands. The goal is instant recognition—see
                the pattern, execute without thinking.
              </p>
              <p className="text-sm text-slate-500">
                Toggle the <strong>side centers</strong> off to practice relative placement: positioning
                edges correctly relative to each other before worrying about which slot is which.
                This builds the spatial intuition needed for efficient cross planning.
              </p>
            </div>
          </div>
        </div>

        {/* Case 1: One Edge Insert via Front */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">1. Bad Edge on Top (white facing out)</h3>
          <p className="help-text mb-6 text-center">
            Edge on top layer with white facing sideways—can't insert directly.
            First two moves swing it down into its slot, last move restores the neighbor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CrossCaseCard slot="left" algorithmId="cross-top-left" mask={mask} />
            <CrossCaseCard slot="right" algorithmId="cross-top-right" mask={mask} />
          </div>
        </div>

        {/* Case 1b: One Edge Insert via Down */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">2. Bad Edge in Middle Layer</h3>
          <p className="help-text mb-6 text-center">
            Edge stuck between top and bottom layers, white facing sideways.
            First move swings it down, D opens the neighbor's slot, last move restores the neighbor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CrossCaseCard slot="left" algorithmId="cross-middle-left" mask={mask} />
            <CrossCaseCard slot="right" algorithmId="cross-middle-right" mask={mask} />
          </div>
        </div>

        {/* Case 3: Flipped edge in own slot */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">3. Flipped Edge in Own Slot</h3>
          <p className="help-text mb-6 text-center">
            Edge is in the right place but white faces out instead of down.
            Kick it to the side, rotate bottom, tuck it under, rotate back.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CrossCaseCard slot="left" algorithmId="cross-flipped-left" mask={mask} />
            <CrossCaseCard slot="right" algorithmId="cross-flipped-right" mask={mask} />
          </div>
        </div>

        {/* Case 4: Two Edges Insert */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">4. Two Edges at Once</h3>
          <p className="help-text mb-6 text-center">
            Good edge in the middle layer, bad edge flipped wrong on top in the neighbor's slot.
            First move inserts the good edge while the bad one becomes good in the middle, second move inserts it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CrossCaseCard slot="left" algorithmId="cross-two-edges-left" mask={mask} />
            <CrossCaseCard slot="right" algorithmId="cross-two-edges-right" mask={mask} />
          </div>
        </div>

        {/* More to come */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">More cross patterns to come...</p>
        </div>
      </main>

      <CentersToggle hideCenters={hideCenters} onToggle={() => setHideCenters(!hideCenters)} />
    </>
  )
}
