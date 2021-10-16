import { getNetworkType } from './utils/web3-utils'

const XDAI_VOIDED = []
const RINKEBY_VOIDED = []

const VOIDED_GARDENS = {
  xdai: new Map(XDAI_VOIDED),
  rinkeby: new Map(RINKEBY_VOIDED),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
