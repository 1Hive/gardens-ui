import React, { useMemo } from 'react'
import {
  Box,
  Distribution,
  GU,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import IdentityBadge from './IdentityBadge'

import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'
import { formatTokenAmount } from '../utils/token-utils'
import { stakesPercentages } from '../utils/math-utils'
import { addressesEqualNoSum as addressesEqual } from '../utils/web3-utils'

import noSupportIllustration from '../assets/noSupportIllustration.svg'

const DISTRIBUTION_ITEMS_MAX = 6

function displayedStakes(stakes, total, stakeToken) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map(stake => ({
    item: {
      entity: stake.index === -1 ? 'Others' : stakes[stake.index].entity.id,
      amount: formatTokenAmount(
        stake.index === -1 ? stake.amount : stakes[stake.index].amount,
        stakeToken.decimals
      ),
    },
    percentage: stake.percentage,
  }))
}

const SupportersDistribution = React.memo(function SupportersDistribution({
  stakes,
  totalTokensStaked,
}) {
  const { stakeToken } = useAppState()

  const totalStakedString = totalTokensStaked.toString(10)
  const transformedStakes = useMemo(() => {
    if (!stakes) {
      return null
    }

    return displayedStakes(stakes, totalTokensStaked, stakeToken)
  }, [totalStakedString, stakeToken.id]) // eslint-disable-line

  return (
    <Box heading="Supported by" padding={2 * GU}>
      {stakes.length > 0 ? (
        <>
          <MemoizedDistribution
            stakes={transformedStakes}
            tokenSymbol={stakeToken.symbol}
          />
          <div
            css={`
              margin-top: ${3 * GU}px;
              display: flex;
              justify-content: space-between;
              ${textStyle('body3')}
            `}
          >
            <span>Total </span>
            <span>
              {formatTokenAmount(totalTokensStaked, stakeToken.decimals)}
              {` `}
              {stakeToken.symbol}
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            css={`
              display: flex;
              justify-content: center;
            `}
          >
            <img src={noSupportIllustration} alt="" />
          </div>
          <div
            css={`
              margin-top: ${3 * GU}px;
              text-align: center;
            `}
          >
            <span
              css={`
                ${textStyle('body2')};
              `}
            >
              This proposal doesn’t have support yet
            </span>
          </div>
        </>
      )}
    </Box>
  )
})

const MemoizedDistribution = React.memo(function MemoizedDistribution({
  stakes,
  tokenSymbol,
}) {
  const theme = useTheme()

  const colors = useMemo(
    () => [theme.green, theme.red, theme.purple, theme.yellow],
    [theme]
  )

  const adjustedStakes = stakes.map(stake => ({
    ...stake,
    percentage: Math.round(stake.percentage),
  }))

  return (
    <Distribution
      colors={colors}
      items={adjustedStakes}
      renderFullLegendItem={({ color, item, percentage }) => {
        return (
          <div
            css={`
              display: flex;
              align-items: center;
              width: 100%;
            `}
          >
            <div
              css={`
                background: ${color};
                width: 8px;
                height: 8px;
                margin-right: ${0.5 * GU}px;
                border-radius: 50%;
              `}
            />
            <DistributionItem
              amount={item.amount}
              entity={item.entity}
              percentage={percentage}
              tokenSymbol={tokenSymbol}
            />
          </div>
        )
      }}
    />
  )
})

const DistributionItem = ({ amount, entity, percentage, tokenSymbol }) => {
  const theme = useTheme()
  const { account } = useWallet()
  const { layoutName } = useLayout()

  const isCurrentUser = addressesEqual(entity, account)
  const compactMode = layoutName === 'medium' || layoutName === 'small'

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <IdentityBadge
        entity={entity}
        connectedAccount={isCurrentUser}
        compact
        labelStyle={`${textStyle('body3')}`}
        css={`
          width: ${compactMode ? 'auto' : '110px'};
        `}
      />
      <div
        css={`
          display: flex;
          ${textStyle('body3')};
        `}
      >
        <span
          css={`
            margin-right: ${0.5 * GU}px;
            color: ${theme.contentSecondary};
          `}
        >
          {percentage}%
        </span>

        <span
          css={`
            margin-right: ${0.5 * GU}px;
          `}
        >
          {amount}
          {` `}
          {tokenSymbol}
        </span>
      </div>
    </div>
  )
}

export default SupportersDistribution
