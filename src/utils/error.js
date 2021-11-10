export const getErrorMessage = e => {
  if (typeof e === 'string') return e
  if ('message' in e) return e.message

  return null
}
