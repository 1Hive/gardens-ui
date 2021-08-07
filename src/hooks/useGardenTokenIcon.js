import { useGardens } from '@providers/Gardens'
import { getGardenTokenIcon } from '../utils/token-utils'

export default function useGardenTokenIcon(token) {
  const { connectedGarden } = useGardens()
  return getGardenTokenIcon(connectedGarden, token)
}
