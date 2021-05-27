import { addressesEqual } from '@1hive/1hive-ui'
import { useGardens } from '@providers/Gardens'
import { getLocalTokenIconBySymbol } from '@utils/token-utils'
import defaultTokenSvg from '@assets/defaultTokenLogo.svg'

export default function useGardenTokenIcon(token) {
  const { connectedGarden } = useGardens()
  if (connectedGarden) {
    if (addressesEqual(connectedGarden.token.id, token.id)) {
      return connectedGarden.token.logo || defaultTokenSvg
    }

    if (addressesEqual(connectedGarden.wrappableToken?.id, token.id)) {
      return connectedGarden.wrappableToken.logo || defaultTokenSvg
    }
  }

  // Look up in the local mapping
  return getLocalTokenIconBySymbol(token.symbol)
}
