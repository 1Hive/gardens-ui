import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import {
  ChartBase,
  ChartTooltip,
} from '@components/Onboarding/kit/ChartComponents'
import { useCharts } from '@providers/Charts'
import {
  calculateConviction,
  calculateMaxConviction,
  generateElements,
  toPercentage,
} from '@utils/conviction-modelling-helpers'

const DEFAULT_INCREMENT = 1 / 2
const DEFAULT_MAX_DAY = 20

const computeChartData = (
  decay,
  stakeOnProposal,
  stakeOnOtherProposals,
  minActiveStakePct,
  maxDay,
  increment
) => {
  const timeData = generateElements(maxDay, increment)

  const totalStakePct = Math.max(
    stakeOnProposal + stakeOnOtherProposals,
    minActiveStakePct
  )
  const maxConviction = calculateMaxConviction(totalStakePct, decay)

  return timeData.map(time => ({
    x: time,
    y: toPercentage(
      calculateConviction(0, stakeOnProposal, time, decay) / maxConviction
    ),
  }))
}

const ConvictionTimeChart = React.memo(
  ({
    title,
    height,
    width,
    decay,
    minActiveStakePct,
    stakeOnOtherProposalsPct,
    stakeOnProposalPct,
    thresholdPct,
  }) => {
    const { commonProps, createAxis, createMarker } = useCharts()
    const chartData = useMemo(
      () =>
        computeChartData(
          decay,
          stakeOnProposalPct,
          stakeOnOtherProposalsPct,
          minActiveStakePct,
          DEFAULT_MAX_DAY,
          DEFAULT_INCREMENT
        ),
      [decay, stakeOnProposalPct, stakeOnOtherProposalsPct, minActiveStakePct]
    )
    const maxYValue = chartData[chartData.length - 1].y
    const isOverMax = thresholdPct === 'Infinity' || thresholdPct > 100
    const thresholdValue =
      isOverMax || thresholdPct > maxYValue ? maxYValue : thresholdPct

    return (
      <ChartBase title={title} height={height} width={width}>
        <ResponsiveLine
          {...commonProps}
          data={[
            {
              id: 'conviction',
              data: chartData,
            },
          ]}
          tooltip={({
            point: {
              data: { x, xFormatted, yFormatted },
            },
          }) => (
            <ChartTooltip
              xLabel="Time"
              yLabel="Conviction"
              xValue={`${xFormatted} day${x !== 1 ? 's' : ''}`}
              yValue={`${yFormatted} %`}
            />
          )}
          markers={[
            createMarker(
              'y',
              thresholdValue,
              `Threshold (${isOverMax ? '∞' : `${thresholdPct}%`})`
            ),
          ]}
          axisBottom={createAxis('time (days)', 'bottom')}
          axisLeft={createAxis('conviction (%)', 'left')}
        />
      </ChartBase>
    )
  }
)

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
