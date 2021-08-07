export const MINUTE_IN_SECONDS = 60
export const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
export const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24
export const YEARS_IN_SECONDS = 365 * DAY_IN_SECONDS

// Make a list in the Oxford comma style (eg "a, b, c, and d")
export const toOxford = (arr, conjunction = 'and', ifempty = '') => {
  const l = arr.length

  if (!l) {
    return ifempty
  }
  if (l < 2) {
    return arr[0]
  }
  if (l < 3) {
    return arr.join(` ${conjunction} `)
  }

  arr = arr.slice()
  arr[l - 1] = `${conjunction} ${arr[l - 1]}`

  return arr.join(', ')
}

export const mimeToExtension = mime => {
  switch (mime) {
    case 'text/markdown':
      return '.md'
    case 'text/plain':
      return '.txt'
    case 'image/png':
      return '.png'
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg'
    default:
      return mime
  }
}

export const readFile = (reader, file) => {
  switch (file.type) {
    case 'text/txt':
    case 'text/md':
      reader.readAsText(file)
      return
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/png':
      reader.readAsDataURL(file)
      return
    default:
      reader.readAsText(file)
  }
}
