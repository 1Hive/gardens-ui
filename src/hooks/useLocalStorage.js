import { useCallback, useState } from 'react'

import * as storage from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.get(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Unable to get ${key}`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    value => {
      try {
        setStoredValue(value)
        storage.set(key, JSON.stringify(value))
      } catch (error) {
        console.warn(`Unable to set ${key}`, error)
      }
    },
    [key]
  )

  const removeValue = useCallback(() => {
    try {
      storage.remove(key)
    } catch (error) {
      console.warn(`Unable to remove ${key}`, error)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}
