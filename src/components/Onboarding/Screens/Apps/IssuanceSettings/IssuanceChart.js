import React, { useMemo } from 'react'
import { ChartBase } from '@components/Onboarding/kit/ChartComponents'
import { ResponsiveLine } from '@nivo/line'
import { useCharts } from '@/providers/Charts'
import { generateElements } from '@/utils/conviction-modelling-helpers'
import { YEARS_IN_SECONDS } from '@/utils/kit-utils'

const DEFAULT_MAX_MONTH = 12
const DEFAULT_INCREMENT = 1 / 2

const calculateRatio = maxAdjustmentRatioPerSeconds => {
  // TODO: calculate ratio...
  return 0
}
const computeChartData = (
  maxAdjustmentRatioPerYear,
  targetRatio,
  maxMonth,
  increment
) => {
  const maxAdjustmentRatioPerSeconds =
    maxAdjustmentRatioPerYear * YEARS_IN_SECONDS
  const timeData = generateElements(maxMonth, increment)

  return timeData.map(time => ({
    x: time,
    y: calculateRatio(maxAdjustmentRatioPerSeconds),
  }))
}

const IssuanceChart = ({
  height,
  width,
  maxAdjustmentRatioPerYear,
  targetRatio,
}) => {
  const { commonProps, createAxis } = useCharts()
  const chartData = useMemo(
    () =>
      computeChartData(
        maxAdjustmentRatioPerYear,
        targetRatio,
        DEFAULT_MAX_MONTH,
        DEFAULT_INCREMENT
      ),
    [maxAdjustmentRatioPerYear, targetRatio]
  )
  return (
    <div>
      <ChartBase title="Ratio vs Time" height={height} width={width}>
        <ResponsiveLine
          {...commonProps}
          data={[{ id: 'ratio-time', data: chartData }]}
          axisBottom={createAxis('time (months)', 'bottom')}
          axisLeft={createAxis('ratio(%)', 'left')}
        />
      </ChartBase>
    </div>
  )
}

export default IssuanceChart
