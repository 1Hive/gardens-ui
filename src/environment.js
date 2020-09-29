import { getNetwork } from './networks'

// rinkeby
const DEFAULT_CHAIN_ID = 100
const DEFAULT_APP_NAME = 'conviction-beta'

const ENV_VARS = {
  APP_NAME() {
    return process.env.REACT_APP_APP_NAME || DEFAULT_APP_NAME
  },

  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  ORG_ADDRESS() {
    return process.env.REACT_APP_ORG_ADDRESS || getNetwork().honeypot
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
