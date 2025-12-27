import { useEffect, RefObject } from 'react'

export interface UseClickOutsideOptions {
  /** Ref to the container element */
  containerRef: RefObject<HTMLElement | null>
  /** Callback when clicking outside the container */
  onClickOutside: () => void
  /** Whether the click-outside detection is enabled */
  enabled?: boolean
  /** Elements to ignore (selectors like 'nav', 'header', 'input') */
  ignoreSelectors?: string[]
}

/**
 * Hook to detect clicks outside a container element.
 * Used for closing expanded cards, dropdowns, modals, etc.
 */
export function useClickOutside({
  containerRef,
  onClickOutside,
  enabled = true,
  ignoreSelectors = ['nav', 'header', 'input'],
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) return

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return

      const target = e.target as HTMLElement

      // Don't trigger if clicking on ignored elements
      for (const selector of ignoreSelectors) {
        if (target.closest(selector)) {
          return
        }
      }

      // Trigger if clicking outside the container
      if (!containerRef.current.contains(target)) {
        onClickOutside()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [containerRef, onClickOutside, enabled, ignoreSelectors])
}

/**
 * Hook to close something on Escape key press.
 */
export function useEscapeKey(onEscape: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if focus is in an input
      if (e.key === 'Escape' && !(e.target instanceof HTMLInputElement)) {
        onEscape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, enabled])
}
