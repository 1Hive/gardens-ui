export const get = key =>
  typeof window === 'undefined' ? null : localStorage.getItem(key)

export const set = (key, value) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
}
export const remove = key => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}
