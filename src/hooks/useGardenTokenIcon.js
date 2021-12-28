import { useConnectedGarden } from '@providers/ConnectedGarden'

import { getGardenTokenIcon } from '../utils/token-utils'

export default function useGardenTokenIcon(token) {
  const connectedGarden = useConnectedGarden()
  return getGardenTokenIcon(connectedGarden, token)
}
