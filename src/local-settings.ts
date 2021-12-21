/* eslint-disable no-empty */
import { DEFAULT_CHAIN_ID } from '@/constants'
const APP_THEME = 'THEME'
const PREFERRED_CHAIN_ID_KEY = 'CHAIN_ID'

// Get a setting from localStorage
function getLocalStorageSetting(confKey: string) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.getItem(storageKey)
}

function setLocalSetting(confKey: string, value: string) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.setItem(storageKey, value)
}

export function getPreferredChain() {
  return (
    Number(getLocalStorageSetting(PREFERRED_CHAIN_ID_KEY)) || DEFAULT_CHAIN_ID
  )
}

export function setPreferredChain(chainId = 100) {
  return setLocalSetting(PREFERRED_CHAIN_ID_KEY, String(chainId))
}

export function getAppTheme() {
  const storedAppTheme = getLocalStorageSetting(APP_THEME)
  if (storedAppTheme) {
    try {
      return JSON.parse(storedAppTheme)
    } catch (err) {}
  }
  return {
    // To be replaced by an “auto” state
    appearance: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    theme: null,
  }
}

export function setAppTheme(appearance: string, theme = null) {
  return setLocalSetting(APP_THEME, JSON.stringify({ appearance, theme }))
}
