import { useCallback, useMemo, useState } from 'react'
import BigNumber from './lib/bigNumber'
import { toDecimals } from './lib/math-utils'
import { toHex } from 'web3-utils'
import { useWallet } from './providers/Wallet'
import { useProposals } from './hooks/useProposals'
import { useAppState } from './providers/AppState'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { connectedAccount, ethers } = useWallet()

  const {
    organization,
    convictionApp,
    isLoading,
    requestToken,
    stakeToken,
  } = useAppState()
  const [proposals] = useProposals()
  const [proposalPanel, setProposalPanel] = useState(false)

  const onNewProposal = useCallback(
    async ({ title, link, amount, beneficiary }) => {
      const { decimals } = requestToken
      const decimalAmount = toDecimals(amount.trim(), decimals).toString()

      const intent = organization.appIntent(
        convictionApp.appAddress,
        'addProposal',
        [title, toHex(link), decimalAmount, beneficiary]
      )

      const txPath = await intent.paths(connectedAccount)

      const { to, data } = txPath.transactions[0]
      ethers.getSigner().sendTransaction({ data, to })

      setProposalPanel(false)
    },
    [connectedAccount, convictionApp, ethers, requestToken, organization]
  )

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

  return {
    proposals,
    isLoading: isLoading,
    onNewProposal,
    proposalPanel,
    setProposalPanel,
    myStakes,
    totalActiveTokens,
  }
}
