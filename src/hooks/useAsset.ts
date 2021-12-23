import { useTheme } from '@1hive/1hive-ui'

import { GardenActionTypes } from '@/actions/garden-action-types'

import assets from '../utils/asset-utils'

export function useAsset(iconType: GardenActionTypes) {
  if (!iconType) {
    return ''
  }
  const theme = useTheme()
  const appearance: 'light' | 'dark' = theme._appearance

  return assets[iconType]?.[appearance]
}
