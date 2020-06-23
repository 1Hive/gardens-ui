import React, { useMemo } from 'react'
import {
  Box,
  Distribution,
  Field,
  GU,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { useAppState } from '../providers/AppState'
import { formatTokenAmount } from '../lib/token-utils'
import { stakesPercentages, pct } from '../lib/math-utils'
import BigNumber from '../lib/bigNumber'

const DISTRIBUTION_ITEMS_MAX = 6

function displayedStakes(stakes, total) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map((stake, index) => ({
    item:
      stake.index === -1
        ? 'Others'
        : `#${stakes[stake.index].proposalId}${' '}${
            stakes[stake.index].proposalName
          }`,
    percentage: stake.percentage,
  }))
}

const StakingTokens = React.memo(function StakingTokens({
  myStakes,
  totalActiveTokens,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const compact = below('large')
  const { accountBalance, stakeToken, totalSupply } = useAppState()

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const stakes = useMemo(() => {
    if (!myStakes || !myActiveTokens) {
      return null
    }
    return displayedStakes(myStakes, myActiveTokens)
  }, [myStakes, myActiveTokens])

  const inactiveTokens = useMemo(() => {
    if (!accountBalance.gte(0) || !myActiveTokens) {
      return new BigNumber('0')
    }
    return accountBalance.minus(myActiveTokens)
  }, [accountBalance, myActiveTokens])

  return (
    <Box heading="Staking tokens" padding={0}>
      <div
        css={`
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <div
          css={`
            padding: ${3 * GU}px;
          `}
        >
          <Field
            label="Your tokens"
            css={`
              margin-bottom: 0px;
            `}
          >
            <div
              css={`
                ${textStyle('title2')};
              `}
            >
              {`${
                accountBalance
                  ? formatTokenAmount(accountBalance, stakeToken.decimals)
                  : '-'
              } ${stakeToken.symbol}`}
            </div>
            <div
              css={`
                ${textStyle('body4')};
                color: ${theme.contentSecondary};
              `}
            >
              {accountBalance.gte(0) ? pct(accountBalance, totalSupply) : '-'}%
              of total tokens
            </div>
          </Field>
        </div>
      </div>
      {myStakes && myActiveTokens.gt(new BigNumber('0')) && (
        <div
          css={`
            border-bottom: 1px solid ${theme.border};
          `}
        >
          <div
            css={`
              padding: ${3 * GU}px;
            `}
          >
            <Field
              label="Your active tokens"
              css={`
                margin-bottom: 0px;
              `}
            >
              <div
                css={`
                  ${textStyle('title2')};
                  color: ${theme.infoSurfaceContent};
                `}
              >
                {`${
                  myActiveTokens
                    ? formatTokenAmount(myActiveTokens, stakeToken.decimals)
                    : '-'
                } ${stakeToken.symbol}`}
              </div>
              <div
                css={`
                  ${textStyle('body4')};
                  color: ${theme.contentSecondary};
                `}
              >
                Total Active Tokens:{' '}
                {formatTokenAmount(totalActiveTokens, stakeToken.decimals)}{' '}
                {stakeToken.symbol}
              </div>
            </Field>

            <Field
              label="SUPPORTED PROPOSALS"
              css={`
                margin-top: ${3 * GU}px;
              `}
            >
              <div
                css={`
                  margin-top: ${2 * GU}px;
                `}
              >
                <Distribution
                  heading="Your active token distribution"
                  items={stakes}
                  renderLegendItem={({ item }) => {
                    return (
                      <div
                        css={`
                          background: #daeaef;
                          border-radius: 3px;
                          padding: ${0.5 * GU}px ${1 * GU}px;
                          width: ${compact ? '100%' : `${18 * GU}px`};
                          text-overflow: ellipsis;
                          overflow: hidden;
                          white-space: nowrap;
                        `}
                      >
                        {item}
                      </div>
                    )
                  }}
                />
              </div>
            </Field>
          </div>
        </div>
      )}
      <div
        css={`
          padding-left: ${3 * GU}px;
          padding-right: ${3 * GU}px;
          padding-top: ${3 * GU}px;
        `}
      >
        <Field label="Your inactive tokens">
          <div
            css={`
              ${textStyle('title2')};
            `}
          >
            {`${
              inactiveTokens
                ? formatTokenAmount(inactiveTokens, stakeToken.decimals)
                : '-'
            } ${stakeToken.symbol}`}
          </div>
        </Field>
      </div>
    </Box>
  )
})

export default StakingTokens
