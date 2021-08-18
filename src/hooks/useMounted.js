import { useLayoutEffect, useRef, useCallback } from 'react'

// Simple hook for checking a component is mounted prior to an async state update
export function useMounted() {
  const mounted = useRef(true)

  const getMounted = useCallback(() => mounted.current, [])

  useLayoutEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  return getMounted
}
