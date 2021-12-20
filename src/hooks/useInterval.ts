import { useEffect, useRef } from 'react'

export default function useInterval(
  callback: () => void,
  delay: number,
  runBeforeInterval: boolean
) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      typeof savedCallback.current === 'function'
        ? savedCallback.current()
        : null
    }

    if (delay !== null) {
      if (runBeforeInterval) tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay, runBeforeInterval])
}
