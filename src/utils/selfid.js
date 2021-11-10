import { Core } from '@self.id/core'

import { CERAMIC_ENDPOINT } from '@/endpoints'
import env from '@/environment'

let selfId

export const getSelfIdCore = () => {
  if (selfId) {
    return selfId
  }
  selfId = new Core({ ceramic: CERAMIC_ENDPOINT })
  return selfId
}

export const addressToCaip10String = (address, chainId = env('CHAIN_ID')) =>
  `${address.toLowerCase()}@eip155:${chainId}`

export const getIpfsUrl = (hash, ipfsEndpoint = 'https://gateway.ipfs.io') =>
  `${ipfsEndpoint}/ipfs/${hash.slice(7)}`

export const getSelfIdImageUrl = (image, ipfsEndpoint) =>
  image?.original?.src ? getIpfsUrl(image.original.src, ipfsEndpoint) : ''

export const getSelfIdProfileLink = did => `https://self.id/${did}`
