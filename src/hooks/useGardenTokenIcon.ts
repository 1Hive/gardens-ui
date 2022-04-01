import { useConnectedGarden } from '@providers/ConnectedGarden'
import { getGardenTokenIcon } from '../utils/token-utils'
import { TokenType } from '../types/app'

export default function useGardenTokenIcon(token: TokenType) {
  const connectedGarden = useConnectedGarden()
  return getGardenTokenIcon(connectedGarden, token)
}
