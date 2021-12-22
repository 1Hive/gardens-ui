import { getNetworkType } from './utils/web3-utils'

const POLYGON_VOIDED = []
const XDAI_VOIDED = [['0x9ceac080e12ab6700eef58c45fa02a50e8e2cd4b', '_']]
const RINKEBY_VOIDED = []

const VOIDED_GARDENS = {
  polygon: new Map(POLYGON_VOIDED),
  xdai: new Map(XDAI_VOIDED),
  rinkeby: new Map(RINKEBY_VOIDED),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
