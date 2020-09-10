import { useMemo } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'
import { PROPOSAL_STATUS_ACTIVE_STRING } from '../constants'

export function useMyStakes() {
  const { account } = useWallet()
  const { proposals, stakeToken } = useAppState()

  return useMemo(() => {
    if (!stakeToken || !proposals) {
      return []
    }

    return proposals.reduce((acc, proposal) => {
      if (
        !proposal.status === PROPOSAL_STATUS_ACTIVE_STRING ||
        !proposal.stakes
      ) {
        return acc
      }

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
    }, [])
  }, [account, proposals, stakeToken])
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
