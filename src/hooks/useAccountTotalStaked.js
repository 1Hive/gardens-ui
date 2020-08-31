import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { addressesEqual } from '../lib/web3-utils'
import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'
import { PROPOSAL_STATUS_ACTIVE_STRING } from '../constants'

export default function useAccountTotalStaked() {
  const { proposals = [] } = useAppState()
  const { account } = useWallet()

  const totalStaked = useMemo(
    () =>
      proposals
        .filter(({ status }) => status === PROPOSAL_STATUS_ACTIVE_STRING)
        .reduce((acc, { stakes }) => {
          const myStake = stakes.find(({ entity }) =>
            addressesEqual(entity, account)
          )

          if (!myStake) {
            return acc
          }

          return acc.plus(myStake.amount)
        }, new BigNumber(0)),
    [proposals, account]
  )

  return totalStaked
}
