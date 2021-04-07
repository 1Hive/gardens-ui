import { getNetwork } from './networks'

// rinkeby
const DEFAULT_CHAIN_ID = 100
const DEFAULT_CONVICTION_APP_NAME = 'conviction-beta'
const DEFAULT_VOTING_APP_NAME = 'dandelion-voting'
const DEFAULT_ISSUANCE_APP_NAME = 'issuance'

const ENV_VARS = {
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId
  },
  CONVICTION_APP_NAME() {
    return (
      process.env.REACT_APP_CONVICTION_APP_NAME || DEFAULT_CONVICTION_APP_NAME
    )
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  ISSUANCE_APP_NAME() {
    return process.env.REACT_APP_ISSUANCE_APP_NAME || DEFAULT_ISSUANCE_APP_NAME
  },
  ORG_ADDRESS() {
    return process.env.REACT_APP_ORG_ADDRESS || getNetwork().honeypot
  },
  VOTING_APP_NAME() {
    return process.env.REACT_APP_VOTING_APP_NAME || DEFAULT_VOTING_APP_NAME
  },
  INSTANCE() {
    return process.env.REACT_APP_APP_INSTANCE || ''
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
