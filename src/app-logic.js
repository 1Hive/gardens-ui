import { useMemo } from 'react'
import { useAppState } from './providers/AppState'
import { useProposals } from './hooks/useProposals'
import { useWallet } from './providers/Wallet'
import usePanelState from './hooks/usePanelState'
import useActions from './hooks/useActions'

import BigNumber from './lib/bigNumber'
import { addressesEqual } from './lib/web3-utils'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { account } = useWallet()

  const { isLoading, stakeToken } = useAppState()
  const [proposals, blockHasLoaded] = useProposals()
  const proposalPanel = usePanelState()

  const { myStakes, totalActiveTokens } = useMemo(() => {
    if (!stakeToken || !proposals) {
      return {
        myStakes: [],
        totalActiveTokens: new BigNumber('0'),
      }
    }

    return proposals.reduce(
      ({ myStakes, totalActiveTokens }, proposal) => {
        if (proposal.executed || !proposal.stakes) {
          return { myStakes, totalActiveTokens }
        }

        const totalActive = proposal.stakes.reduce((accumulator, stake) => {
          return accumulator.plus(stake.amount)
        }, new BigNumber('0'))

        totalActiveTokens = totalActiveTokens.plus(totalActive)

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
          totalActiveTokens,
        }
      },
      {
        myStakes: [],
        totalActiveTokens: new BigNumber('0'),
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
    totalActiveTokens,
  }
}
