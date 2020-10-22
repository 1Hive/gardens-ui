import { useCallback } from 'react'
import { toHex } from 'web3-utils'

import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { getAppByName } from '../utils/data-utils'
import env from '../environment'

import { VOTE_YEA } from '../constants'

const GAS_LIMIT = 450000

export default function useActions(onDone) {
  const { account, ethers } = useWallet()

  const { installedApps } = useAppState()
  const convictionVotingApp = getAppByName(
    installedApps,
    env('CONVICTION_APP_NAME')
  )
  const dandelionVotingApp = getAppByName(installedApps, env('VOTING_APP_NAME'))
  const issuanceApp = getAppByName(installedApps, env('ISSUANCE_APP_NAME'))

  const newProposal = useCallback(
    async ({ title, link, amount, beneficiary }) => {
      sendIntent(
        convictionVotingApp,
        'addProposal',
        [title, link ? toHex(link) : '0x', amount, beneficiary],
        { ethers, from: account }
      )

      onDone()
    },
    [account, convictionVotingApp, ethers, onDone]
  )

  const cancelProposal = useCallback(
    async proposalId => {
      sendIntent(convictionVotingApp, 'cancelProposal', [proposalId], {
        ethers,
        from: account,
      })

      onDone()
    },
    [account, convictionVotingApp, ethers, onDone]
  )

  const stakeToProposal = useCallback(
    (proposalId, amount) => {
      sendIntent(convictionVotingApp, 'stakeToProposal', [proposalId, amount], {
        ethers,
        from: account,
      })

      onDone()
    },
    [account, convictionVotingApp, ethers, onDone]
  )

  const withdrawFromProposal = useCallback(
    (proposalId, amount) => {
      const params = [proposalId]
      if (amount) {
        params.push(amount)
      }

      sendIntent(
        convictionVotingApp,
        amount ? 'withdrawFromProposal' : 'withdrawAllFromProposal',
        params,
        { ethers, from: account }
      )

      onDone()
    },

    [account, convictionVotingApp, ethers, onDone]
  )

  const executeProposal = useCallback(
    proposalId => {
      sendIntent(convictionVotingApp, 'executeProposal', [proposalId], {
        ethers,
        from: account,
      })

      onDone()
    },
    [account, convictionVotingApp, ethers, onDone]
  )

  const executeIssuance = useCallback(() => {
    sendIntent(issuanceApp, 'executeIssuance', [], {
      ethers,
      from: account,
    })
  }, [account, ethers, issuanceApp])

  const voteOnDecision = useCallback(
    (voteId, voteType) => {
      sendIntent(dandelionVotingApp, 'vote', [voteId, voteType === VOTE_YEA], {
        ethers,
        from: account,
      })
    },
    [account, ethers, dandelionVotingApp]
  )

  const executeDecision = useCallback(
    voteId => {
      sendIntent(dandelionVotingApp, 'executeVote', [voteId], {
        ethers,
        from: account,
      })
    },
    [account, dandelionVotingApp, ethers]
  )

  return {
    convictionActions: {
      executeIssuance,
      executeProposal,
      newProposal,
      cancelProposal,
      stakeToProposal,
      withdrawFromProposal,
    },
    dandelionActions: {
      executeDecision,
      voteOnDecision,
    },
  }
}

async function sendIntent(app, fn, params, { ethers, from }) {
  try {
    const intent = await app.intent(fn, params, { actAs: from })
    const { to, data } = intent.transactions[0] // TODO: Handle errors when no tx path is found

    ethers.getSigner().sendTransaction({ data, to, gasLimit: GAS_LIMIT })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}
