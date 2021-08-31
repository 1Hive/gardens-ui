import { Help } from '@1hive/1hive-ui'
import React, { Fragment, useCallback, useState } from 'react'
import { Modal, PercentageField } from '@components/Onboarding//kit'
import MaxConvictionActiveTokensChart from '@components/Onboarding/Screens/Apps/ConvictionVotingSettings/Charts/MaxConvictionActiveTokensChart'

const CHART_HEIGHT = '350px'
const CHART_WIDTH = '700px'

const AdvancedSettingsModal = ({
  minThresholdStakePct,
  stakeOnProposalPct,
  visible,
  onClose,
  onDone,
}) => {
  const [currMinThresholdStakePct, setCurrMinThresholdStakePct] = useState(
    minThresholdStakePct
  )

  const handleMinThresholdChange = useCallback(
    value => {
      setCurrMinThresholdStakePct(value)
    },
    [setCurrMinThresholdStakePct]
  )

  const handleDone = () => {
    onDone(currMinThresholdStakePct)
    onClose()
  }

  return (
    <Modal
      title="Advanced Settings"
      visible={visible}
      onClick={handleDone}
      onClose={onClose}
      width="100"
    >
      <PercentageField
        label={
          <Fragment>
            Minimum Active Stake
            <Help hint="What is Minimum Active Stake?">
              <strong>Minimum Active Stake</strong> is the mininum percentage of
              stake token active supply that is used for calculating the
              threshold.
            </Help>
          </Fragment>
        }
        value={currMinThresholdStakePct}
        onChange={handleMinThresholdChange}
      />
      <MaxConvictionActiveTokensChart
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        minThresholdStakePct={currMinThresholdStakePct}
        stakeOnProposalPct={stakeOnProposalPct}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
