import { getNetworkType } from './utils/web3-utils'

const VOIDED_GARDENS: {
  [x: string]: Map<string, string>
} = {
  polygon: new Map([]),
  xdai: new Map([
    ['0x9ceac080e12ab6700eef58c45fa02a50e8e2cd4b', '_'], 
    ['0xe01e4aca95dc1e51ce4d32ea3edc68f56bada5b9', '_'], 
    ['0xd006ab4235fa2c94889f0d884ebd92f33a4045e6', '_'],
    ['0x70a74a4130ae62d842ff97d70120bdb67cb10414', '_'],
    ['0xe943ac8e67611166d42b8b7c0ac29b0d025cfb9d', '_'],
    ['0xb4cc3b50a67918910189eeba48d426d5f23a6296', '_'],
  ]),
  rinkeby: new Map([]),
}

export function getVoidedGardensByNetwork() {
  return VOIDED_GARDENS[getNetworkType()]
}
