import { getProfile, getVerifiedAccounts, openBox } from '3box'

import { GITHUB_ENDPOINT, IPFS_ENDPOINT, TWITTER_ENDPOINT } from '../endpoints'

const VERIFIED_ACCOUNTS = {
  github: { endpoint: GITHUB_ENDPOINT, icon: '/icons/base/github.svg' },
  twitter: {
    endpoint: TWITTER_ENDPOINT,
    icon: '/icons/base/twitter.svg',
  },
}

export async function getAccountPrivateData(box) {
  const birthday = await box.private.get('birthday')
  const email = await box.verified.email()

  return { birthday, email: email?.email_address }
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
  let coverPhoto, image

  if (profile.coverPhoto?.length > 0) {
    coverPhoto = `${IPFS_ENDPOINT.read}/${profile.coverPhoto[0].contentUrl['/']}`
  }

  if (profile.image?.length > 0) {
    image = `${IPFS_ENDPOINT.read}/${profile.image[0].contentUrl['/']}`
  }

  const parsedVerifiedAccounts = parseVerifiedAccounts(verifiedAccounts)

  return {
    ...profile,
    coverPhoto,
    image,
    profileExists: Boolean(Object.keys(profile).length),
    verifiedAccounts: parsedVerifiedAccounts,
  }
}

function parseVerifiedAccounts(verifiedAccounts) {
  return Object.entries(verifiedAccounts).reduce(
    (acc, [platformKey, account]) => {
      const platform = VERIFIED_ACCOUNTS[platformKey]
      if (platform) {
        return {
          ...acc,
          [platformKey]: {
            icon: platform.icon,
            url: `${platform.endpoint}${account.username}`,
            username: account.username,
          },
        }
      }

      return acc
    },
    null
  )
}
