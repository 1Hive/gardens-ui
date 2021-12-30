// export type BigNumber in types.ts

import BigNumber from 'bignumber.js'

BigNumber.config({ POW_PRECISION: 100 })

export function bigNum(x: number, y = 18) {
  return new BigNumber(x * 10 ** y)
}

export default BigNumber
