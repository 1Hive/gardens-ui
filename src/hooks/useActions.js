import { useCallback } from 'react'
import { toHex } from 'web3-utils'

import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { getAppByName } from '../utils/data-utils'
import env from '../environment'

import { VOTE_YEA } from '../constants'

const GAS_LIMIT = 450000
const SETTLE_ACTION_GAS_LIMIT = 700000
const CHALLENGE_ACTION_GAS_LIMIT = 900000
const DISPUTE_ACTION_GAS_LIMIT = 900000

export default function useActions(onDone) {
  const { account, ethers } = useWallet()

  const { installedApps } = useAppState()
  const convictionVotingApp = getAppByName(
    installedApps,
    env('CONVICTION_APP_NAME')
  )
  const dandelionVotingApp = getAppByName(installedApps, env('VOTING_APP_NAME'))
  const issuanceApp = getAppByName(installedApps, env('ISSUANCE_APP_NAME'))
  const agreementApp = getAppByName(installedApps, env('AGREEMENT_APP_NAME'))

  // Conviction voting actions
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

  // Issuance actions
  const executeIssuance = useCallback(() => {
    sendIntent(issuanceApp, 'executeIssuance', [], {
      ethers,
      from: account,
    })
  }, [account, ethers, issuanceApp])

  // Vote actions
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

  const approveTokens = useCallback((contract, spender, value) => {
    return contract.approve(spender, value)
  }, [])

  // Agreement actions
  const challengeAction = useCallback(
    async (
      actionId,
      settlementOffer,
      challengerFinishedEvidence,
      context,
      feeTokenContract,
      depositAmount
    ) => {
      const allowance = await feeTokenContract.allowance(
        account,
        agreementApp.address
      )
      // Check if requires pre-transactions
      if (allowance.lt(depositAmount)) {
        // Some ERC20s don't allow setting a new allowance if the current allowance is positive
        if (!allowance.eq('0')) {
          await approveTokens(feeTokenContract, agreementApp.address, '0')
        }

        await approveTokens(
          feeTokenContract,
          agreementApp.address,
          depositAmount
        )
      }

      sendIntent(
        agreementApp,
        'challengeAction',
        [actionId, settlementOffer, challengerFinishedEvidence, context],
        {
          ethers,
          from: account,
          gasLimit: CHALLENGE_ACTION_GAS_LIMIT,
        }
      )
    },
    [account, agreementApp, approveTokens, ethers]
  )

  const settleAction = useCallback(
    actionId => {
      sendIntent(agreementApp, 'settleAction', [actionId], {
        ethers,
        from: account,
        gasLimit: SETTLE_ACTION_GAS_LIMIT,
      })
    },
    [account, agreementApp, ethers]
  )

  const disputeAction = useCallback(
    async (
      actionId,
      submitterFinishedEvidence,
      feeTokenContract,
      disputeFee
    ) => {
      const allowance = await feeTokenContract.allowance(
        account,
        agreementApp.address
      )

      // Check if requires pre-transactions
      if (allowance.lt(disputeFee)) {
        // Some ERC20s don't allow setting a new allowance if the current allowance is positive
        if (!allowance.eq('0')) {
          await approveTokens(feeTokenContract, agreementApp.address, '0')
        }

        await approveTokens(feeTokenContract, agreementApp.address, disputeFee)
      }

      sendIntent(
        agreementApp,
        'disputeAction',
        [actionId, submitterFinishedEvidence],
        {
          ethers,
          from: account,
          gasLimit: DISPUTE_ACTION_GAS_LIMIT,
        }
      )
    },
    [account, agreementApp, approveTokens, ethers]
  )

  // TODO: Memoize objects
  return {
    convictionActions: {
      executeIssuance,
      executeProposal,
      newProposal,
      cancelProposal,
      stakeToProposal,
      withdrawFromProposal,
    },
    votingActions: {
      executeDecision,
      voteOnDecision,
    },
    agreementActions: {
      challengeAction,
      settleAction,
      disputeAction,
    },
  }
}

async function sendIntent(
  app,
  fn,
  params,
  { ethers, from, gasLimit = GAS_LIMIT }
) {
  try {
    const intent = await app.intent(fn, params, { actAs: from })
    const { to, data } = intent.transactions[0] // TODO: Handle errors when no tx path is found

    ethers.getSigner().sendTransaction({ data, to, gasLimit })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}
