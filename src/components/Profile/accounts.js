const twitterMessage = did => {
  return `This tweet links my Twitter to my 3ID ${did} on 3Box ✅`
}

const githubMessage = did => {
  return `This post links my 3Box profile to my Github account! Web3 social profiles by 3Box. ✅ ${did} ✅`
}

const ACCOUNTS_MAPPING = new Map([
  [
    'twitter',
    {
      verificationActionDescription:
        'Tweet a unique key from the account you want to connect',
      verificationActionLabel: 'Tweet this',
      verificationActionUrl: did =>
        `https://twitter.com/intent/tweet?text=${twitterMessage(did)}`,
    },
  ],
  [
    'github',
    {
      message: githubMessage,
    },
  ],
])

export function getAccountAttributes(account) {
  return ACCOUNTS_MAPPING.get(account) || {}
}
