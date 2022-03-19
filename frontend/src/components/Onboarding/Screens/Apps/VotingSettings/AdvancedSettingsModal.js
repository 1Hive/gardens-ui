import React, { Fragment } from 'react'
import { Help } from '@1hive/1hive-ui'

import { DurationFields, Modal } from '@components/Onboarding//kit'

const AdvancedSettingsModal = ({
  voteQuietEndingExtension,
  handleQuiteEndingExtensionPeriodChange,
  visible,
  onClose,
}) => {
  const handleDoneClick = () => {
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
      <DurationFields
        label={
          <Fragment>
            Quite Ending Extension
            <Help hint="What is Quite Ending Extension?">
              <strong>Quite Ending Extension</strong> is the voting duration
              extension that triggers only from a vote outcome flipping during
              the Quiet Ending Period. This will add the specified amount of
              time to the vote duration allowing any voters (except stewards)
              more time to vote. If an outcome is flipped again during the Quiet
              Ending Extension another extension will trigger. There is no limit
              on how many times an extension can be triggered.
            </Help>
          </Fragment>
        }
        duration={voteQuietEndingExtension}
        onUpdate={handleQuiteEndingExtensionPeriodChange}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
