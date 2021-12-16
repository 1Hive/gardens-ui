import { formatDID, getImageURL } from '@self.id/framework'
import type { BasicProfile } from '@self.id/framework'

export const CERAMIC_NETWORK = 'testnet-clay'

export const IPFS_URL = 'https://ipfs.infura.io/ipfs/'

export function getProfileInfo(did: string, profile?: BasicProfile | null) {
  return {
    avatarSrc: getImageURL(IPFS_URL, profile?.image, { height: 60, width: 60 }),
    displayName: profile?.name ?? formatDID(did),
  }
}
