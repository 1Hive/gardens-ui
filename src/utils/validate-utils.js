// eslint-disable-next-line no-useless-escape
const emailRegex = /^.+\@.+\..+$/
const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/
const twitterRegex = /^@?(\w){1,15}$/

export function validate(key, value = '') {
  const regex =
    key === 'email' ? emailRegex : key === 'github' ? githubRegex : twitterRegex

  return regex.test(value)
}
