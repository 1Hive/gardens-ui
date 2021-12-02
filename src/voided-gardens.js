import { getNetworkType } from './utils/web3-utils'

const POLYGON_VOIDED = []
const XDAI_VOIDED = []
const RINKEBY_VOIDED = []

const VOIDED_GARDENS = {
  polygon: new Map(POLYGON_VOIDED),
  xdai: new Map(XDAI_VOIDED),
  rinkeby: new Map(RINKEBY_VOIDED),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
