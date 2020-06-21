import { useState, useMemo } from 'react'
import BigNumber from './lib/bigNumber'
import { useAppState } from '@aragon/api-react'
import { toDecimals } from './lib/math-utils'
import { toHex } from 'web3-utils'
import { useProposals } from './hooks/useProposals'
import { useAppData } from './hooks/useAppData'
import { useWallet } from 'use-wallet'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { connectedAccount } = useWallet()

  const { stakeToken, requestToken, isSyncing } = useAppState()
  const [proposals, blockHasLoaded] = useProposals()
  const [proposalPanel, setProposalPanel] = useState(false)

  const { organization, convictionApp } = useAppData()

  const onProposalSubmit = async ({ title, link, amount, beneficiary }) => {
    const decimals = parseInt(requestToken.decimals)
    const decimalAmount = toDecimals(amount.trim(), decimals).toString()

    const intent = organization.appIntent(
      convictionApp.appAddress,
      'addProposal',
      [title, toHex(link), decimalAmount, beneficiary]
    )

    // const intent = org.appIntent(finance.address, 'newImmediatePayment', [ ethers.constants.AddressZero, ACCOUNT, ethers.utils.parseEther('1'), 'Tests Payment', ])

    const txPath = await intent.paths(connectedAccount)

    console.log('txPath ', txPath)

    // api.addProposal(title, toHex(link), decimalAmount, beneficiary).toPromise()
    setProposalPanel(false)
  }

  const { myStakes, totalActiveTokens } = useMemo(() => {
    if (!connectedAccount || !stakeToken.tokenDecimals || !proposals) {
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
  }, [proposals, connectedAccount, stakeToken.tokenDecimals])

  return {
    proposals,
    isSyncing: isSyncing || !blockHasLoaded,
    onProposalSubmit,
    proposalPanel,
    setProposalPanel,
    myStakes,
    totalActiveTokens,
  }
}
