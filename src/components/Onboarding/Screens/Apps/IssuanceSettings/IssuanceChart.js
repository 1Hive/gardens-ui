import React, { useMemo } from 'react'
import { ChartBase } from '@components/Onboarding/kit/ChartComponents'
import { ResponsiveLine } from '@nivo/line'
import { useCharts } from '@/providers/Charts'
import { generateElements } from '@/utils/conviction-modelling-helpers'

const DEFAULT_MAX_MONTH = 12
const DEFAULT_INCREMENT = 12 / 365

const calculateRatio = (
  initialRatio,
  targetRatio = 0.001,
  maxAdjustmentRatioPerYear
) => {
  let balance = initialRatio
  let supply = 1
  const ratio = [balance / supply]
  for (let i = 0; i < 365; i++) {
    const adj = ((1.0 - balance / supply / targetRatio) / 365) * supply
    const maxAdj = maxAdjustmentRatioPerYear / 365 / targetRatio
    const totalAdj = Math.sign(adj) * Math.min(Math.abs(adj), maxAdj)
    balance += totalAdj
    supply += totalAdj
    ratio.push(balance / supply)
  }
  return ratio
}
const computeChartData = (
  initialRatio,
  targetRatio,
  maxAdjustmentRatioPerYear,
  maxMonth,
  increment
) => {
  const timeData = generateElements(maxMonth, increment)
  const ratios = calculateRatio(
    initialRatio / 100,
    targetRatio / 100,
    maxAdjustmentRatioPerYear / 100
  )

  return timeData.map((time, i) => ({
    x: time,
    y: ratios[i] * 100 || 0,
  }))
}

const IssuanceChart = ({
  height,
  width,
  initialRatio,
  targetRatio,
  maxAdjustmentRatioPerYear,
}) => {
  const { commonProps, createAxis } = useCharts()
  const chartData = useMemo(
    () =>
      computeChartData(
        initialRatio,
        targetRatio,
        maxAdjustmentRatioPerYear,
        DEFAULT_MAX_MONTH,
        DEFAULT_INCREMENT
      ),
    [maxAdjustmentRatioPerYear, targetRatio, initialRatio]
  )
  return (
    <div>
      <ChartBase title="Ratio over first year" height={height} width={width}>
        <ResponsiveLine
          {...commonProps}
          data={[{ id: 'ratio-time', data: chartData }]}
          axisBottom={createAxis('time (months)', 'bottom')}
          axisLeft={createAxis('ratio (%)', 'left')}
        />
      </ChartBase>
    </div>
  )
}

export default IssuanceChart
