import React, { useMemo } from 'react'
import {
  fromPercentage,
  toPercentage,
} from '@/utils/conviction-modelling-helpers'
import { ResponsiveLine } from '@nivo/line'
import ChartBase from './ChartBase'
import ChartTooltip from './ChartTooltip'
import { TEXT_STYLES, useTheme } from '@1hive/1hive-ui'

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
  stakeOnProposal,
  maxPercentage,
  increment
) => {
  const activeTokensData = [...Array(maxPercentage / increment + 1).keys()].map(
    i => i * increment
  )

  return activeTokensData.map(activeTokensPct => ({
    x: activeTokensPct,
    y: computeMaxConviction(
      activeTokensPct,
      minThresholdStakePct,
      stakeOnProposal
    ),
  }))
}
const MaxConvictionActiveTokensChart = ({
  height,
  width,
  minThresholdStakePct,
  stakeOnProposalPct,
}) => {
  const theme = useTheme()
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
      height={height}
      width={width}
      title="Max Conviction vs Active Tokens"
    >
      <ResponsiveLine
        data={[
          {
            id: 'max-conviction-active-tokens',
            data: chartData,
          },
        ]}
        lineWidth={3}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear' }}
        yFormat=".2f"
        xFormat=".2f"
        tooltip={({ point: { data } }) => (
          <ChartTooltip
            xLabel="Active Tokens:"
            yLabel="Max Conviction:"
            xValue={`${data.xFormatted} %`}
            yValue={`${data.yFormatted} %`}
          />
        )}
        markers={[
          {
            axis: 'x',
            value: minThresholdStakePct,
            lineStyle: { stroke: '#FF9B73', strokeWidth: 2 },
            textStyle: {
              fontSize: `${TEXT_STYLES.body3.size}px`,
              fill: theme.content,
            },
            legend: `threshold (${minThresholdStakePct} %)`,
            legendOrientation: 'vertical',
          },
        ]}
        curve="basis"
        margin={{ right: 30, bottom: 50, left: 50, top: 30 }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          legend: 'active tokens (%)',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          legend: 'max conviction (%)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enablePoints={false}
        useMesh
      />
    </ChartBase>
  )
}

export default MaxConvictionActiveTokensChart
