import { useTheme } from '@1hive/1hive-ui'
import assets from '../utils/asset-utils'

export function useAsset(iconType) {
  const theme = useTheme()

  if (!iconType) {
    return ''
  }

  return assets[iconType][theme._appearance]
}
