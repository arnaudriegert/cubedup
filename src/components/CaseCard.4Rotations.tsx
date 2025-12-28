import { useCallback, useMemo } from 'react'
import { AlgoCardRow } from './algorithm'
import { Cube, CubeDisplay } from './cube'
import type { Algorithm } from '../types/algorithm'
import type { CFOPStep } from '../utils/pieceIdentity'
import { expandAlgorithmObject } from '../utils/algorithmExpander'
import {
  movesToNotation, parseMoves, invertAlgorithmString,
} from '../utils/moveParser'
import { createSolvedCube, applyMoves } from '../utils/cubeState'
import { applyMask } from '../utils/pieceIdentity'
import { useAnimatedCubeGrid } from '../hooks/useAnimatedCubeGrid'
import { useMediaQuery } from '../hooks'
import type { CubeState, CubeView } from '../types/cubeState'

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

export interface CaseCard4RotationsProps {
  isLeft?: boolean
  algorithm: Algorithm
  mask: CFOPStep
}

export function CaseCard4Rotations({
  isLeft = false,
  algorithm,
  mask,
}: CaseCard4RotationsProps) {
  const label = isLeft ? 'Left Side' : 'Right Side'
  const view: CubeView = isLeft ? 'top-front-left' : 'top-front-right'
  const isMdScreen = useMediaQuery('md')
  const isLgScreen = useMediaQuery('lg')
  const isXlScreen = useMediaQuery('xl')
  // compact → medium → compact → medium as viewport grows
  // md (768): medium single column, lg (1024): compact side-by-side, xl (1280): medium side-by-side
  const cubeSize = (isMdScreen && !isLgScreen) || isXlScreen ? 'medium' : 'compact'

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
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 justify-items-center mb-4 md:mb-6">
        {cubes.map((cube, i) => (
          <CubeDisplay key={i}>
            <Cube
              cubeState={applyMask(cube.cubeState, mask)}
              currentMove={cube.currentMove}
              isAnimating={cube.isAnimating}
              animationSpeed={cube.animationSpeed}
              onAnimationEnd={cube.handleAnimationEnd}
              view={view}
              size={cubeSize}
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
