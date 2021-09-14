import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { round } from './math-utils'

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const KNOWN_FORMATS = {
  onlyDate: 'DD/MM/YYYY',
  iso: 'YYYY-MM-DD',
  custom: 'DD MMMM HH:mm',
}

// dayjs plugins
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

function dateFormat(date, format = 'onlyDate') {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

function durationTime(seconds) {
  return dayjs.duration(seconds, 'seconds').humanize()
}
const toMs = seconds => seconds * 1000

function durationToHours(duration) {
  return round(dayjs.duration(duration).asHours())
}

export function noop() {}

export function toMilliseconds(seconds) {
  return parseInt(seconds) * 1000
}

// Displays the difference between two dates
function getRelativeTime(from, to) {
  return dayjs(to)
    .from(from)
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim()
}

export {
  dayjs,
  dateFormat,
  durationTime,
  getRelativeTime,
  toMs,
  durationToHours,
}
