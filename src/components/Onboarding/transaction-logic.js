import { utils } from 'ethers'

import { BYOT_TYPE, NATIVE_TYPE } from '@components/Onboarding/constants'

import tokenAbi from '@abis/erc20.json'
import templateAbi from '@abis/gardensTemplate.json'

import { getContract } from '@hooks/useContract'

import { bigNum } from '@lib/bigNumber'

import { YEARS_IN_SECONDS } from '@utils/kit-utils'
import {
  encodeFunctionData,
  getDefaultProvider,
  toHex,
} from '@utils/web3-utils'

import { ZERO_ADDR } from '@/constants'
import { getNetwork } from '@/networks'

const C_V_ONE_HUNDRED_PERCENT = 1e7
const ISSUANCE_ONE_HUNDRED_PERCENT = 1e10
const ONE_HUNDRED_PCT = 1e18

export async function createPreTransactions(
  { garden, liquidity, tokens },
  account,
  { chainId }
) {
  const txs = []
  const network = getNetwork(chainId)
  const templateAddress = network.template
  const honeyTokenAddress = network.honeyToken

  txs.push(
    ...(await createTokenApproveTxs(
      honeyTokenAddress,
      account,
      templateAddress,
      bigNum(liquidity.honeyTokenLiquidity).toString(10),
      'HNY',
      { chainId }
    ))
  )

  if (garden.type === BYOT_TYPE) {
    txs.push(
      ...(await createTokenApproveTxs(
        tokens.address,
        account,
        templateAddress,
        bigNum(liquidity.tokenLiquidity).toString(10),
        tokens.existingTokenSymbol,
        { chainId }
      ))
    )
  }

  return txs
}

async function createTokenApproveTxs(
  tokenAddress,
  owner,
  spender,
  amount,
  tokenSymbol,
  { chainId }
) {
  const txs = []
  const allowance = await getTokenAllowance(tokenAddress, owner, spender, {
    chainId,
  })

  if (allowance.lt(amount)) {
    if (!allowance.eq(0)) {
      txs.push({
        name: `Reset ${tokenSymbol} allowance`,
        transaction: createTokenTx(tokenAddress, 'approve', [spender, '0'], {
          chainId,
          gasLimit: 150000,
        }),
      })
    }
    txs.push({
      name: `Approve ${tokenSymbol}`,
      transaction: createTokenTx(tokenAddress, 'approve', [spender, amount], {
        chainId,
        gasLimit: 150000,
      }),
    })
  }

  return txs
}

export function createGardenTxOne(
  { garden, issuance, liquidity, tokens, voting },
  { chainId }
) {
  let existingToken, commonPool, gardenTokenLiquidity, existingTokenLiquidity

  // New token
  if (garden.type === NATIVE_TYPE) {
    existingToken = ZERO_ADDR

    // commonPool = ((totalSeedsAmount + gardenTokenLiquidity) * initialRatio) / (1 - initialRatio)
    const totalSeedsAmount = tokens.holders.reduce(
      (acc, [_, stake]) => acc + stake,
      0
    )
    const initialRatio = issuance.initialRatio / 100
    commonPool =
      ((totalSeedsAmount + parseInt(liquidity.tokenLiquidity)) * initialRatio) /
      (1 - initialRatio)

    gardenTokenLiquidity = liquidity.tokenLiquidity
    existingTokenLiquidity = '0'
  } else {
    // Existing token
    existingToken = tokens.address
    commonPool = '0'
    gardenTokenLiquidity = '0'
    existingTokenLiquidity = liquidity.tokenLiquidity
  }

  const adjustedCommonPool = bigNum(commonPool).toString(10)
  const adjustedLiquidityStable = bigNum(
    liquidity.honeyTokenLiquidityStable
  ).toString(10)
  const adjustedGardenTokenLiquidity = bigNum(gardenTokenLiquidity).toString(10)
  const adjustedExistingTokenLiquidity = bigNum(
    existingTokenLiquidity,
    tokens.decimals
  ).toString(10)

  // Ajust voting settings
  const { voteSupportRequired, voteMinAcceptanceQuorum } = voting
  const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
    voteSupportRequired,
    voteMinAcceptanceQuorum
  )

  return {
    name: 'Create organization',
    transaction: createTemplateTx(
      'createGardenTxOne',
      [
        [existingToken, tokens.gnosisSafe || ZERO_ADDR],
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
      ],
      { chainId, gasLimit: 12000000 }
    ),
  }
}

export function createTokenHoldersTx({ tokens }, { chainId }) {
  const accounts = tokens.holders.map(([account]) => account)
  const stakes = tokens.holders.map(([_, stake]) => bigNum(stake).toString(10))

  return {
    name: 'Mint new tokens',
    transaction: createTemplateTx('createTokenHolders', [accounts, stakes], {
      chainId,
      gasLimit: 5000000,
    }),
  }
}

