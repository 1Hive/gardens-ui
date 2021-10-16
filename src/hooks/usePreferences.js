import { useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Preferences base query string
const GLOBAL_PREFERENCES_QUERY_PARAM = '?preferences='

export function getPreferencesSearch(screen) {
  return `${GLOBAL_PREFERENCES_QUERY_PARAM}${screen}`
}

function parsePreferences(search = '') {
  const searchParams = new URLSearchParams(search)

  return {
    screen: searchParams.get('preferences'),
  }
}

/**
 * Hook to interact with the preferences
 * @returns {Array} [open preferences handler, close preferences handler, current preference screen]
 */
export default function usePreferences() {
  // We need to keep track of the path where the preference was called in order to return to the same path when the preference modal is closed
  const { pathname: basePath, search } = useLocation()
  const history = useHistory()

  const { screen } = parsePreferences(search)

  const preferenceScreen = useRef(screen)

  const handleOpenPreferences = useCallback(
    screen => {
      preferenceScreen.current = screen
      const fullPath = basePath + getPreferencesSearch(preferenceScreen.current)
      history.push(fullPath)
    },
    [basePath, history]
  )

  const handleClosePreferences = useCallback(() => {
    preferenceScreen.current = ''
    history.push(basePath)
  }, [basePath, history])

  return [
    handleOpenPreferences,
    handleClosePreferences,
    preferenceScreen.current,
  ]
}
