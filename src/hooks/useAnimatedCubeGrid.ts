import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react'
import { useAnimatedCube } from './useAnimatedCube'
import type { CubeState, Move } from '../types/cubeState'

interface UseAnimatedCubeGridOptions {
  initialStates: [CubeState, CubeState, CubeState, CubeState]
  animationSpeed?: number
}

interface UseAnimatedCubeGridReturn {
  cubes: ReturnType<typeof useAnimatedCube>[]
  isAnimating: boolean
  isFinished: boolean
  play: (moves: Move[], setupMoves: Move[][]) => void
  reset: (setupMoves: Move[][]) => void
}

/**
 * Hook for managing a grid of 4 animated cubes that play in sync.
 * Handles play/reset cycle with finished state tracking.
 */
export function useAnimatedCubeGrid({
  initialStates,
  animationSpeed = 300,
}: UseAnimatedCubeGridOptions): UseAnimatedCubeGridReturn {
  // Four animated cube hooks (can't loop - hooks rules)
  const cube0 = useAnimatedCube({ initialState: initialStates[0], animationSpeed })
  const cube1 = useAnimatedCube({ initialState: initialStates[1], animationSpeed })
  const cube2 = useAnimatedCube({ initialState: initialStates[2], animationSpeed })
  const cube3 = useAnimatedCube({ initialState: initialStates[3], animationSpeed })
  const cubes = useMemo(() => [cube0, cube1, cube2, cube3], [cube0, cube1, cube2, cube3])

  // Check if any cube is animating
  const isAnimating = cubes.some(c => c.isAnimating || c.moveQueueLength > 0)

  // Track finished state
  const [isFinished, setIsFinished] = useState(false)
  const wasAnimatingRef = useRef(false)

  useEffect(() => {
    if (isAnimating) {
      wasAnimatingRef.current = true
    } else if (wasAnimatingRef.current) {
      wasAnimatingRef.current = false
      const timer = setTimeout(() => setIsFinished(true), 0)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Reset all cubes to their setup state
  const reset = useCallback((setupMoves: Move[][]) => {
    cubes.forEach((cube, i) => {
      cube.reset()
      cube.applyMovesInstantly(setupMoves[i])
    })
    setIsFinished(false)
  }, [cubes])

  // Play moves on all cubes (resets first, then queues)
  const play = useCallback((moves: Move[], setupMoves: Move[][]) => {
    cubes.forEach((cube, i) => {
      cube.reset()
      cube.applyMovesInstantly(setupMoves[i])
      cube.queueMoves(moves)
    })
  }, [cubes])

  return { cubes, isAnimating, isFinished, play, reset }
}