export function createGardenTxTwo(
  { conviction, garden, issuance },
  { chainId }
) {
  const requestToken = conviction.requestToken || ZERO_ADDR
  let targetRatio, maxAdjustmentRatioPerSec

  // New token
  if (garden.type === NATIVE_TYPE) {
    // See https://github.com/1Hive/issuance-dynamic/blob/master/contracts/Issuance.sol#L35
    maxAdjustmentRatioPerSec = Math.floor(
      issuance.maxAdjustmentRatioPerYear / 100 / YEARS_IN_SECONDS
    )
    targetRatio = issuance.targetRatio / 100
  } else {
    // No issuance
    maxAdjustmentRatioPerSec = 0
    targetRatio = 0
  }

  // Adjust issuance params
  const adjustedMaxAdjustmentRatioPerSec = (
    maxAdjustmentRatioPerSec * ONE_HUNDRED_PCT
  ).toString(10)
  const adjustedTargetRatio = (
    targetRatio * ISSUANCE_ONE_HUNDRED_PERCENT
  ).toString(10)

  // Adjust conviction voting params
  const { decay, maxRatio, weight } = conviction
  const [adjustedDecay, adjustedMaxRatio, adjustedWeight] = [
    decay,
    maxRatio,
    weight,
  ].map((value) => Math.floor(value * C_V_ONE_HUNDRED_PERCENT).toString(10))

  const adjustedMinThresholdStakePct = (
    conviction.minThresholdStakePct * ONE_HUNDRED_PCT
  ).toString(10)

  return {
    name: 'Install apps',
    transaction: createTemplateTx(
      'createGardenTxTwo',
      [
        [adjustedTargetRatio, adjustedMaxAdjustmentRatioPerSec],
        [
          adjustedDecay,
          adjustedMaxRatio,
          adjustedWeight,
          adjustedMinThresholdStakePct,
        ],
        requestToken,
      ],
      { chainId, gasLimit: 8000000 }
    ),
  }
}

export function createGardenTxThree(
  { agreement, garden, liquidity, tokens },
  agreementContent,
  { chainId }
) {
  const daoId = garden.name // TODO: Remember to do a check for the garden.name on the garden metadata screen, otherwise tx might fail if garden name already taken

  // Adjust action and challenge amounts (challenge period already comes in seconds)
  const { actionAmount, challengeAmount } = agreement
  const adjustedActionAmount = bigNum(actionAmount, tokens.decimals).toString(
    10
  )
  const adjustedChallengeAmount = bigNum(
    challengeAmount,
    tokens.decimals
  ).toString(10)

  // Get action and challenge amount in stable value
  const { honeyTokenLiquidityStable, tokenLiquidity } = liquidity
  const tokenPrice = honeyTokenLiquidityStable / tokenLiquidity
  const actionAmountStable = bigNum(tokenPrice * actionAmount)
    .toFixed(0)
    .toString(10)
  const challengeAmountStable = bigNum(tokenPrice * challengeAmount)
    .toFixed(0)
    .toString(10)

  return {
    name: 'Install apps',
    transaction: createTemplateTx(
      'createGardenTxThree',
      [
        daoId,
        agreement.title,
        toHex(agreementContent),
        agreement.challengePeriod,
        [adjustedActionAmount, adjustedChallengeAmount],
        [actionAmountStable, actionAmountStable],
        [challengeAmountStable, challengeAmountStable],
      ],
      { chainId, gasLimit: 8000000 }
    ),
  }
}

export async function extractGardenAddress(ethers, txHash) {
  const receipt = await ethers.provider.send('eth_getTransactionReceipt', [
    txHash,
  ])
  const iface = new utils.Interface([
    'event GardenDeployed(address gardenAddress, address collateralRequirementUpdater)',
  ])
  const logs = receipt.result.logs

  const log = iface.parseLog(logs[logs.length - 1])
  const { gardenAddress } = log.args
  return gardenAddress
}

function createTemplateTx(fn, params, { chainId, gasLimit }) {
  const network = getNetwork(chainId)
  const templateAddress = network.template
  const templateContract = getContract(
    templateAddress,
    templateAbi,
    getDefaultProvider(chainId)
  )

  const data = encodeFunctionData(templateContract, fn, params)

  return {
    to: templateAddress,
    data,
    gasLimit,
  }
}

function createTokenTx(
  tokenAddress,
  fn,
  params,
  { chainId, gasLimit = 100000 }
) {
  const tokenContract = getContract(
    tokenAddress,
    tokenAbi,
    getDefaultProvider(chainId)
  )
  const data = encodeFunctionData(tokenContract, fn, params)

  return {
    to: tokenAddress,
    data,
    gasLimit,
  }
}

async function getTokenAllowance(tokenAddress, owner, spender, { chainId }) {
  const tokenContract = getContract(
    tokenAddress,
    tokenAbi,
    getDefaultProvider(chainId)
  )
  const allowance = await tokenContract.allowance(owner, spender)

  return bigNum(allowance.toString(), 0)
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const onePercent = bigNum('1', 16)
  const hundredPercent = onePercent.multipliedBy('100')

  let adjustedSupport = onePercent.multipliedBy(support.toString(10))
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.minus('1')
  }

  let adjustedQuorum = onePercent.multipliedBy(quorum.toString(10))
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.minus('1')
  }

  return [adjustedSupport.toString(10), adjustedQuorum.toString(10)]
}
