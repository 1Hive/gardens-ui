import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import { TEXT_STYLES, useTheme } from '@1hive/1hive-ui'
import {
  calculateThreshold,
  fromPercentage,
  toPercentage,
} from '@/utils/conviction-modelling-helpers'
import ChartBase from './ChartBase'
import ChartTooltip from './ChartTooltip'

const DEFAULT_INCREMENT = 1 / 3

const generateRequestedAmountData = (maxRatioPct, weight, increment) => {
  const maxRatio = fromPercentage(maxRatioPct)
  const maxRequestedAmount = toPercentage(maxRatio - Math.sqrt(weight))
  const data = [...Array(Math.ceil(maxRequestedAmount) / increment + 1).keys()]
    .map(i => i * increment)
    // Filter out any requested amount that needs more than 100% of conviction
    .filter(requestedAmount => requestedAmount < maxRequestedAmount)

  return [...data, maxRequestedAmount]
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

const ThresholdRequestedChart = ({
  title,
  height,
  width,
  maxRatioPct,
  thresholdPct,
  weight,
}) => {
  const theme = useTheme()
  const chartData = useMemo(
    () => computeChartData(maxRatioPct, weight, DEFAULT_INCREMENT),
    [maxRatioPct, weight]
  )

  return (
    <ChartBase title={title} height={height} width={width}>
      <ResponsiveLine
        data={[
          {
            id: 'threshold',
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
            xLabel="Requested"
            yLabel="Threshold"
            xValue={`${data.xFormatted} %`}
            yValue={`${data.yFormatted} %`}
          />
        )}
        markers={[
          {
            axis: 'x',
            value: thresholdPct,
            lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
            textStyle: {
              fontSize: `${TEXT_STYLES.body3.size}px`,
              fill: theme.content,
            },
            legend: `threshold (${thresholdPct} %)`,
          },
        ]}
        curve="natural"
        margin={{ right: 30, bottom: 50, left: 50, top: 30 }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          legend: 'requested funds (%)',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          legend: 'threshold (%)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enablePoints={false}
        useMesh
      />
    </ChartBase>
  )
}

ThresholdRequestedChart.propTypes = {
  title: PropTypes.node,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  maxRatioPct: PropTypes.number.isRequired,
  thresholdPct: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
}

export default ThresholdRequestedChart
