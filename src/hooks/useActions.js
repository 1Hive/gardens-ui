import { useCallback } from 'react'
import { noop } from '@1hive/1hive-ui'
import { toHex } from 'web3-utils'

import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { getAppByName } from '../utils/data-utils'
import { useMounted } from './useMounted'

import { useContract } from './useContract'
import { useDisputeFees } from './useDispute'

import env from '../environment'

import { VOTE_YEA } from '../constants'
import { encodeFunctionData } from '../utils/web3-utils'
import BigNumber from '../lib/bigNumber'
import tokenAbi from '../abi/minimeToken.json'

const GAS_LIMIT = 450000
const SETTLE_ACTION_GAS_LIMIT = 700000
// const CHALLENGE_ACTION_GAS_LIMIT = 900000
const DISPUTE_ACTION_GAS_LIMIT = 900000

export default function useActions(onDone) {
  const { account, ethers } = useWallet()
  const mounted = useMounted()

  const { installedApps } = useAppState()
  const convictionVotingApp = getAppByName(
    installedApps,
    env('CONVICTION_APP_NAME')
  )

  const disputeFees = useDisputeFees()
  const feeTokenContract = useContract(disputeFees.token, tokenAbi)

  const dandelionVotingApp = getAppByName(installedApps, env('VOTING_APP_NAME'))
  const issuanceApp = getAppByName(installedApps, env('ISSUANCE_APP_NAME'))
  const agreementApp = getAppByName(installedApps, env('AGREEMENT_APP_NAME'))

  // Conviction voting actions
  const newProposal = useCallback(
    async (
      { title, link, amount, stableRequestAmount, beneficiary },
      onDone = noop
    ) => {
      const intent = await convictionVotingApp.intent(
        'addProposal',
        [
          title,
          link ? toHex(link) : '0x',
          amount,
          stableRequestAmount,
          beneficiary,
        ],
        {
          actAs: account,
        }
      )

      onDone(intent)
    },
    [account, convictionVotingApp]
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
    sendIntent(issuanceApp, 'executeAdjustment', [], {
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
  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      const intent = await agreementApp.intent('sign', [versionId], {
        actAs: account,
      })

      // if (mounted()) {
      onDone(intent)
    },
    [account, agreementApp]
  )

  const challengeAction = useCallback(
    async (
      { actionId, settlementOffer, challengerFinishedEvidence, context },
      onDone = noop
    ) => {
      const intent = await agreementApp.intent(
        'challengeAction',
        [actionId, settlementOffer, challengerFinishedEvidence, context],
        {
          actAs: account,
        }
      )

      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, agreementApp, mounted]
  )

  const approveChallengeTokenAmount = useCallback(
    ({ depositAmount }, onDone = noop) => {
      if (!feeTokenContract || !agreementApp) {
        return
      }
      const approveData = encodeFunctionData(feeTokenContract, 'approve', [
        agreementApp.address,
        depositAmount.toString(10),
      ])
      const intent = [
        {
          data: approveData,
          from: account,
          to: feeTokenContract.address,
          description: 'Approve HNY',
        },
      ]

      if (mounted()) {
        onDone(intent)
      }
    },
    [account, feeTokenContract, agreementApp, mounted]
  )

  const getAllowance = useCallback(async () => {
    if (!feeTokenContract) {
      return
    }

    const allowance = await feeTokenContract.allowance(
      account,
      agreementApp.address
    )

    return new BigNumber(allowance.toString())
  }, [account, feeTokenContract, agreementApp])

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
      executeProposal,
      newProposal,
      cancelProposal,
      stakeToProposal,
      withdrawFromProposal,
    },
    issuanceActions: { executeIssuance },
    votingActions: {
      executeDecision,
      voteOnDecision,
    },
    agreementActions: {
      challengeAction,
      settleAction,
      disputeAction,
      signAgreement,
      approveChallengeTokenAmount,
      getAllowance,
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
