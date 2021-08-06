import React, { useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'
import {
  ChartBase,
  ChartTooltip,
} from '@components/Onboarding/kit/ChartComponents'
import { useCharts } from '@providers/Charts'
import {
  calculateThreshold,
  fromPercentage,
  generateElements,
  toPercentage,
} from '@utils/conviction-modelling-helpers'

const DEFAULT_INCREMENT = 1 / 3

const generateRequestedAmountData = (maxRatioPct, weight, increment) => {
  const maxRatio = fromPercentage(maxRatioPct)
  const maxRequestedAmount = toPercentage(maxRatio - Math.sqrt(weight))
  const requestedAmountData = generateElements(
    Math.ceil(maxRequestedAmount),
    increment
  )
    // Filter out any requested amount that needs more than 100% of conviction
    .filter(requestedAmount => requestedAmount < maxRequestedAmount)

  return [...requestedAmountData, maxRequestedAmount]
}
const computeChartData = (maxRatioPct, weight, increment) => {
  const requestedAmountData = generateRequestedAmountData(
    maxRatioPct,
    weight,
    increment
  )

  return requestedAmountData.map(requested => ({
    x: requested,
    y: toPercentage(calculateThreshold(weight, maxRatioPct, requested)),
  }))
}

const ThresholdRequestedChart = React.memo(
  ({ title, height, width, maxRatioPct, thresholdPct, weight }) => {
    const { commonProps, createAxis, createMarker } = useCharts()
    const chartData = useMemo(
      () => computeChartData(maxRatioPct, weight, DEFAULT_INCREMENT),
      [maxRatioPct, weight]
    )
    const maxXValue = chartData[chartData.length - 1].x
    const isOverMax = thresholdPct === 'Infinity' || thresholdPct > 100
    const thresholdValue =
      isOverMax || thresholdPct > maxXValue ? maxXValue : thresholdPct

    return (
      <ChartBase title={title} height={height} width={width}>
        <ResponsiveLine
          {...commonProps}
          data={[
            {
              id: 'threshold',
              data: chartData,
            },
          ]}
          tooltip={({ point: { data } }) => (
            <ChartTooltip
              xLabel="Requested"
              yLabel="Threshold"
              xValue={`${data.xFormatted} %`}
              yValue={`${data.yFormatted} %`}
            />
          )}
          markers={[
            createMarker(
              'x',
              thresholdValue,
              `Threshold (${isOverMax ? '∞' : `${thresholdPct}%`})`
            ),
          ]}
          axisBottom={createAxis('requested (%)', 'bottom')}
          axisLeft={createAxis('threshold (%)', 'left')}
        />
      </ChartBase>
    )
  }
)

export default ThresholdRequestedChart
