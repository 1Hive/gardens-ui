import { bigNum } from '@lib/bigNumber'
import { getNetwork } from '@/networks'
import { ZERO_ADDR } from '@/constants'
import { getContract } from '@hooks/useContract'
import { encodeFunctionData } from '@utils/web3-utils'
import { BYOT_TYPE, NATIVE_TYPE } from '@components/Onboarding/constants'

import tokenAbi from '@abis/erc20.json'
import templateAbi from '@abis/gardensTemplate.json'

const C_V_ONE_HUNDRED_PERCENT = 1e7
const ISSUANCE_ONE_HUNDRED_PERCENT = 1e10
const ONE_HUNDRED_PCT = 1e18

export function createTokenApproveTxs({ garden, liquidity, tokens }) {
  const txs = []
  const network = getNetwork()
  const templateAddress = network.template
  const honeyTokenAddress = network.honeyToken

  const adjustedHoneyLiquidity = bigNum(
    liquidity.honeyTokenLiquidity
  ).toString()

  txs.push(
    createTokenTx(honeyTokenAddress, 'approve', [
      templateAddress,
      adjustedHoneyLiquidity,
    ])
  )

  if (garden.type === BYOT_TYPE) {
    const adjustedTokenLiquidity = bigNum(liquidity.tokenLiquidity).toString()

    txs.push(
      createTokenTx(tokens.address, 'approve', [
        templateAddress,
        adjustedTokenLiquidity,
      ])
    )
  }

  return txs
}

export function createGardenTxOne({
  garden,
  issuance,
  liquidity,
  tokens,
  voting,
}) {
  let existingToken, commonPool, gardenTokenLiquidity, existingTokenLiquidity

  // New token
  if (garden.type === NATIVE_TYPE) {
    existingToken = ZERO_ADDR

    // commonPool = totalSeedsAmount * initialRatio / (1 - initialRatio)
    const totalSeedsAmount = tokens.holders.reduce(
      (acc, [_, stake]) => acc + stake,
      0
    )
    const initialRatio = issuance.initialRatio / 100
    commonPool = (totalSeedsAmount * initialRatio) / (1 - initialRatio)

    gardenTokenLiquidity = liquidity.tokenLiquidity
    existingTokenLiquidity = '0'
  } else {
    // Existing token
    existingToken = tokens.address
    commonPool = '0'
    gardenTokenLiquidity = '0'
    existingTokenLiquidity = liquidity.tokenLiquidity
  }

  const adjustedCommonPool = bigNum(commonPool).toString()
  const adjustedLiquidityStable = bigNum(
    liquidity.honeyTokenLiquidityStable
  ).toString()
  const adjustedGardenTokenLiquidity = bigNum(gardenTokenLiquidity).toString()
  const adjustedExistingTokenLiquidity = bigNum(
    existingTokenLiquidity,
    tokens.decimals
  ).toString()

  // Ajust voting settings
  const { voteSupportRequired, voteMinAcceptanceQuorum } = voting
  const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
    voteSupportRequired,
    voteMinAcceptanceQuorum
  )

  return createTemplateTx('createGardenTxOne', [
    existingToken,
    tokens.name,
    tokens.symbol,
    [
      adjustedCommonPool,
      adjustedLiquidityStable,
      adjustedGardenTokenLiquidity,
      adjustedExistingTokenLiquidity,
    ],
    [
      voting.voteDuration,
      adjustedSupport,
      adjustedQuorum,
      voting.voteDelegatedVotingPeriod,
      voting.voteQuietEndingPeriod,
      voting.voteQuietEndingExtension,
      voting.voteExecutionDelay,
    ],
  ])
}

export function createTokenHoldersTx({ tokens }) {
  const accounts = tokens.holders.map(([account]) => account)
  const stakes = tokens.holders.map(([_, stake]) => bigNum(stake).toString())

  return createTemplateTx('createTokenHolders', [accounts, stakes])
}

export function createGardenTxTwo({ conviction, issuance }) {
  const requestToken = conviction.requestToken || ZERO_ADDR

  // Adjust issuance params
  const { maxAdjustmentRatioPerYear, targetRatio } = issuance
  const adjustedMaxAdjsRatioPerYear = (
    maxAdjustmentRatioPerYear * ONE_HUNDRED_PCT
  ).toString()
  const adjustedTargetRatio = (
    targetRatio * ISSUANCE_ONE_HUNDRED_PERCENT
  ).toString()

  // Adjust conviction voting params
  const { decay, maxRatio, weight } = conviction
  const [adjustedDecay, adjustedMaxRatio, adjustedWeight] = [
    decay,
    maxRatio,
    weight,
  ].map(value => Math.floor(value * C_V_ONE_HUNDRED_PERCENT).toString())

  const adjustedMinThresholdStakePct = (
    conviction.minThresholdStakePct * ONE_HUNDRED_PCT
  ).toString()

  return createTemplateTx('createGardenTxTwo', [
    [adjustedTargetRatio, adjustedMaxAdjsRatioPerYear],
    [
      adjustedDecay,
      adjustedMaxRatio,
      adjustedWeight,
      adjustedMinThresholdStakePct,
    ],
    requestToken,
  ])
}

export async function createGardenTxThree(
  { agreement, garden, liquidity, tokens },
  agreementContent
) {
  const daoId = garden.name // TODO: Remember to do a check for the garden.name on the garden metadata screen, otherwise tx might fail if garden name already taken

  // Adjust action and challenge amounts (challenge period already comes in seconds)
  const { actionAmount, challengeAmount } = agreement
  const adjustedActionAmount = bigNum(actionAmount, tokens.decimals).toString()
  const adjustedChallengeAmount = bigNum(
    challengeAmount,
    tokens.decimals
  ).toString()

  // Get action and challenge amount in stable value
  const { honeyTokenLiquidityStable, tokenLiquidity } = liquidity
  const tokenPrice = honeyTokenLiquidityStable / tokenLiquidity
  const actionAmountStable = bigNum(tokenPrice * actionAmount).toString()
  const challengeAmountStable = bigNum(tokenPrice * challengeAmount).toString()

  return createTemplateTx('createGardenTxThree', [
    daoId,
    agreement.title,
    agreementContent,
    agreement.challengePeriod,
    [adjustedActionAmount, adjustedChallengeAmount],
    [actionAmountStable, actionAmountStable],
    [challengeAmountStable, challengeAmountStable],
  ])
}

function createTemplateTx(fn, params) {
  const network = getNetwork()
  const templateAddress = network.template
  const templateContract = getContract(templateAddress, templateAbi)

  const data = encodeFunctionData(templateContract, fn, params)

  return {
    to: templateAddress,
    data,
  }
}

function createTokenTx(tokenAddress, fn, params) {
  const tokenContract = getContract(tokenAddress, tokenAbi)
  const data = encodeFunctionData(tokenContract, fn, params)

  return {
    to: tokenAddress,
    data,
  }
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const onePercent = bigNum('1', 16)
  const hundredPercent = onePercent.multipliedBy('100')

  let adjustedSupport = onePercent.multipliedBy(support.toString())
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.minus('1')
  }

  let adjustedQuorum = onePercent.multipliedBy(quorum.toString())
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.minus('1')
  }

  return [adjustedSupport.toString(), adjustedQuorum.toString()]
}
