import {
  useState, useCallback, useEffect, useRef,
} from 'react'
import { CubeState, Move } from '../types/cubeState'
import { createSolvedCube, applyMove } from '../utils/cubeState'

interface UseAnimatedCubeOptions {
  initialState?: CubeState
  animationSpeed?: number // ms per move
}

interface UseAnimatedCubeReturn {
  cubeState: CubeState
  currentMove: Move | null
  isAnimating: boolean
  animationSpeed: number
  queueMoves: (moves: Move[]) => void
  queueMove: (move: Move) => void
  handleAnimationEnd: () => void
  reset: () => void
  setAnimationSpeed: (speed: number) => void
  clearQueue: () => void
  moveQueueLength: number
}

export function useAnimatedCube(options: UseAnimatedCubeOptions = {}): UseAnimatedCubeReturn {
  const {
    initialState = createSolvedCube(),
    animationSpeed: defaultSpeed = 300,
  } = options

  const [cubeState, setCubeState] = useState<CubeState>(initialState)
  const [moveQueue, setMoveQueue] = useState<Move[]>([])
  const [currentMove, setCurrentMove] = useState<Move | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(defaultSpeed)

  // Use ref to track if we're currently processing to prevent race conditions
  const isProcessingRef = useRef(false)

  // Start animation for next move when queue has items and not currently animating
  useEffect(() => {
    if (!isAnimating && moveQueue.length > 0 && !isProcessingRef.current) {
      isProcessingRef.current = true
      const [next, ...rest] = moveQueue
      // Wrap in RAF to avoid synchronous setState in effect
      const raf = requestAnimationFrame(() => {
        setCurrentMove(next)
        setMoveQueue(rest)
        setIsAnimating(true)
        isProcessingRef.current = false
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [isAnimating, moveQueue])

  // Handle animation end - apply the move and immediately start next if available
  const handleAnimationEnd = useCallback(() => {
    if (currentMove) {
      setCubeState(prev => applyMove(prev, currentMove))

      // Check if there's a next move in the queue
      setMoveQueue(prev => {
        if (prev.length > 0) {
          // Immediately start the next move without going through idle state
          const [next, ...rest] = prev
          setCurrentMove(next)
          // Keep isAnimating true - no flash
          return rest
        } else {
          // No more moves, go to idle
          setCurrentMove(null)
          setIsAnimating(false)
          return prev
        }
      })
    }
  }, [currentMove])

  // Queue multiple moves
  const queueMoves = useCallback((moves: Move[]) => {
    if (moves.length > 0) {
      setMoveQueue(prev => [...prev, ...moves])
    }
  }, [])

  // Queue a single move
  const queueMove = useCallback((move: Move) => {
    setMoveQueue(prev => [...prev, move])
  }, [])

  // Reset cube to solved state
  const reset = useCallback(() => {
    setCubeState(createSolvedCube())
    setMoveQueue([])
    setCurrentMove(null)
    setIsAnimating(false)
  }, [])

  // Clear the move queue (but finish current animation)
  const clearQueue = useCallback(() => {
    setMoveQueue([])
  }, [])

  return {
    cubeState,
    currentMove,
    isAnimating,
    animationSpeed,
    queueMoves,
    queueMove,
    handleAnimationEnd,
    reset,
    setAnimationSpeed,
    clearQueue,
    moveQueueLength: moveQueue.length,
  }
}
