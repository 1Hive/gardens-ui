import React, { useCallback, useState } from 'react'

const STORAGE_KEY = 'selfID::'

export function useLocalStorage() {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn(`Unable to get ${STORAGE_KEY}`, error)
      return null
    }
  })

  const setValue = useCallback(
    value => {
      try {
        setStoredValue(value)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.warn(`Unable to set ${STORAGE_KEY}`, error)
      }
    },
    [STORAGE_KEY]
  )

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn(`Unable to remove ${STORAGE_KEY}`, error)
    }
  }, [STORAGE_KEY])

  return { storedValue, setValue, removeValue }
}
