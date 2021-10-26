import { Help } from '@1hive/1hive-ui'
import React, { Fragment } from 'react'
import { Modal, PercentageField } from '@components/Onboarding//kit'

const AdvancedSettingsModal = ({
  minThresholdStakePct,
  handleMinThresholdStakePctChange,
  visible,
  onClose,
}) => {
  const handleDone = () => {
    onClose()
  }

  return (
    <Modal
      title="Advanced Settings"
      visible={visible}
      onClick={handleDone}
      onClose={onClose}
      width="600px"
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
        value={minThresholdStakePct}
        onChange={handleMinThresholdStakePctChange}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
