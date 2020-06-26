import env from './environment'

const APP_THEME = 'THEME'
const DEFAULT_CHAIN_ID = 'CHAIN_ID'

// Get a setting from localStorage
function getLocalStorageSetting(confKey) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.getItem(storageKey)
}

function setLocalSetting(confKey, value) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.setItem(storageKey, value)
}

export function getDefaultChain() {
  return Number(env(DEFAULT_CHAIN_ID)) || ''
}

export function setDefaultChain(chainId) {
  return setLocalSetting(DEFAULT_CHAIN_ID, chainId)
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

export function setAppTheme(appearance, theme = null) {
  return setLocalSetting(APP_THEME, JSON.stringify({ appearance, theme }))
}
