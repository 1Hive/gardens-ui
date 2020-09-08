import { useMemo } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'

// TODO: See how to merge it with the implementation done at app-logic
export function useMyStakes() {
  const { account } = useWallet()
  const { proposals } = useAppState()

  return useMemo(
    () =>
      proposals.reduce((acc, proposal) => {
        const myStake = proposal.stakes.find(
          stake => addressesEqual(stake.entity, account) && stake.amount.gt(0)
        )

        if (!myStake) {
          return acc
        }

        return [
          ...acc,
          {
            proposalId: proposal.id,
            proposalName: proposal.name,
            amount: myStake.amount,
          },
        ]
      }, []),
    [account, proposals]
  )
}

export function useMyStakesHistory() {
  const { account } = useWallet()
  const { proposals, stakesHistory } = useAppState()

  return useMemo(
    () =>
      stakesHistory
        .filter(stake => addressesEqual(stake.entity, account))
        .map(stake => {
          const proposal = proposals.find(
            proposal => proposal.id === stake.proposalId
          )

          return { ...stake, proposalName: proposal?.name }
        }),
    [account, proposals, stakesHistory]
  )
}
