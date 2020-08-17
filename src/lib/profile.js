import { getProfile, getVerifiedAccounts, openBox } from '3box'

import { GITHUB_ENDPOINT, IPFS_ENDPOINT, TWITTER_ENDPOINT } from '../endpoints'
import githubSvg from '../assets/github.svg'
import twitterSvg from '../assets/twitter.svg'

const VERIFIED_ACCOUNTS = {
  github: { endpoint: GITHUB_ENDPOINT, icon: githubSvg },
  twitter: {
    endpoint: TWITTER_ENDPOINT,
    icon: twitterSvg,
  },
}

export async function getAccountPrivateData(box) {
  const birthday = await box.private.get('birthday')
  const email = await box.private.get('email')

  return { birthday, email }
}

export async function getProfileForAccount(account) {
  if (!account) {
    return null
  }

  const profile = await getProfile(account)
  const verifiedAccounts = await getVerifiedAccounts(profile)
  return parseProfileData(profile, verifiedAccounts)
}

export function openBoxForAccount(account, provider) {
  return openBox(account, provider)
}

// parsers
function parseProfileData(profile, verifiedAccounts) {
  let image

  if (profile.image.length > 0) {
    image = `${IPFS_ENDPOINT}/${profile.image[0].contentUrl['/']}`
  }

  const parsedVerifiedAccounts = parseVerifiedAccounts(verifiedAccounts)

  return { ...profile, image, verifiedAccounts: parsedVerifiedAccounts }
}

function parseVerifiedAccounts(verifiedAccounts) {
  return Object.entries(verifiedAccounts).reduce(
    (acc, [platformKey, account]) => {
      const platform = VERIFIED_ACCOUNTS[platformKey]
      if (platform) {
        return [
          ...acc,
          {
            icon: platform.icon,
            url: `${platform.endpoint}${account.username}`,
            username: account.username,
          },
        ]
      }

      return acc
    },
    []
  )
}
