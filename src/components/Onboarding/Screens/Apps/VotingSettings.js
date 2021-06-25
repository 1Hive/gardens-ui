import React, {
  Fragment,
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'react'
import { GU, Help } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'
import {
  TimeParameterPanel,
  Header,
  PercentageField,
  Carousel,
} from '../../kit'

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
        executionDelayPeriod: value,
      }
    default:
      return fields
  }
}

function VotingSettings() {
  const [isLastItemChecked, setIsLastItemChecked] = useState(false)
  const {
    config,
    onBack,
    onNext,
    onConfigChange,
    step,
    steps,
  } = useOnboardingState()
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
      updateField(['voteDuration', value])
    },
    [updateField]
  )

  const handleDelegatedVotingPeriodChange = useCallback(
    value => {
      updateField(['voteDelegatedVotingPeriod', value])
    },
    [updateField]
  )
  const handleQuiteEndingPeriodChange = useCallback(
    value => {
      updateField(['voteQuietEndingPeriod', value])
    },
    [updateField]
  )

  const handleQuiteEndingExtensionPeriodChange = useCallback(
    value => {
      updateField(['voteQuietEndingExtension', value])
    },
    [updateField]
  )

  const handleExecutionDelayPeriodChange = useCallback(
    value => {
      updateField(['voteExecutionDelay', value])
    },
    [updateField]
  )

  const handleNextClick = () => {
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

  const carouselItems = [
    <TimeParameterPanel
      title="Voting Duration"
      description="Vote duration is the length of time that the vote will be open for participation. For example, if the Vote Duration is set to 24 hours, then tokenholders have 24 hours to participate in the vote."
      value={voteDuration}
      onUpdate={handleDurationChange}
    />,
    <TimeParameterPanel
      title="Delegate Voting Period"
      description="Delegate voting period is the duration from the start of a vote that representatives are allowed to vote on behalf of principals."
      value={voteDelegatedVotingPeriod}
      onUpdate={handleDelegatedVotingPeriodChange}
    />,
    <TimeParameterPanel
      title="Quite Ending Period"
      description="Quite ending period is the duration before the end of a vote to detect non-quiet endings. Non-quiet endings are endings which involve a late swing in the vote."
      value={voteQuietEndingPeriod}
      onUpdate={handleQuiteEndingPeriodChange}
    />,
    <TimeParameterPanel
      title="Quite Ending Extension Period"
      description="Quite ending extension period is the duration to extend a vote in the case of a non-quiet ending."
      value={voteQuietEndingExtension}
      onUpdate={handleQuiteEndingExtensionPeriodChange}
    />,
    <TimeParameterPanel
      title="Delay Period"
      description="Delay period is the duration to wait before a passed vote can be executed. This allows people to react to the outcome and make decisions before the effects of the vote are realised."
      value={voteExecutionDelay}
      onUpdate={handleExecutionDelayPeriodChange}
    />,
  ]

  const handleItemSelected = useCallback(
    index => {
      if (index === carouselItems.length - 1) {
        setIsLastItemChecked(true)
      }
    },
    [carouselItems.length]
  )

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
      <div
        css={`
          margin-bottom: ${7 * GU}px;
        `}
      >
        <Carousel
          itemWidth={80 * GU}
          itemHeight={40 * GU}
          itemSpacing={2 * GU}
          items={carouselItems}
          onItemSelected={handleItemSelected}
        />
      </div>
      <Navigation
        backEnabled
        nextEnabled={isLastItemChecked}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default VotingSettings
