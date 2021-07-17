import { Help } from '@1hive/1hive-ui'
import React, { Fragment, useCallback, useState } from 'react'
import { useOnboardingState } from '@/providers/Onboarding'
import { Modal, PercentageField } from '../../../kit'
import MaxConvictionActiveTokensChart from './Charts/MaxConvictionActiveTokensChart'

const CHART_HEIGHT = '350px'
const CHART_WIDTH = '700px'

const AdvancedSettingsModal = ({ stakeOnProposalPct, visible, onClose }) => {
  const { config, onConfigChange } = useOnboardingState()
  const [minThresholdStakePct, setMinThresholdStakePct] = useState(
    config.conviction.minThresholdStakePct
  )

  const handleMinThresholdStakePct = useCallback(
    value => {
      setMinThresholdStakePct(value)
    },
    [setMinThresholdStakePct]
  )

  const handleDoneClick = () => {
    onConfigChange('conviction', { ...config.conviction, minThresholdStakePct })
    onClose()
  }

  return (
    <Modal
      title="Advanced Settings"
      visible={visible}
      onClick={handleDoneClick}
      onClose={onClose}
      width="100"
    >
      <PercentageField
        label={
          <Fragment>
            Minimum Active Stake
            <Help hint="What is Minimum Active Stake?">
              <strong>Minimum Active Stake</strong> is the mininum percent of
              stake token active supply that is used for calculating the
              threshold.
            </Help>
          </Fragment>
        }
        value={minThresholdStakePct}
        onChange={handleMinThresholdStakePct}
      />
      <MaxConvictionActiveTokensChart
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        minThresholdStakePct={minThresholdStakePct}
        stakeOnProposalPct={stakeOnProposalPct}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
