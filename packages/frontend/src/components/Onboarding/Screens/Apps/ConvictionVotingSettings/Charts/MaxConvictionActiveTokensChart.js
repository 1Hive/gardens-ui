import React, { useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'
import {
  ChartBase,
  ChartTooltip,
} from '@components/Onboarding/kit/ChartComponents'
import { useCharts } from '@providers/Charts'
import {
  fromPercentage,
  generateElements,
  toPercentage,
} from '@utils/conviction-modelling-helpers'

const DEFAULT_INCREMENT = 1
const DEFAULT_MAX_PERCENTAGE = 100

const computeMaxConviction = (
  activeTokensPct,
  minThresholdStakePct,
  stakeOnProposalPct
) => {
  const activeTokens = fromPercentage(activeTokensPct)
  const minThresholdStake = fromPercentage(minThresholdStakePct)
  const stakeOnProposal = fromPercentage(stakeOnProposalPct)

  return toPercentage(
    stakeOnProposal /
      Math.max(activeTokens, Math.max(stakeOnProposal, minThresholdStake))
  )
}

const computeChartData = (
  minThresholdStakePct,
  stakeOnProposalPct,
  maxPercentage,
  increment
) => {
  const activeTokensData = generateElements(maxPercentage, increment)

  return activeTokensData.map(activeTokensPct => ({
    x: activeTokensPct,
    y: computeMaxConviction(
      activeTokensPct,
      minThresholdStakePct,
      stakeOnProposalPct
    ),
  }))
}
const MaxConvictionActiveTokensChart = ({
  height,
  width,
  minThresholdStakePct,
  stakeOnProposalPct,
}) => {
  const { commonProps, createAxis, createMarker } = useCharts()
  const chartData = useMemo(
    () =>
      computeChartData(
        minThresholdStakePct,
        stakeOnProposalPct,
        DEFAULT_MAX_PERCENTAGE,
        DEFAULT_INCREMENT
      ),
    [minThresholdStakePct, stakeOnProposalPct]
  )

  return (
    <ChartBase
      title="Max Conviction vs Active Tokens"
      height={height}
      width={width}
    >
      <ResponsiveLine
        {...commonProps}
        data={[
          {
            id: 'max-conviction-active-tokens',
            data: chartData,
          },
        ]}
        tooltip={({ point: { data } }) => (
          <ChartTooltip
            xLabel="Active Tokens:"
            yLabel="Max Conviction:"
            xValue={`${data.xFormatted} %`}
            yValue={`${data.yFormatted} %`}
          />
        )}
        markers={[
          createMarker(
            'x',
            minThresholdStakePct,
            `Minimum active stake (${minThresholdStakePct}%)`
          ),
        ]}
        axisBottom={createAxis('active tokens (%)', 'bottom')}
        axisLeft={createAxis('max conviction (%)', 'left')}
      />
    </ChartBase>
  )
}

export default MaxConvictionActiveTokensChart
