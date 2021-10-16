import { useCallback, useEffect } from 'react'
import keycodes from '../keycodes'

export default function useArrows({ onUp, onLeft, onDown, onRight } = {}) {
  useEffect(() => {
    const actions = [
      [keycodes.up, onUp],
      [keycodes.left, onLeft],
      [keycodes.down, onDown],
      [keycodes.right, onRight],
    ]
    const onKeyDown = e => {
      for (const [keyCode, cb] of actions) {
        if (cb && e.keyCode === keyCode) {
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

export function useEsc(cb) {
  const handlekeyDown = useCallback(
    e => {
      if (e.keyCode === keycodes.esc) {
        cb()
      }
    },
    [cb]
  )
  useEffect(() => {
    window.addEventListener('keydown', handlekeyDown)
    return () => window.removeEventListener('keydown', handlekeyDown)
  }, [handlekeyDown])
}

export function useEnterKey(cb) {
  const handleKeyPress = useCallback(
    ({ keyCode }) => {
      if (keyCode === keycodes.enter) {
        cb()
      }
    },
    [cb]
  )

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])
}
