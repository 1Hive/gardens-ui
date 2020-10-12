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
import { formatTokenAmount } from '../lib/token-utils'
import { stakesPercentages } from '../lib/math-utils'
import { addressesEqualNoSum as addressesEqual } from '../lib/web3-utils'

import noSupportIllustration from '../assets/noSupportIllustration.svg'

const DISTRIBUTION_ITEMS_MAX = 6

function displayedStakes(stakes, total, stakeToken) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map((stake, index) => ({
    item: {
      entity: stake.index === -1 ? 'Others' : stakes[stake.index].entity,
      amount: formatTokenAmount(
        stake.index === -1 ? 0 : stakes[stake.index].amount,
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
  const theme = useTheme()
  const { stakeToken } = useAppState()

  const transformedStakes = useMemo(() => {
    if (!stakes) {
      return null
    }
    return displayedStakes(stakes, totalTokensStaked, stakeToken)
  }, [stakes, totalTokensStaked, stakeToken])

  const colors = [theme.green, theme.red, theme.purple, theme.yellow]

  return (
    <Box heading="Supported by" padding={2 * GU}>
      {stakes.length > 0 ? (
        <>
          <Distribution
            colors={colors}
            items={transformedStakes}
            renderFullLegendItem={({ color, item, index, percentage }) => {
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
                    entity={item.entity.id}
                    percentage={percentage}
                    stakeToken={stakeToken}
                  />
                </div>
              )
            }}
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

const DistributionItem = ({ amount, entity, percentage, stakeToken }) => {
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
        labelStyle={`${textStyle('body4')}`}
        css={`
          width: ${compactMode ? 'auto' : '110px'};
        `}
      />
      <div
        css={`
          display: flex;
          ${textStyle('body4')};
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
          {stakeToken.symbol}
        </span>
      </div>
    </div>
  )
}

export default SupportersDistribution
