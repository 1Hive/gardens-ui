import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useAppTheme } from '@/providers/AppTheme'
import { getGardenTokenIcon } from '../utils/token-utils'
import { TokenType } from '../types/app'

export default function useGardenTokenIcon(token: TokenType) {
  const connectedGarden = useConnectedGarden()
  const { appearance } = useAppTheme()
  return getGardenTokenIcon(connectedGarden, token, appearance)
}
