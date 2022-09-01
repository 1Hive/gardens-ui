import { useCallback, useMemo } from 'react'
import { noop } from '@1hive/1hive-ui'
import { toHex } from 'web3-utils'

import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useGardenState } from '@providers/GardenState'
import { useMounted } from './useMounted'
import { getNetwork } from '@/networks'
import { useWallet } from '@providers/Wallet'

import { getAppByName } from '@utils/data-utils'
import { getContract, useContract } from './useContract'

import env from '@/environment'

import { GardenActionTypes as actions } from '@/actions/garden-action-types'
import { encodeFunctionData, getDefaultProvider } from '@utils/web3-utils'
import BigNumber from '@lib/bigNumber'
import radspec from '../radspec'

import fluidProposalsAbi from '@abis/FluidProposals.json'
import priceOracleAbi from '@abis/priceOracle.json'
import unipoolAbi from '@abis/Unipool.json'
import tokenAbi from '@abis/minimeToken.json'
import { ActionsType, TransactionType } from '../types/app'

const APPROVE_GAS_LIMIT = 250000
const CHALLENGE_GAS_LIMIT = 1000000
const CREATE_PROPOSAL_GAS_LIMIT = 1000000
const GAS_LIMIT = 550000
const RESOLVE_GAS_LIMIT = 700000
const SIGN_GAS_LIMIT = 100000
const STAKE_GAS_LIMIT = 300000
const WRAP_GAS_LIMIT = 1000000

