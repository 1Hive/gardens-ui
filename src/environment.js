const DEFAULT_AGENT_APP_NAME = 'agent'
const DEFAULT_AGREEMENT_APP_NAME = 'agreement'
const DEFAULT_CONVICTION_APP_NAME = 'disputable-conviction-voting'
const DEFAULT_HOOKED_TOKEN_MANAGER = 'wrappable-hooked-token-manager'
const DEFAULT_ISSUANCE_APP_NAME = 'dynamic-issuance'
const DEFAULT_MIDDLEWARE_ENDPOINT = 'https://dao-list-middleware.herokuapp.com'
const DEFAULT_VOTING_APP_NAME = 'disputable-voting'

const DEFAULT_XDAI_ETH_NODE_ENDPOINT = 'https://rpc.xdaichain.com'
const DEFAULT_POLYGON_ETH_NODE_ENDPOINT = 'https://polygon-rpc.com'

const ENV_VARS = {
  AGREEMENT_APP_NAME() {
    return (
      process.env.REACT_APP_AGREEMENT_APP_NAME || DEFAULT_AGREEMENT_APP_NAME
    )
  },
  ALCHEMY_API_KEY() {
    return process.env.REACT_APP_ALCHEMY_API_KEY || null
  },
  CONVICTION_APP_NAME() {
    return (
      process.env.REACT_APP_CONVICTION_APP_NAME || DEFAULT_CONVICTION_APP_NAME
    )
  },
  RINKEBY_ETH_NODE() {
    return process.env.REACT_APP_XDAI_ETH_NODE || ''
  },
  XDAI_ETH_NODE() {
    return process.env.REACT_APP_XDAI_ETH_NODE || DEFAULT_XDAI_ETH_NODE_ENDPOINT
  },
  POLYGON_ETH_NODE() {
    return (
      process.env.REACT_APP_POLYGON_ETH_NODE ||
      DEFAULT_POLYGON_ETH_NODE_ENDPOINT
    )
  },
  ETHERSCAN_API_KEY() {
    return process.env.REACT_APP_ETHERSCAN_API_KEY || null
  },
  PORTIS_ID() {
    return process.env.REACT_APP_PORTIS_ID || ''
  },
  GITHUB_API_TOKEN() {
    return process.env.REACT_APP_GITHUB_API_TOKEN || ''
  },
  HOOKED_TOKEN_MANAGER_APP_NAME() {
    return (
      process.env.REACT_APP_HOOKED_TOKEN_MANAGER_APP_NAME ||
      DEFAULT_HOOKED_TOKEN_MANAGER
    )
  },
  INFURA_API_KEY() {
    return process.env.REACT_APP_INFURA_API_KEY || null
  },
  ISSUANCE_APP_NAME() {
    return process.env.REACT_APP_ISSUANCE_APP_NAME || DEFAULT_ISSUANCE_APP_NAME
  },
  OWNER_REPO_DAO_LIST() {
    return process.env.REACT_APP_OWNER_REPO_DAO_LIST || null
  },
  PINATA_API_TOKEN() {
    return process.env.REACT_APP_PINATA_API_TOKEN || ''
  },
  POCKET_API_KEY() {
    return process.env.REACT_APP_POCKET_API_KEY || null
  },
  MIDDLEWARE_ENDPOINT() {
    return process.env.REACT_APP_MIDDLEWARE_ENDPOINT || DEFAULT_MIDDLEWARE_ENDPOINT
  },
  VERCEL_ENV() {
    return process.env.REACT_APP_VERCEL_ENV || null
  },
  VOTING_APP_NAME() {
    return process.env.REACT_APP_VOTING_APP_NAME || DEFAULT_VOTING_APP_NAME
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
