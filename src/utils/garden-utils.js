import { addressesEqual } from './web3-utils'

const DEFAULT_FORUM_URL = 'https://forum.1hive.org/'

export function getGardenLabel(address, gardens) {
  const dao = gardens.find(dao => addressesEqual(dao.address, address))
  return dao?.name || address
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
