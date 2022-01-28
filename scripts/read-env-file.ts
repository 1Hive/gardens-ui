import { readFile } from 'fs'
import { isAbsolute, resolve } from 'path'

export interface EnvVars {
  [key: string]: string | undefined
}

function mapToObject(map: Map<string, string>) {
  const arr = [...map.entries()]
  return arr.reduce((carrier: any, entry) => {
    const [k, v] = entry
    carrier[k] = v
    return carrier
  }, {})
}

function isValueQuoted(value: string): boolean {
  return ["'", '"', '`'].some((quote) => {
    return value.startsWith(quote) && value.endsWith(quote)
  })
}

function stripSurroundingQuotes(value: string): string {
  let result = value
  if (isValueQuoted(value)) {
    result = value.slice(1, value.length - 1)
  }
  return result
}

function normalizePath(path?: string): string {
  path = path || resolve(process.cwd(), '.env')
  return isAbsolute(path) ? path : resolve(process.cwd(), path)
}

function checkInvalidFormat(key: string, value: string, index: number) {
  const undef = !key
  const quoted = isValueQuoted(value)

  const invalidSpace = /\s/.test(key) || (!quoted && /\s/.test(value))
  const multiAssign = !quoted && value.split('=').length > 1

  /* No key, No value, Key OR Value contain a space */
  if (undef || invalidSpace || multiAssign) {
    let reason
    if (undef) reason = `${key ? 'value' : 'key'} undefined`
    else if (invalidSpace) reason = 'invalid spacing'
    else if (multiAssign) reason = 'multiple assignment operators'
    throw new Error(`FORMAT:${reason}:${index + 1}`)
  }
}

function makeVarsMap(lines: string[]) {
  const map = new Map()
  lines.forEach((line, index) => {
    line = line.trim()
    /* Skip empty and commented lines, preserving index for line count */
    if (line.length === 0 || line[0] === '#') return

    const splitLine = line.split('=')
    const key = (splitLine[0] || '').trim()
    const value = (splitLine.slice(1).join('=') || '').trim()

    /* Check some error conditions and throw if met */
    checkInvalidFormat(key, value, index)

    /* If value was quoted, the asigned value should not include the quotes */
    const mapValue = stripSurroundingQuotes(value)

    map.set(key, mapValue)
  })
  return map
}

function processContent(path: string, content: string) {
  try {
    const lines = content.split('\n')
    const map = makeVarsMap(lines)
    return mapToObject(map)
  } catch (error) {
    const message = (error as any)?.message || ''
    let err
    if (message.includes('FORMAT:')) {
      const splitMsg = message.split(':').slice(1)
      const reason = splitMsg[0]
      const line = parseInt(splitMsg[1], 10)
      err = new Error(`Invalid file format (${reason}) at ${path}:${line}`)
    } else err = error
    throw err
  }
}

/**
 * Given a path to a file in .env format, returns key/value pairs in an object.
 * @param {string} [path] The file path to read. If omitted, attempts to read from `./.env`
 * @returns {Promise<EnvVars>} An object of corresponding key/value pairs
 * @throws Error if file is not in valid format, or file is not found
 */
export async function readSingle(path?: string): Promise<EnvVars> {
  const file = normalizePath(path)
  return new Promise((resolve, reject) => {
    readFile(file, { encoding: 'utf8' }, (err, content) => {
      if (err) reject(err)
      try {
        resolve(processContent(file, content))
      } catch (error) {
        reject(error)
      }
    })
  })
}
