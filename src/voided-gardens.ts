import { getNetworkType } from './utils/web3-utils'

const VOIDED_GARDENS: {
  [x: string]: Map<string, string>
} = {
  polygon: new Map([]),
  xdai: new Map([]),
  rinkeby: new Map([]),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
