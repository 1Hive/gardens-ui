import { useCallback, useRef } from 'react'
import { useRouter } from 'next/router'

// Preferences base query string
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences='

export function getPreferencesSearch(screen: string | null) {
  return `${GLOBAL_PREFERENCES_QUERY_PARAM}${screen}`
}

/**
 * Hook to interact with the preferences
 * @returns {Array} [open preferences handler, close preferences handler, current preference screen]
 */
export default function usePreferences() {
  // We need to keep track of the path where the preference was called in order to return to the same path when the preference modal is closed
  const router = useRouter()
  const basePath = router.pathname
  const screen: any = router.query?.preferences ?? ''

  const preferenceScreen = useRef(screen)

  const handleOpenPreferences = useCallback(
    (screen) => {
      preferenceScreen.current = screen
      const fullPath = basePath + getPreferencesSearch(preferenceScreen.current)
      router.push(fullPath)
    },
    [basePath, router]
  )

  const handleClosePreferences = useCallback(() => {
    preferenceScreen.current = ''
    router.push(basePath)
  }, [basePath, router])

  return [
    handleOpenPreferences,
    handleClosePreferences,
    preferenceScreen.current,
  ]
}
