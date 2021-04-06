import { toChecksumAddress } from 'web3-utils'
import env from '../environment'
import { getDefaultChain } from '../local-settings'

const DEFAULT_LOCAL_CHAIN = ''

export function encodeFunctionData(contract, functionName, params) {
  return contract.interface.encodeFunctionData(functionName, params)
}

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  return providers
}

export function isLocalOrUnknownNetwork(chainId = getDefaultChain()) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

export function getNetworkType(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'mainnet'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'
  if (chainId === '100') return 'xdai'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'
  if (chainId === '100') return 'xDai'

  return 'unknown'
}

// Check address equality with checksums
export function addressesEqual(first, second) {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'
const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index)
    )
}

export function addressesEqualNoSum(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

// Re-export some web3-utils functions
export { isAddress, toChecksumAddress, toUtf8, soliditySha3 } from 'web3-utils'
