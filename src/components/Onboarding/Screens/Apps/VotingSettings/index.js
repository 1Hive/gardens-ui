import React, {
  Fragment,
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'react'
import { Button, GU, Help, Info } from '@1hive/1hive-ui'

import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '@components/Onboarding/Navigation'
import {
  DurationFields,
  Header,
  PercentageField,
} from '@components/Onboarding/kit'
import AdvancedSettingsModal from './AdvancedSettingsModal'

const validateVotingSettings = (
  voteDuration,
  voteDelegatedVotingPeriod,
  voteQuietEndingPeriod,
  voteQuietEndingExtension,
  voteExecutionDelay
) => {
  if (!voteDuration) {
    return 'Please add a vote duration.'
  }
  if (!voteDelegatedVotingPeriod) {
    return 'Please add a delegated voting period.'
  }
  if (!voteQuietEndingPeriod) {
    return 'Please add a vote quite ending period.'
  }
  if (!voteQuietEndingExtension) {
    return 'Please add a vote quite ending extension period.'
  }
  if (!voteExecutionDelay) {
    return 'Please add a vote execution delay period.'
  }
  return null
}

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'voteSupportRequired':
      return {
        ...fields,
        voteSupportRequired: value,
        voteMinAcceptanceQuorum: Math.min(
          fields.voteMinAcceptanceQuorum,
          value
        ),
      }
    case 'voteMinAcceptanceQuorum':
      return {
        ...fields,
        voteSupportRequired: Math.max(fields.voteSupportRequired, value),
        voteMinAcceptanceQuorum: value,
      }
    case 'voteDuration':
      return {
        ...fields,
        voteDuration: value,
      }
    case 'voteDelegatedVotingPeriod':
      return {
        ...fields,
        voteDelegatedVotingPeriod: value,
      }
    case 'voteQuietEndingPeriod':
      return {
        ...fields,
        voteQuietEndingPeriod: value,
      }
    case 'voteQuietEndingExtension':
      return {
        ...fields,
        voteQuietEndingExtension: value,
      }
    case 'voteExecutionDelay':
      return {
        ...fields,
        voteExecutionDelay: value,
      }
    default:
      return fields
  }
}

