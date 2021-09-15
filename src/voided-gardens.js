import { getNetworkType } from './utils/web3-utils'

const XDAI_VOIDED = [['0x1baa8fd650c870fcfc773dd26e92b27b5b80d415', '_']]
const RINKEBY_VOIDED = []

const VOIDED_GARDENS = {
  xdai: new Map(XDAI_VOIDED),
  rinkeby: new Map(RINKEBY_VOIDED),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
