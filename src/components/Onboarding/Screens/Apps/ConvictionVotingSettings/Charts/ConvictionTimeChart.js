import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import {
  calculateConviction,
  calculateMaxConviction,
  toPercentage,
} from '@/utils/conviction-modelling-helpers'
import { TEXT_STYLES, useTheme } from '@1hive/1hive-ui'
import ChartBase from './ChartBase'
import ChartTooltip from './ChartTooltip'

const DEFAULT_INCREMENT = 1 / 2
const DEFAULT_MAX_DAY = 20

const computeChartData = (
  decay,
  stakeOnProposal,
  totalStakePct,
  maxDay,
  increment
) => {
  const timeData = [...Array(maxDay / increment + 1).keys()].map(
    i => i * increment
  )
  const maxConviction = calculateMaxConviction(totalStakePct, decay)

  return timeData.map(time => ({
    x: time,
    y: toPercentage(
      calculateConviction(0, stakeOnProposal, time, decay) / maxConviction
    ),
  }))
}

const ConvictionTimeChart = ({
  title,
  height,
  width,
  decay,
  minActiveStakePct,
  stakeOnProposalPct,
  stakeOnOtherProposalsPct,
  thresholdPct,
}) => {
  const theme = useTheme()
  const totalStakePct = stakeOnProposalPct + stakeOnOtherProposalsPct
  const chartData = useMemo(() => {
    const data = computeChartData(
      decay,
      stakeOnProposalPct,
      totalStakePct > minActiveStakePct ? totalStakePct : minActiveStakePct,
      DEFAULT_MAX_DAY,
      DEFAULT_INCREMENT
    )
    return data
  }, [decay, minActiveStakePct, stakeOnProposalPct, totalStakePct])

  return (
    <ChartBase title={title} height={height} width={width}>
      <ResponsiveLine
        data={[
          {
            id: 'conviction',
            data: chartData,
          },
        ]}
        lineWidth={3}
        colors={['#7CE0D6']}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear' }}
        yFormat=".2f"
        tooltip={({ point: { data } }) => (
          <ChartTooltip
            xLabel="Time"
            yLabel="Conviction"
            xValue={`${data.xFormatted} day${data.x !== 1 ? 's' : ''}`}
            yValue={`${data.yFormatted} %`}
          />
        )}
        markers={[
          {
            axis: 'y',
            value: thresholdPct,
            lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
            textStyle: {
              fontSize: `${TEXT_STYLES.body3.size}px`,
              fill: theme.content,
            },
            legend: `Threshold (${thresholdPct} %)`,
          },
        ]}
        curve="natural"
        margin={{ right: 30, bottom: 50, left: 50, top: 30 }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          legend: 'time (days)',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          legend: 'conviction (%)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enablePoints={false}
        useMesh
      />
    </ChartBase>
  )
}

ConvictionTimeChart.propTypes = {
  title: PropTypes.node,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  decay: PropTypes.number.isRequired,
  minActiveStakePct: PropTypes.number.isRequired,
  stakeOnProposalPct: PropTypes.number.isRequired,
  stakeOnOtherProposalsPct: PropTypes.number.isRequired,
  thresholdPct: PropTypes.string.isRequired,
}

export default ConvictionTimeChart
