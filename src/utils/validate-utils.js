// eslint-disable-next-line no-useless-escape
const emailRegex = /^.+\@.+\..+$/

export function validateEmail(email) {
  return emailRegex.test(email)
}
