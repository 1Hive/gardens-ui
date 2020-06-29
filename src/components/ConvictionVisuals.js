import React, { useMemo } from 'react'
import {
  GU,
  IconCheck,
  IconCross,
  Tag,
  textStyle,
  Timer,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import styled from 'styled-components'
import LineChart from './ModifiedLineChart'
import SummaryBar from './SummaryBar'
import { useAppState } from '../providers/AppState'
import { useBlockTime } from '../hooks/useBlock'

import BigNumber from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'

const UNABLE_TO_PASS = 0
const MAY_PASS = 1
const AVAILABLE = 2
const EXECUTED = 3

export function ConvictionChart({ proposal, withThreshold = true, lines }) {
  const { maxConviction, threshold } = proposal
  const theme = useTheme()

  // We want conviction and threhsold in percentages
  const normalize = n => n / maxConviction
  const normalizeLines = lines => {
    return lines.map(line => line.map(normalize))
  }

  return (
    <LineChart
      lines={normalizeLines(lines)}
      total={lines[0] && lines[0].length}
      label={i => i - Math.floor((lines[0].length - 1) / 2)}
      captionsHeight={20}
      color={i => [theme.info, theme.infoSurfaceContent][i]}
      threshold={
        withThreshold &&
        !Number.isNaN(threshold) &&
        threshold &&
        normalize(threshold)
      }
    />
  )
}

export function ConvictionBar({ proposal, withThreshold = true }) {
  const theme = useTheme()

  const {
    userStakedConviction,
    stakedConviction,
    futureStakedConviction,
    neededConviction,
  } = proposal

  const secondSize = stakedConviction.minus(userStakedConviction)
  const thirdSize = futureStakedConviction.minus(stakedConviction)

  return (
    <div>
      <SummaryBar
        firstSize={userStakedConviction.toNumber()}
        secondSize={secondSize.toNumber()}
        thirdSize={thirdSize.toNumber()}
        requiredSize={withThreshold && neededConviction?.toNumber()}
        compact
      />
      <div>
        <span
          css={`
            ${textStyle('body3')}
          `}
        >
          {Math.round(stakedConviction * 100)}%{' '}
          {withThreshold ? (
            <span
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              {neededConviction
                ? `(${Math.round(
                    neededConviction.multipliedBy(new BigNumber('100'))
                  )}% needed)`
                : `(&infin; needed)`}
            </span>
          ) : (
            <span
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              {Math.round(stakedConviction * 100) !==
              Math.round(futureStakedConviction * 100)
                ? `(predicted: ${Math.round(futureStakedConviction * 100)}%)`
                : `(stable)`}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export function ConvictionCountdown({ proposal, shorter }) {
  const {
    maxRatio,
    stakeToken: { symbol, decimals },
  } = useAppState()

  const theme = useTheme()
  const {
    executed,
    threshold,
    remainingTimeToPass,
    neededTokens,
    currentConviction,
  } = proposal

  const view = useMemo(() => {
    if (executed) {
      return EXECUTED
    }
    if (currentConviction.gte(threshold)) {
      return AVAILABLE
    }
    if (remainingTimeToPass > 0) {
      return MAY_PASS
    }
    return UNABLE_TO_PASS
  }, [currentConviction, executed, threshold, remainingTimeToPass])

  return (
    <div
      css={`
        display: grid;
        grid-gap: ${1 * GU}px;
      `}
    >
      {view === UNABLE_TO_PASS ? (
        <>
          <Outcome result="Won't pass" positive={false} />
          {!shorter && (
            <>
              <span
                css={`
                  color: ${theme.surfaceContent};
                `}
              >
                {!isNaN(neededTokens)
                  ? 'Insufficient staked tokens'
                  : 'Not enough funds in the organization'}
              </span>
              <span
                css={`
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                (
                {!isNaN(neededTokens) ? (
                  <React.Fragment>
                    At least{' '}
                    <Tag>
                      {`${formatTokenAmount(neededTokens, decimals)} ${symbol}`}
                    </Tag>{' '}
                    more needed
                  </React.Fragment>
                ) : (
                  `Funding requests must be below ${maxRatio *
                    100}% organization total funds`
                )}
                ).
              </span>
            </>
          )}
        </>
      ) : (
        <PositiveOutcome
          remainingTimeToPass={remainingTimeToPass}
          shorter={shorter}
          view={view}
        />
      )}
    </div>
  )
}

export function ConvictionTrend({ proposal }) {
  const { convictionTrend } = proposal

  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const percentage = convictionTrend.gt(new BigNumber('0.1'))
    ? Math.round(convictionTrend.toNumber() * 100)
    : Math.round(convictionTrend.toNumber() * 1000) / 10

  return (
    <TrendWrapper compactMode={compactMode} color={theme.contentSecondary}>
      <TrendArrow>
        {convictionTrend > 0 ? '↑' : convictionTrend < 0 ? '↓' : '↝'}
      </TrendArrow>
      <span
        css={`
          ${textStyle('body3')}
        `}
      >
        {percentage > 0 && '+'}
        {percentage}%
      </span>
    </TrendWrapper>
  )
}

const PositiveOutcome = ({ remainingTimeToPass, shorter, view }) => {
  const theme = useTheme()

  const NOW = Date.now()
  const blockTimeInSeconds = useBlockTime()

  const BLOCK_TIME = 1000 * blockTimeInSeconds
  const endDate =
    !isNaN(new Date(NOW + remainingTimeToPass * BLOCK_TIME).getTime()) &&
    new Date(NOW + remainingTimeToPass * BLOCK_TIME)

  const text =
    view === MAY_PASS
      ? 'May pass'
      : view === EXECUTED
      ? 'Executed'
      : 'Available for execution'

  return (
    <>
      <Outcome result={text} positive />
      {!shorter && view === MAY_PASS && (
        <>
          <span
            css={`
              color: ${theme.contentSecondary};
            `}
          >
            Estimate until pass
          </span>
          {!!endDate && <Timer end={endDate} />}
        </>
      )}
    </>
  )
}

const Outcome = ({ result, positive }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        color: ${theme[positive ? 'positive' : 'negative']};
        display: flex;
        align-items: center;
      `}
    >
      {positive ? <IconCheck /> : <IconCross />} {result}
    </div>
  )
}

const TrendWrapper = styled.span`
  display: flex;
  align-items: center;
  ${({ color }) => color && `color: ${color};`}
  ${({ compactMode }) => !compactMode && 'text-align: center;'}
`

const TrendArrow = styled.span`
  ${textStyle('title4')}
  margin-right: 8px;
`
