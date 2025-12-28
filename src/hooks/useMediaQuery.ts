import { useSyncExternalStore, useCallback } from 'react'

/**
 * Tailwind's default breakpoints - single source of truth.
 * Use these names with useMediaQuery hook or reference directly.
 */
const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const

export function useMediaQuery(query: keyof typeof BREAKPOINTS | string): boolean {
  const mediaQuery = BREAKPOINTS[query as keyof typeof BREAKPOINTS] ?? query

  const subscribe = useCallback((callback: () => void) => {
    const mql = window.matchMedia(mediaQuery)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }, [mediaQuery])

  const getSnapshot = useCallback(() => {
    return window.matchMedia(mediaQuery).matches
  }, [mediaQuery])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
