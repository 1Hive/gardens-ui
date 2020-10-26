const NUMBER_CHARACTERS = 3
/*
  It takes the initial characters of a search term and compares it to text value
  so we can get refined search results.  
*/
export function checkInitialLetters(text, searchTerm) {
  const str = text.substring(0, NUMBER_CHARACTERS)

  // Transform regex special characters into a '_' for easy reference.
  // eslint-disable-next-line
  searchTerm = searchTerm.replace(/[\*\[\(\)\\+\]]/g, ' ')

  const pattern = searchTerm
    .split('')
    .map(char => `(?=.*${char})`)
    .join('')
  const regex = new RegExp(`${pattern}`, 'g')

  return str.match(regex)
}
