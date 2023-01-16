import { getNetworkType } from './utils/web3-utils'

const VOIDED_GARDENS: {
  [x: string]: Map<string, string>
} = {
  polygon: new Map([]),
  xdai: new Map([['0x9ceac080e12ab6700eef58c45fa02a50e8e2cd4b', '_']]),
  rinkeby: new Map([]),
  goerli: new Map([]),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()] // TODO Improv with if and return default value
}
