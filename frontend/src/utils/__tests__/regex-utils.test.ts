import { escapeRegex, regexToCheckValidProposalURL } from '@utils/regex-utils'

describe('Test regexToCheckValidProposalURL()', () => {
  it('should test https://forum.1hive.org/ and pass', () => {
    const regex = regexToCheckValidProposalURL('https://forum.1hive.org/')

    expect(regex.test('http://forum.1hive.org/')).toBeFalsy()
    expect(regex.test('http://forum.1hive.org')).toBeFalsy()
    expect(regex.test('https://forum.1hive.org/')).toBeTruthy()
    expect(regex.test('https://forum.1hive.org')).toBeFalsy()
  })
})
describe('Escape all Regex symbols with escapeRegex()', () => {
  it('should escape - / ^ $ * + ? . ( ) \\ { }', () => {
    const escape1 = escapeRegex('https://forum.1hive.org/')
    const escape2 = escapeRegex('(forum.*?).1hive.org/')
    expect(escape1).toBe('https:\\/\\/forum\\.1hive\\.org\\/')
    expect(escape2).toBe('\\(forum\\.\\*\\?\\)\\.1hive\\.org\\/')
  })
})
