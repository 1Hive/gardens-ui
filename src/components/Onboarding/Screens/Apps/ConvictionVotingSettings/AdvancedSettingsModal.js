import { Field, Help, TextInput } from '@1hive/1hive-ui'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Modal, PercentageField } from '@components/Onboarding//kit'

const AdvancedSettingsModal = ({
  requestTokenAddress,
  minThresholdStakePct,
  stakeOnProposalPct,
  visible,
  onClose,
  onDone,
}) => {
  const [requestToken, setRequestToken] = useState(requestTokenAddress)
  const [currMinThresholdStakePct, setCurrMinThresholdStakePct] = useState(
    minThresholdStakePct
  )

  const handleMinThresholdChange = useCallback(
    value => {
      setCurrMinThresholdStakePct(value)
    },
    [setCurrMinThresholdStakePct]
  )

  const handleRequestTokenChange = useCallback(
    event => {
      setRequestToken(event.target.value)
    },
    [setRequestToken]
  )

  const handleDone = () => {
    onDone({ currMinThresholdStakePct, requestToken })
    onClose()
  }

  useEffect(() => {
    setCurrMinThresholdStakePct(minThresholdStakePct)
    setRequestToken(requestTokenAddress)
  }, [minThresholdStakePct, requestTokenAddress])

  return (
    <Modal
      title="Advanced Settings"
      visible={visible}
      onClick={handleDone}
      onClose={onClose}
      width="100"
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
        css={`
          width: 500px;
        `}
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
        value={currMinThresholdStakePct}
        onChange={handleMinThresholdChange}
      />
    </Modal>
  )
}

export default AdvancedSettingsModal
