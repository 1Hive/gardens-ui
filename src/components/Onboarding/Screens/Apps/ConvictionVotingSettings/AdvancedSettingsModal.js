import { Field, Help, TextInput } from '@1hive/1hive-ui'
import React, { Fragment } from 'react'
import { Modal, PercentageField } from '@components/Onboarding//kit'

const AdvancedSettingsModal = ({
  requestToken,
  minThresholdStakePct,
  handleRequestTokenChange,
  handleMinThresholdStakePctChange,
  visible,
  onClose,
  onDone,
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
      <Field
        label={
          <React.Fragment>
            Request Token
            <Help hint="What is Request Token?">
              <strong>Request Token</strong> is the address of the token held on
              the common pool. It is the token used to fund conviction voting
              proposals.
            </Help>
          </React.Fragment>
        }
      >
        {({ id }) => (
          <TextInput
            id={id}
            onChange={handleRequestTokenChange}
            placeholder="Request Token Address"
            value={requestToken}
            wide
          />
        )}
      </Field>
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