function VotingSettings() {
  const {
    config,
    onBack,
    onNext,
    onConfigChange,
    step,
    steps,
  } = useOnboardingState()
  const [formError, setFormError] = useState()
  const [
    {
      voteDuration,
      voteSupportRequired,
      voteMinAcceptanceQuorum,
      voteDelegatedVotingPeriod,
      voteQuietEndingPeriod,
      voteQuietEndingExtension,
      voteExecutionDelay,
    },
    updateField,
  ] = useReducer(reduceFields, { ...config.voting })
  const supportRef = useRef()
  const [openSettingsModal, setOpenSettingsModal] = useState(false)

  const handleSupportRef = useCallback(ref => {
    supportRef.current = ref
    if (ref) {
      ref.focus()
    }
  }, [])

  const handleSupportChange = useCallback(
    value => {
      updateField(['voteSupportRequired', value])
    },
    [updateField]
  )

  const handleQuorumChange = useCallback(
    value => {
      updateField(['voteMinAcceptanceQuorum', value])
    },
    [updateField]
  )

  const handleDurationChange = useCallback(
    value => {
      setFormError(null)
      updateField(['voteDuration', value])
    },
    [updateField]
  )

  const handleQuiteEndingPeriodChange = useCallback(
    value => {
      setFormError(null)
      updateField(['voteQuietEndingPeriod', value])
    },
    [updateField]
  )

  const handleExecutionDelayPeriodChange = useCallback(
    value => {
      setFormError(null)
      updateField(['voteExecutionDelay', value])
    },
    [updateField]
  )

  const handleDelegatedVotingPeriodChange = useCallback(
    value => {
      setFormError(null)
      updateField(['voteDelegatedVotingPeriod', value])
    },
    [updateField]
  )

  const handleQuiteEndingExtensionPeriodChange = useCallback(
    value => {
      setFormError(null)
      updateField(['voteQuietEndingExtension', value])
    },
    [updateField]
  )

  const handleCloseModal = useCallback(() => setOpenSettingsModal(false), [])

  const handleOpenModal = useCallback(() => setOpenSettingsModal(true), [])

  const handleNextClick = () => {
    const error = validateVotingSettings(
      voteDuration,
      voteDelegatedVotingPeriod,
      voteQuietEndingPeriod,
      voteQuietEndingExtension,
      voteExecutionDelay
    )
    setFormError(error)

    if (!error) {
      onConfigChange('voting', {
        voteDuration,
        voteSupportRequired,
        voteMinAcceptanceQuorum,
        voteDelegatedVotingPeriod,
        voteQuietEndingPeriod,
        voteQuietEndingExtension,
        voteExecutionDelay,
      })
      onNext()
    }
  }

  return (
    <div>
      <Header
        title="Configure Community Voting"
        subtitle="Choose your settings below"
      />
      <PercentageField
        ref={handleSupportRef}
        label={
          <Fragment>
            Support %{' '}
            <Help hint="What is Support?">
              <strong>Support</strong> is the relative percentage of tokens that
              are required to vote “Yes” for a proposal to be approved. For
              example, if “Support” is set to 50%, then more than 50% of the
              tokens used to vote on a proposal must vote “Yes” for it to pass.
            </Help>
          </Fragment>
        }
        value={voteSupportRequired}
        onChange={handleSupportChange}
      />
      <PercentageField
        label={
          <Fragment>
            Minimum Approval %
            <Help hint="What is Minimum Approval?">
              <strong>Minimum Approval</strong> is the percentage of the total
              token supply that is required to vote “Yes” on a proposal before
              it can be approved. For example, if the “Minimum Approval” is set
              to 20%, then more than 20% of the outstanding token supply must
              vote “Yes” on a proposal for it to pass.
            </Help>
          </Fragment>
        }
        value={voteMinAcceptanceQuorum}
        onChange={handleQuorumChange}
      />
      <DurationFields
        label={
          <Fragment>
            Vote Duration
            <Help hint="What is Vote Duration?">
              <strong>Vote Duration</strong> is the length of time that the vote
              will be open for participation. For example, if the Vote Duration
              is set to 24 hours, then tokenholders have 24 hours to participate
              in the vote.
            </Help>
          </Fragment>
        }
        duration={voteDuration}
        onUpdate={handleDurationChange}
      />
      <DurationFields
        label={
          <Fragment>
            Execution Delay
            <Help hint="What is Execution Delay?">
              <strong>Execution Delay</strong> is the required amount of time
              after a proposal passes for the proposal to be executed. This
              allows everyone to react to the outcome and make decisions before
              the effects of the vote are realised.
            </Help>
          </Fragment>
        }
        duration={voteExecutionDelay}
        onUpdate={handleExecutionDelayPeriodChange}
      />
      <DurationFields
        label={
          <Fragment>
            Quite Ending Period
            <Help hint="What is Quite Ending Period?">
              <strong>Quite Ending Period</strong> is the duration before the
              end of a vote to detect non-quiet endings. Non-quiet endings are
              endings which involve a late swing in the vote.
            </Help>
          </Fragment>
        }
        duration={voteQuietEndingPeriod}
        onUpdate={handleQuiteEndingPeriodChange}
      />
      <div
        css={`
          display: flex;
          justify-content: flex-end;
          margin-bottom: ${5 * GU}px;
        `}
      >
        <Button size="mini" label="Advanced..." onClick={handleOpenModal} />
      </div>
      <AdvancedSettingsModal
        voteQuietEndingExtension={voteQuietEndingExtension}
        handleQuiteEndingExtensionPeriodChange={
          handleQuiteEndingExtensionPeriodChange
        }
        voteDelegatedVotingPeriod={voteDelegatedVotingPeriod}
        handleDelegatedVotingPeriodChange={handleDelegatedVotingPeriodChange}
        visible={openSettingsModal}
        onClose={handleCloseModal}
      />
      {formError && (
        <Info
          css={`
            margin-bottom: ${6 * GU}px;
          `}
          mode="error"
        >
          {formError}
        </Info>
      )}
      <Navigation
        backEnabled
        nextEnabled={!formError}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default VotingSettings
