import { getNetworkType } from './utils/web3-utils'

const POLYGON_VOIDED: [string, string][] = []
const XDAI_VOIDED: [string, string][] = [
  ['0x9ceac080e12ab6700eef58c45fa02a50e8e2cd4b', '_'],
]
const RINKEBY_VOIDED: [string, string][] = []

const VOIDED_GARDENS: {
  [x: string]: Map<string, string>
} = {
  polygon: new Map(POLYGON_VOIDED),
  xdai: new Map(XDAI_VOIDED),
  rinkeby: new Map(RINKEBY_VOIDED),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
