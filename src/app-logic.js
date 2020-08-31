import { useMemo } from 'react'
import { useAppState } from './providers/AppState'
import { useProposals } from './hooks/useProposals'
import { useWallet } from './providers/Wallet'
import usePanelState from './hooks/usePanelState'
import useActions from './hooks/useActions'
import { addressesEqual } from './lib/web3-utils'
import { PROPOSAL_STATUS_ACTIVE_STRING } from './constants'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { account } = useWallet()

  const { isLoading, stakeToken, totalStaked } = useAppState()

  const [proposals, blockHasLoaded] = useProposals()
  const proposalPanel = usePanelState()

  const { myStakes } = useMemo(() => {
    if (!stakeToken || !proposals) {
      return {
        myStakes: [],
      }
    }

    return proposals.reduce(
      ({ myStakes }, proposal) => {
        if (
          !proposal.status === PROPOSAL_STATUS_ACTIVE_STRING ||
          !proposal.stakes
        ) {
          return { myStakes }
        }

        const myStake = proposal.stakes.find(
          stake => addressesEqual(stake.entity, account) && stake.amount.gt(0)
        )

        if (myStake) {
          myStakes.push({
            proposalId: proposal.id,
            proposalName: proposal.name,
            amount: myStake.amount,
          })
        }

        return {
          myStakes,
        }
      },
      {
        myStakes: [],
      }
    )
  }, [account, proposals, stakeToken])

  const actions = useActions(proposalPanel.requestClose)

  return {
    actions,
    isLoading: isLoading || !blockHasLoaded,
    myStakes,
    proposals,
    proposalPanel,
    totalStaked,
  }
}