export default function useActions(): ActionsType {
  const { account, ethers } = useWallet()
  const mounted = useMounted()

  const { chainId, fluidProposals, incentivisedPriceOracle, unipool } =
    useConnectedGarden()
  const { installedApps, mainToken, wrappableToken } = useGardenState()
  const convictionVotingApp = getAppByName(
    installedApps,
    env('CONVICTION_APP_NAME')
  )
  const { stableToken } = getNetwork(chainId)

  const priceOracleContract = useContract(
    incentivisedPriceOracle,
    priceOracleAbi
  )
  const fluidProposalsContract = useContract(fluidProposals, fluidProposalsAbi)
  const unipoolContract = useContract(unipool, unipoolAbi)
  const wrappableTokenContract = useContract(wrappableToken?.data.id, tokenAbi)

  const votingApp = getAppByName(installedApps, env('VOTING_APP_NAME'))
  const issuanceApp = getAppByName(installedApps, env('ISSUANCE_APP_NAME'))
  const agreementApp = getAppByName(installedApps, env('AGREEMENT_APP_NAME'))
  const hookedTokenManagerApp = getAppByName(
    installedApps,
    env('HOOKED_TOKEN_MANAGER_APP_NAME')
  )

  // Conviction voting actions
  const newProposal = useCallback(
    async (
      { title, link, amount, stableRequestAmount, beneficiary },
      onDone = noop
    ) => {
      let intent = await convictionVotingApp.intent(
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

      intent = imposeGasLimit(intent, CREATE_PROPOSAL_GAS_LIMIT)

      const description = radspec[actions.NEW_PROPOSAL]()
      const type = actions.NEW_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, convictionVotingApp, mounted]
  )

  const newSignalingProposal = useCallback(
    async ({ title, link }, onDone = noop) => {
      let intent = await convictionVotingApp.intent(
        'addSignalingProposal',
        [title, link ? toHex(link) : '0x'],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, CREATE_PROPOSAL_GAS_LIMIT)

      const description = radspec[actions.NEW_SIGNALING_PROPOSAL]()
      const type = actions.NEW_SIGNALING_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )
      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, convictionVotingApp, mounted]
  )

  const cancelProposal = useCallback(
    async (proposalId, onDone = noop) => {
      const intent = await convictionVotingApp.intent(
        'cancelProposal',
        [proposalId],
        {
          actAs: account,
        }
      )

      const description = radspec[actions.CANCEL_PROPOSAL]({
        proposalId,
      })
      const type = actions.CANCEL_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      onDone(transactions)
    },
    [account, convictionVotingApp]
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

      const description = radspec[actions.STAKE_TO_PROPOSAL]({
        proposalId,
      })
      const type = actions.STAKE_TO_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )
      if (mounted()) {
        onDone(transactions)
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

      let intent = await convictionVotingApp.intent(
        amount ? 'withdrawFromProposal' : 'withdrawAllFromProposal',
        params,
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, STAKE_GAS_LIMIT)

      const description = radspec[actions.WITHDRAW_FROM_PROPOSAL]({
        proposalId,
      })
      const type = actions.WITHDRAW_FROM_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
      }
    },

    [account, convictionVotingApp, mounted]
  )

  const executeProposal = useCallback(
    async (proposalId, onDone = noop) => {
      let intent = await convictionVotingApp.intent(
        'executeProposal',
        [proposalId],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, GAS_LIMIT)

      const description = radspec[actions.EXECUTE_PROPOSAL]({
        proposalId,
      })
      const type = actions.EXECUTE_PROPOSAL

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      onDone(transactions)
    },
    [account, convictionVotingApp]
  )

  // Issuance actions
  // TODO- we need to start using modal flow for all the transactions
  const executeIssuance = useCallback(() => {
    sendIntent(issuanceApp, 'executeAdjustment', [], {
      ethers,
      from: account,
    })
  }, [account, ethers, issuanceApp])

  // Vote actions
  const voteOnDecision = useCallback(
    async (voteId, supports, onDone = noop) => {
      let intent = await votingApp.intent('vote', [voteId, supports], {
        actAs: account,
      })

      intent = imposeGasLimit(intent, GAS_LIMIT)

      const description = radspec[actions.VOTE_ON_DECISION]({
        voteId,
        supports,
      })
      const type = actions.VOTE_ON_DECISION

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      onDone(transactions)
    },
    [account, votingApp]
  )
  const voteOnBehalfOf = useCallback(
    async (voteId, supports, voters, onDone = noop) => {
      let intent = await votingApp.intent(
        'voteOnBehalfOf',
        [voteId, supports, voters],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, GAS_LIMIT)

      const description = radspec[actions.VOTE_ON_BEHALF_OF]({
        voteId,
        supports,
      })
      const type = actions.VOTE_ON_BEHALF_OF

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      onDone(transactions)
    },
    [account, votingApp]
  )
  // TODO- we need to start using modal flow for all the transactions
  const executeDecision = useCallback(
    (voteId, script) => {
      sendIntent(votingApp, 'executeVote', [voteId, script], {
        ethers,
        from: account,
      })
    },
    [account, ethers, votingApp]
  )
  const delegateVoting = useCallback(
    async (representative, onDone = noop) => {
      let intent = await votingApp.intent(
        'setRepresentative',
        [representative],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, GAS_LIMIT)

      const description = radspec[actions.DELEGATE_VOTING]({
        representative,
      })
      const type = actions.DELEGATE_VOTING

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      onDone(transactions)
    },
    [account, votingApp]
  )

  // Agreement actions
  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      let intent = await agreementApp.intent('sign', [versionId], {
        actAs: account,
      })

      intent = imposeGasLimit(intent, SIGN_GAS_LIMIT)
      const description = radspec[actions.SIGN_AGREEMENT]()
      const type = actions.SIGN_AGREEMENT

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      // if (mounted()) {
      onDone(transactions)
    },
    [account, agreementApp]
  )

  const challengeAction = useCallback(
    async (
      { actionId, settlementOffer, challengerFinishedEvidence, context },
      onDone = noop
    ) => {
      let intent = await agreementApp.intent(
        'challengeAction',
        [actionId, settlementOffer, challengerFinishedEvidence, context],
        {
          actAs: account,
        }
      )

      intent = imposeGasLimit(intent, CHALLENGE_GAS_LIMIT)
      const description = radspec[actions.CHALLENGE_ACTION]({
        actionId,
      })
      const type = actions.CHALLENGE_ACTION

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, agreementApp, mounted]
  )

  const approve = useCallback(
    (amount, tokenContract, appAddress) => {
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
          gasLimit: APPROVE_GAS_LIMIT,
        },
      ]

      return intent
    },
    [account]
  )

  const approveTokenAmount = useCallback(
    async (tokenAddress, depositAmount, onDone = noop) => {
      const tokenContract = getContract(
        tokenAddress,
        tokenAbi,
        getDefaultProvider(chainId)
      )
      if (!tokenContract || !agreementApp) {
        return
      }

      const tokenSymbol = await tokenContract.symbol()

      const trxs = approve(depositAmount, tokenContract, agreementApp.address)

      const description = radspec[actions.APPROVE_TOKEN]({
        tokenSymbol,
      })
      const type = actions.APPROVE_TOKEN

      const transactions = attachTrxMetadata(trxs, description, type)

      if (mounted()) {
        onDone(transactions)
      }
    },
    [agreementApp, approve, chainId, mounted]
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
    (tokenAddress) => {
      const tokenContract = getContract(
        tokenAddress,
        tokenAbi,
        getDefaultProvider(chainId)
      )
      if (!agreementApp || !tokenContract) {
        return
      }
      return getAllowance(tokenContract, agreementApp.address)
    },
    [agreementApp, chainId, getAllowance]
  )

  // TODO- we need to start using modal flow for all the transactions
  const resolveAction = useCallback(
    (disputeId) => {
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

      const description = radspec[actions.SETTLE_ACTION]({
        actionId,
      })
      const type = actions.SETTLE_ACTION

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
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

      const description = radspec[actions.DISPUTE_ACTION]({
        actionId,
      })
      const type = actions.DISPUTE_ACTION

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, agreementApp, mounted]
  )

  // Hoked token manager actions
  const approveWrappableTokenAmount = useCallback(
    (amount, onDone = noop) => {
      if (!wrappableTokenContract || !hookedTokenManagerApp) {
        return
      }

      const trxs = approve(
        amount,
        wrappableTokenContract,
        hookedTokenManagerApp.address
      )

      const description = radspec[actions.APPROVE_TOKEN]({
        tokenSymbol: wrappableToken.data.symbol,
      })
      const type = actions.APPROVE_TOKEN

      const transactions = attachTrxMetadata(trxs, description, type)

      if (mounted()) {
        onDone(transactions)
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

      const description = radspec[actions.WRAP_TOKEN]()
      const type = actions.WRAP_TOKEN

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
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

      const description = radspec[actions.UNWRAP_TOKEN]()
      const type = actions.UNWRAP_TOKEN

      const transactions = attachTrxMetadata(
        intent.transactions,
        description,
        type
      )

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, hookedTokenManagerApp, mounted]
  )

  // Price Oracle Actions
  const updatePriceOracle = useCallback(
    async (onDone = noop) => {
      const updatePriceOracleData = encodeFunctionData(
        priceOracleContract,
        'update',
        [stableToken, mainToken.data.id]
      )

      let transactions = [
        {
          data: updatePriceOracleData,
          from: account,
          to: priceOracleContract?.address,
        },
      ]

      const description = radspec[actions.UPDATE_PRICE_ORACLE]()
      const type = actions.UPDATE_PRICE_ORACLE

      transactions = attachTrxMetadata(transactions, description, type)

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, mounted, priceOracleContract, mainToken, stableToken]
  )
  // Unipool actions
  const claimRewards = useCallback(
    (onDone = noop) => {
      const getRewardData = encodeFunctionData(unipoolContract, 'getReward', [])
      let transactions = [
        {
          data: getRewardData,
          from: account,
          to: unipoolContract?.address,
        },
      ]

      const description = radspec[actions.CLAIM_REWARDS]()
      const type = actions.CLAIM_REWARDS

      transactions = attachTrxMetadata(transactions, description, type)

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, mounted, unipoolContract]
  )

  // Fluid Proposals actions
  const activateProposal = useCallback(
    ({ proposalId, beneficiary }, onDone = noop) => {
      const activateProposalData = encodeFunctionData(
        fluidProposalsContract,
        'activateProposal',
        [proposalId, beneficiary]
      )
      let transactions = [
        {
          data: activateProposalData,
          from: account,
          to: fluidProposalsContract?.address,
        },
      ]

      const description = radspec[actions.ACTIVATE_STREAM_PROPOSAL]()
      const type = actions.ACTIVATE_STREAM_PROPOSAL

      transactions = attachTrxMetadata(transactions, description, type)

      if (mounted()) {
        onDone(transactions)
      }
    },
    [account, mounted, fluidProposalsContract]
  )

  return useMemo<ActionsType>(
    () => ({
      agreementActions: {
        approveTokenAmount,
        challengeAction,
        disputeAction,
        getAllowance: getAgreementTokenAllowance,
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
      fluidProposalsActions: { activateProposal },
      hookedTokenManagerActions: {
        approveWrappableTokenAmount,
        getAllowance: getHookedTokenManagerAllowance,
        wrap,
        unwrap,
      },
      issuanceActions: { executeIssuance },
      priceOracleActions: { updatePriceOracle },
      unipoolActions: { claimRewards },
      votingActions: {
        delegateVoting,
        executeDecision,
        voteOnDecision,
        voteOnBehalfOf,
      },
    }),
    [
      activateProposal,
      approveTokenAmount,
      approveWrappableTokenAmount,
      cancelProposal,
      challengeAction,
      claimRewards,
      delegateVoting,
      disputeAction,
      executeDecision,
      executeIssuance,
      executeProposal,
      getAgreementTokenAllowance,
      getHookedTokenManagerAllowance,
      newProposal,
      newSignalingProposal,
      resolveAction,
      settleAction,
      signAgreement,
      stakeToProposal,
      unwrap,
      updatePriceOracle,
      voteOnBehalfOf,
      voteOnDecision,
      withdrawFromProposal,
      wrap,
    ]
  )
}

type IntentArguments = {
  ethers: any
  from: string
  gasLimit?: number
}
async function sendIntent(
  app: any,
  fn: string,
  params: any,
  { ethers, from, gasLimit = GAS_LIMIT }: IntentArguments
) {
  try {
    const intent = await app.intent(fn, params, { actAs: from })
    const { to, data } = intent.transactions[0] // TODO: Handle errors when no tx path is found

    ethers.getSigner().sendTransaction({ data, to, gasLimit })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}

function imposeGasLimit(intent: any, gasLimit: number) {
  return {
    ...intent,
    transactions: intent.transactions.map((tx: TransactionType) => ({
      ...tx,
      gasLimit,
    })),
  }
}

function attachTrxMetadata(
  transactions: any,
  description: string,
  type: actions
) {
  return transactions.map((tx: TransactionType) => ({
    ...tx,
    description,
    type,
  }))
}
