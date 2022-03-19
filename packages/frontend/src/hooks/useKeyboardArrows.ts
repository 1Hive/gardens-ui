import { useCallback, useEffect } from 'react'

const KEYCODES = {
  enter: 13,
  esc: 27,
  up: 38,
  left: 37,
  down: 40,
  right: 39,
}

type useArrowsProps = {
  onUp: () => void
  onLeft: () => void
  onDown: () => void
  onRight: () => void
}

export default function useArrows({
  onUp,
  onLeft,
  onDown,
  onRight,
}: useArrowsProps) {
  useEffect(() => {
    const actions: Array<{
      key: number
      cb: () => void
    }> = [
      { key: KEYCODES.up, cb: onUp },
      { key: KEYCODES.left, cb: onLeft },
      { key: KEYCODES.down, cb: onDown },
      { key: KEYCODES.right, cb: onRight },
    ]

    const onKeyDown = (e: KeyboardEvent) => {
      for (const { key, cb } of actions) {
        if (cb && e.keyCode === key) {
          e.preventDefault()
          cb()
          break
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onUp, onLeft, onDown, onRight])
}

export function useEsc(callback: () => void) {
  const handlekeyDown = useCallback(
    e => {
      if (e.keyCode === KEYCODES.esc) {
        callback()
      }
    },
    [callback]
  )
  useEffect(() => {
    window.addEventListener('keydown', handlekeyDown)
    return () => window.removeEventListener('keydown', handlekeyDown)
  }, [handlekeyDown])
}

export function useEnterKey(callback: () => void) {
  const handleKeyPress = useCallback(
    ({ keyCode }) => {
      if (keyCode === KEYCODES.enter) {
        callback()
      }
    },
    [callback]
  )

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])
}
