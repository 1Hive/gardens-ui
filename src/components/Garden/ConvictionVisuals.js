import React, { useMemo } from 'react'
import {
  GU,
  IconCheck,
  IconCross,
  LoadingRing,
  Tag,
  textStyle,
  Timer,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import styled from 'styled-components'
import LineChart from './ModifiedLineChart'
import SummaryBar from './SummaryBar'

import { useGardenState } from '@providers/GardenState'
import { useProposalEndDate } from '@hooks/useProposals'
import { useWallet } from '@providers/Wallet'

import BigNumber from '@lib/bigNumber'
import { formatTokenAmount } from '@utils/token-utils'
import { isEntitySupporting } from '@lib/conviction'

import challengeIconSvg from '@assets/challenge-icon.svg'

const UNABLE_TO_PASS = 0
const MAY_PASS = 1
const AVAILABLE = 2
const EXECUTED = 3
const CHALLENGED = 4

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
  const { account } = useWallet()

  const {
    futureStakedConviction,
    neededConviction,
    requestedAmount,
    stakedConviction,
    userStakedConviction,
  } = proposal

  const secondSize = stakedConviction.minus(userStakedConviction)
  const thirdSize = futureStakedConviction.minus(stakedConviction)
  const signalingProposal = requestedAmount.eq(0)

  const isSupporting = isEntitySupporting(proposal, account)

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
        <span>
          {stakedConviction.eq(0)
            ? '0'
            : stakedConviction.multipliedBy(new BigNumber('100')).toFixed(2)}
          %{' of the Total Support '}
          {!signalingProposal &&
            (withThreshold ? (
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                {neededConviction
                  ? `(at least ${neededConviction
                      .multipliedBy(new BigNumber('100'))
                      .toFixed(2)}% needed)`
                  : `(threshold out of range)`}
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
            ))}
          {isSupporting && (
            <Tag
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              Supported
            </Tag>
          )}
        </span>
      </div>
    </div>
  )
}

export function ConvictionCountdown({ proposal, shorter }) {
  const { config } = useGardenState()
  const { maxRatio, stakeToken } = config.conviction

  const {
    currentConviction,
    loading,
    neededTokens,
    statusData,
    threshold,
  } = proposal
  const endDate = useProposalEndDate(proposal)

  const view = useMemo(() => {
    if (statusData.executed) {
      return EXECUTED
    }
    if (statusData.challenged) {
      return CHALLENGED
    }
    if (currentConviction.gte(threshold)) {
      return AVAILABLE
    }
    if (endDate) {
      return MAY_PASS
    }
    return UNABLE_TO_PASS
  }, [currentConviction, endDate, statusData, threshold])

  return loading ? (
    <LoadingRing label="Loading" />
  ) : (
    <div
      css={`
        display: grid;
        grid-gap: ${1 * GU}px;
      `}
    >
      {view === UNABLE_TO_PASS ? (
        <NegativeOutcome
          maxRatio={maxRatio}
          neededTokens={neededTokens}
          shorter={shorter}
          stakeToken={stakeToken}
        />
      ) : view === CHALLENGED ? (
        <Outcome
          result="Challenged"
          color="#F5A623"
          icon={<img src={challengeIconSvg} alt="" width="24" height="24" />}
        />
      ) : (
        <PositiveOutcome endDate={endDate} shorter={shorter} view={view} />
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

const PositiveOutcome = ({ endDate, shorter, view }) => {
  const theme = useTheme()

  const text =
    view === MAY_PASS
      ? 'May pass'
      : view === EXECUTED
      ? 'Passed and executed'
      : 'Available for execution'

  return (
    <>
      <Outcome result={text} color={theme.positive} icon={<IconCheck />} />
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

const NegativeOutcome = ({ maxRatio, neededTokens, shorter, stakeToken }) => {
  const theme = useTheme()
  return (
    <>
      <Outcome
        result="Won't pass"
        color={theme.negative}
        icon={<IconCross />}
      />
      {!shorter && (
        <>
          <span
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            {isNaN(neededTokens)
              ? 'Not enough funds in the organization'
              : 'Not enough support received'}
          </span>
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            (
            {isNaN(neededTokens) ? (
              `Funding requests must be below ${maxRatio *
                100}% of organization total funds`
            ) : (
              <React.Fragment>
                At least{' '}
                <Tag>
                  {`${formatTokenAmount(neededTokens, stakeToken.decimals)} ${
                    stakeToken.symbol
                  }`}
                </Tag>{' '}
                more needed
              </React.Fragment>
            )}
            ).
          </span>
        </>
      )}
    </>
  )
}

const Outcome = ({ color, icon, result }) => {
  return (
    <div
      css={`
        color: ${color};
        display: flex;
        align-items: center;
      `}
    >
      {icon}{' '}
      <span
        css={`
          margin-left: ${0.5 * GU}px;
        `}
      >
        {result}
      </span>
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
