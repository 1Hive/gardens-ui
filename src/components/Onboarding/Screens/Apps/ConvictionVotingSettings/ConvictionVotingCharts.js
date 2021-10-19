import { GU } from '@1hive/1hive-ui'
import React, { useMemo } from 'react'
import ConvictionTimeChart from './Charts/ConvictionTimeChart'
import ThresholdRequestedChart from './Charts/ThresholdRequestedChart'

import {
  calculateThreshold,
  toPercentage,
} from '@utils/conviction-modelling-helpers'

const CHART_HEIGHT = '270px;'
const CHART_WIDTH = '550px;'

const ConvictionVotingCharts = ({
  decay,
  maxRatio,
  minActiveStakePct,
  requestedAmount,
  stakeOnProposal,
  stakeOnOtherProposals,
  weight,
}) => {
  const requestedAmountThresholdPct = useMemo(() => {
    return toPercentage(
      calculateThreshold(weight, maxRatio, requestedAmount)
    ).toFixed(2)
  }, [maxRatio, requestedAmount, weight])

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
          margin-right: ${5 * GU}px;
        `}
      >
        <ConvictionTimeChart
          title="Conviction vs Time"
          height={CHART_HEIGHT}
          width={CHART_WIDTH}
          decay={decay}
          minActiveStakePct={minActiveStakePct}
          stakeOnOtherProposalsPct={stakeOnOtherProposals}
          stakeOnProposalPct={stakeOnProposal}
          thresholdPct={requestedAmountThresholdPct}
        />
      </div>
      <ThresholdRequestedChart
        title="Threshold vs Requested Funds"
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        maxRatioPct={maxRatio}
        thresholdPct={requestedAmountThresholdPct}
        weight={weight}
      />
    </div>
  )
}

export default ConvictionVotingCharts
