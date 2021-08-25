import React, { Fragment } from 'react'
import { Help } from '@1hive/1hive-ui'

import { DurationFields, Modal } from '@components/Onboarding//kit'

const AdvancedSettingsModal = ({
  voteQuietEndingExtension,
  handleQuiteEndingExtensionPeriodChange,
  voteDelegatedVotingPeriod,
  handleDelegatedVotingPeriodChange,
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
      <DurationFields
        label={
          <Fragment>
            Delegated Voting Period
            <Help hint="What is Delegated Voting Period?">
              <strong>Delegated Voting Period</strong> is the period of time,
              within the Vote Duration, when stewards can cast votes that have
              been delegated to them. When this period ends stewards can no
              longer vote.
            </Help>
          </Fragment>
        }
        duration={voteDelegatedVotingPeriod}
        onUpdate={handleDelegatedVotingPeriodChange}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
