import { getNetwork } from '@/networks'
import { addressesEqual, isAddress } from './web3-utils'

const DEFAULT_FORUM_URL = 'https://forum.1hive.org/'

export function getGardenLabel(address, gardens) {
  const garden = gardens?.find(garden =>
    addressesEqual(garden.address, address)
  )
  return garden?.name || address
}

export function getGardenForumUrl(metadata) {
  if (metadata.forum) {
    return metadata.forum
  }

  if (metadata.links) {
    const forumItem = Object.values(metadata.links)
      .map(linkTopic => Object.values(linkTopic))
      .flat()
      .find(({ label }) => label.toLowerCase() === 'forum')

    return forumItem?.link || DEFAULT_FORUM_URL
  }

  return DEFAULT_FORUM_URL
}

export function mergeGardenMetadata(garden, gardensMetadata) {
  const metadata =
    gardensMetadata?.find(dao => addressesEqual(dao.address, garden.id)) || {}

  const token = {
    ...garden.token,
    logo: metadata.token_logo,
    logoDark: metadata.token_logo_dark,
  }
  const wrappableToken = garden.wrappableToken
    ? {
        ...garden.wrappableToken,
        ...metadata.wrappableToken,
      }
    : null

  const forumURL = getGardenForumUrl(metadata)

  return {
    ...garden,
    ...metadata,
    address: garden.id,
    forumURL,
    token,
    wrappableToken,
  }
}

export function is1HiveGarden(gardenAddress, chainId) {
  if (!gardenAddress || !isAddress(gardenAddress) || !chainId) {
    return false
  }

  const network = getNetwork(chainId)
  return addressesEqual(gardenAddress, network.hiveGarden)
}
