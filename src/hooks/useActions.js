import { useCallback } from 'react'
import { noop } from '@1hive/1hive-ui'
import { toHex } from 'web3-utils'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'
import { getAppByName } from '@utils/data-utils'
import { useMounted } from './useMounted'

import { getContract, useContract } from './useContract'

import env from '@/environment'

import { VOTE_YEA } from '@/constants'
import { encodeFunctionData } from '@utils/web3-utils'
import BigNumber from '@lib/bigNumber'
import tokenAbi from '@abis/minimeToken.json'
import agreementAbi from '@abis/agreement.json'

const GAS_LIMIT = 450000
const RESOLVE_GAS_LIMIT = 700000
const SIGN_GAS_LIMIT = 100000
const STAKE_GAS_LIMIT = 250000
const WRAP_GAS_LIMIT = 1000000

export default function useActions() {
  const { account, ethers } = useWallet()
  const mounted = useMounted()

  const { installedApps, wrappableToken } = useGardenState()
  const convictionVotingApp = getAppByName(
    installedApps,
    env('CONVICTION_APP_NAME')
  )

  const wrappableTokenContract = useContract(wrappableToken?.data.id, tokenAbi)

  const dandelionVotingApp = getAppByName(installedApps, env('VOTING_APP_NAME'))
  const issuanceApp = getAppByName(installedApps, env('ISSUANCE_APP_NAME'))
  const agreementApp = getAppByName(installedApps, env('AGREEMENT_APP_NAME'))
  const hookedTokenManagerApp = getAppByName(
    installedApps,
    env('HOOKED_TOKEN_MANAGER_APP_NAME')
  )

  const agreementContract = useContract(agreementApp?.address, agreementAbi)

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
      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, convictionVotingApp, mounted]
  )

  const newSignalingProposal = useCallback(
    async ({ title, link }, onDone = noop) => {
      const intent = await convictionVotingApp.intent(
        'addSignalingProposal',
        [title, link ? toHex(link) : '0x'],
        {
          actAs: account,
        }
      )

      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, convictionVotingApp, mounted]
  )

  const cancelProposal = useCallback(
    async proposalId => {
      sendIntent(convictionVotingApp, 'cancelProposal', [proposalId], {
        ethers,
        from: account,
      })

      // onDone()
    },
    [account, convictionVotingApp, ethers]
  )

  const stakeToProposal = useCallback(
    async ({ proposalId, amount }, onDone = noop) => {
      let intent = await convictionVotingApp.intent(
        'stakeToProposal',
        [proposalId, amount],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, STAKE_GAS_LIMIT)

      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, convictionVotingApp, mounted]
  )

  const withdrawFromProposal = useCallback(
    async ({ proposalId, amount }, onDone = noop) => {
      const params = [proposalId]
      if (amount) {
        params.push(amount)
      }

      sendIntent(
        convictionVotingApp,
        amount ? 'withdrawFromProposal' : 'withdrawAllFromProposal',
        params,
        {
          ethers,
          from: account,
          gasLimit: STAKE_GAS_LIMIT,
        }
      )
    },

    [account, convictionVotingApp, ethers]
  )

  const executeProposal = useCallback(
    proposalId => {
      sendIntent(convictionVotingApp, 'executeProposal', [proposalId], {
        ethers,
        from: account,
      })

      // onDone()
    },
    [account, convictionVotingApp, ethers]
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

  // Agreement actions
  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      let intent = await agreementApp.intent('sign', [versionId], {
        actAs: account,
      })

      intent = imposeGasLimit(intent, SIGN_GAS_LIMIT)

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

  const approve = useCallback(
    (amount, tokenContract, appAddress, trxDescription) => {
      if (!tokenContract || !appAddress) {
        return
      }
      const approveData = encodeFunctionData(tokenContract, 'approve', [
        appAddress,
        amount.toString(10),
      ])
      const intent = [
        {
          data: approveData,
          from: account,
          to: tokenContract.address,
          description: trxDescription,
        },
      ]

      return intent
    },
    [account]
  )

  const approveTokenAmount = useCallback(
    async (tokenAddress, depositAmount, onDone = noop) => {
      const tokenContract = getContract(tokenAddress, tokenAbi)
      if (!tokenContract || !agreementApp) {
        return
      }

      const tokenSymbol = await tokenContract.symbol()

      const intent = approve(
        depositAmount,
        tokenContract,
        agreementApp.address,
        `Approve ${tokenSymbol}`
      )

      if (mounted()) {
        onDone(intent)
      }
    },
    [agreementApp, approve, mounted]
  )

  const getAllowance = useCallback(
    async (tokenContract, appAddress) => {
      if (!tokenContract) {
        return
      }

      const allowance = await tokenContract.allowance(account, appAddress)

      return new BigNumber(allowance.toString())
    },
    [account]
  )

  const getAgreementTokenAllowance = useCallback(
    tokenAddress => {
      const tokenContract = getContract(tokenAddress, tokenAbi)
      if (!agreementApp || !tokenContract) {
        return
      }
      return getAllowance(tokenContract, agreementApp.address)
    },
    [agreementApp, getAllowance]
  )

  const resolveAction = useCallback(
    disputeId => {
      sendIntent(agreementApp, 'resolve', [disputeId], {
        ethers,
        from: account,
        gasLimit: RESOLVE_GAS_LIMIT,
      })
    },
    [account, agreementApp, ethers]
  )

  const settleAction = useCallback(
    async ({ actionId }, onDone = noop) => {
      const intent = await agreementApp.intent('settleAction', [actionId], {
        actAs: account,
      })
      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, agreementApp, mounted]
  )

  const disputeAction = useCallback(
    async ({ actionId, submitterFinishedEvidence }, onDone = noop) => {
      const intent = await agreementApp.intent(
        'disputeAction',
        [actionId, submitterFinishedEvidence],
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

  const getChallenge = useCallback(
    async challengeId => {
      if (!agreementContract) {
        return
      }

      const challengeData = await agreementContract.getChallenge(challengeId)

      return challengeData
    },
    [agreementContract]
  )

  // Hoked token manager actions
  const approveWrappableTokenAmount = useCallback(
    (amount, onDone = noop) => {
      if (!wrappableTokenContract || !hookedTokenManagerApp) {
        return
      }

      const intent = approve(
        amount,
        wrappableTokenContract,
        hookedTokenManagerApp.address,
        `Approve ${wrappableToken.data.symbol}`
      )

      if (mounted()) {
        onDone(intent)
      }
    },
    [
      approve,
      hookedTokenManagerApp,
      mounted,
      wrappableToken,
      wrappableTokenContract,
    ]
  )

  const getHookedTokenManagerAllowance = useCallback(() => {
    if (!hookedTokenManagerApp || !wrappableTokenContract) {
      return
    }
    return getAllowance(wrappableTokenContract, hookedTokenManagerApp.address)
  }, [hookedTokenManagerApp, getAllowance, wrappableTokenContract])

  const wrap = useCallback(
    async ({ amount }, onDone = noop) => {
      let intent = await hookedTokenManagerApp.intent('wrap', [amount], {
        actAs: account,
      })

      intent = imposeGasLimit(intent, WRAP_GAS_LIMIT)

      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, hookedTokenManagerApp, mounted]
  )

  const unwrap = useCallback(
    async ({ amount }, onDone = noop) => {
      let intent = await hookedTokenManagerApp.intent('unwrap', [amount], {
        actAs: account,
      })

      intent = imposeGasLimit(intent, WRAP_GAS_LIMIT)

      if (mounted()) {
        onDone(intent.transactions)
      }
    },
    [account, hookedTokenManagerApp, mounted]
  )

  // TODO: Memoize objects
  return {
    agreementActions: {
      approveTokenAmount,
      challengeAction,
      disputeAction,
      getAllowance: getAgreementTokenAllowance,
      getChallenge,
      resolveAction,
      settleAction,
      signAgreement,
    },
    convictionActions: {
      executeProposal,
      cancelProposal,
      newProposal,
      newSignalingProposal,
      stakeToProposal,
      withdrawFromProposal,
    },
    hookedTokenManagerActions: {
      approveWrappableTokenAmount,
      getAllowance: getHookedTokenManagerAllowance,
      wrap,
      unwrap,
    },
    issuanceActions: { executeIssuance },
    votingActions: {
      executeDecision,
      voteOnDecision,
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

function imposeGasLimit(intent, gasLimit) {
  return {
    ...intent,
    transactions: intent.transactions.map(tx => ({ ...tx, gasLimit })),
  }
}
