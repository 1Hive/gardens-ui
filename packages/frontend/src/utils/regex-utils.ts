export function regexToCheckValidProposalURL(proposalURLRegex: string) {
  return new RegExp(
    String.raw`(${proposalURLRegex}|https:\/\/discord\.com\/channels\/)`
  )
}
/**
 * Escape regex special chars addind backslash before each char.
 * @param toEscape - string to be escaped
 * @returns string safe to use in Regex
 */
export function escapeRegex(toEscape: string) {
  return toEscape.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}
