const GARDEN_PATH_REGEX = /(.*?garden\/0x[0-9a-zA-Z]{40}).*/ // TODO: Update when aragonIds supported

export function buildGardenPath(location, relativePath) {
  const basePath = location.pathname.replace(GARDEN_PATH_REGEX, '$1')
  return `${basePath}/${relativePath}`
}
