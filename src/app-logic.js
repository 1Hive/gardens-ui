import { useMemo } from 'react'
import { useAppState } from './providers/AppState'
import usePanelState from './hooks/usePanelState'
import { useProposals } from './hooks/useProposals'
import { useWallet } from './providers/Wallet'
import BigNumber from './lib/bigNumber'
import useProposalActions from './hooks/useProposalActions'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { connectedAccount } = useWallet()

  const { isLoading, stakeToken } = useAppState()
  const [proposals] = useProposals()
  const proposalPanel = usePanelState()

  const { myStakes, totalActiveTokens } = useMemo(() => {
    if (!connectedAccount || !stakeToken || !proposals) {
      return { myStakes: [], totalActiveTokens: new BigNumber('0') }
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
          stake => stake.entity === connectedAccount
        )

        if (myStake) {
          myStakes.push({
            proposal: proposal.id,
            proposalName: proposal.name,
            stakedAmount: myStake.amount,
          })
        }
        return { myStakes, totalActiveTokens }
      },
      { myStakes: [], totalActiveTokens: new BigNumber('0') }
    )
  }, [proposals, connectedAccount, stakeToken])

  const actions = useProposalActions(proposalPanel.requestClose)

  return {
    actions,
    isLoading: isLoading,
    myStakes,
    proposals,
    proposalPanel,
    totalActiveTokens,
  }
}
