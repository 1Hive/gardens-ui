import { useCallback, useState } from 'react'

// Simple hook for performing Spring animations immediately
export function useDisableAnimation() {
  const [animationDisabled, setAnimationDisabled] = useState(true)

  const enableAnimation = useCallback(() => {
    if (animationDisabled) {
      setAnimationDisabled(false)
    }
  }, [animationDisabled])

  return [animationDisabled, enableAnimation]
}
