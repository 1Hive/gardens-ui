// rinkeby
const DEFAULT_CHAIN_ID = 100

const DEFAULT_AGREEMENT_APP_NAME = 'agreement'
const DEFAULT_CONVICTION_APP_NAME = 'disputable-conviction-voting'
const DEFAULT_HOOKED_TOKEN_MANAGER = 'wrappable-hooked-token-manager'
const DEFAULT_ISSUANCE_APP_NAME = 'dynamic-issuance'
const DEFAULT_VOTING_APP_NAME = 'disputable-voting'

const ENV_VARS = {
  AGREEMENT_APP_NAME() {
    return (
      process.env.REACT_APP_AGREEMENT_APP_NAME || DEFAULT_AGREEMENT_APP_NAME
    )
  },
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId
  },
  CONVICTION_APP_NAME() {
    return (
      process.env.REACT_APP_CONVICTION_APP_NAME || DEFAULT_CONVICTION_APP_NAME
    )
  },
  ETH_NODE() {
    return process.env.REACT_APP_ETH_NODE || ''
  },
  INTERCOM_APP_ID() {
    return process.env.REACT_APP_INTERCOM_APP_ID || ''
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  INSTANCE() {
    return process.env.REACT_APP_APP_INSTANCE || ''
  },
  ISSUANCE_APP_NAME() {
    return process.env.REACT_APP_ISSUANCE_APP_NAME || DEFAULT_ISSUANCE_APP_NAME
  },
  VOTING_APP_NAME() {
    return process.env.REACT_APP_VOTING_APP_NAME || DEFAULT_VOTING_APP_NAME
  },
  HOOKED_TOKEN_MANAGER_APP_NAME() {
    return (
      process.env.REACT_APP_HOOKED_TOKEN_MANAGER_APP_NAME ||
      DEFAULT_HOOKED_TOKEN_MANAGER
    )
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
