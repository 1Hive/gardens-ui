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
import { DAY_IN_SECONDS } from '@/utils/kit-utils'

const DEFAULT_SUPPORT = 50
const DEFAULT_MIN_ACCEPTANCE_QUORUM = 10
const DEFAULT_DURATION = DAY_IN_SECONDS * 5
const DEFAULT_DELEGATED_VOTING_PERIOD = DAY_IN_SECONDS * 2
const DEFAULT_QUITE_ENDING_PERIOD = DAY_IN_SECONDS * 1
const DEFAULT_QUITE_ENDING_EXTENSION_PERIOD = DAY_IN_SECONDS * 0.5
const DEFAULT_EXECUTION_DELAY_PERIOD = DAY_IN_SECONDS * 1

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'support':
      return {
        ...fields,
        support: value,
        quorum: Math.min(fields.quorum, value),
      }
    case 'quorum':
      return {
        ...fields,
        quorum: value,
        support: Math.max(fields.support, value),
      }
    case 'duration':
      return {
        ...fields,
        duration: value,
      }
    case 'delegatedVotingPeriod':
      return {
        ...fields,
        delegatedVotingPeriod: value,
      }
    case 'quiteEndingPeriod':
      return {
        ...fields,
        quiteEndingPeriod: value,
      }
    case 'quiteEndingExtensionPeriod':
      return {
        ...fields,
        quiteEndingExtensionPeriod: value,
      }
    case 'executionDelayPeriod':
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
  const { onBack, onNext, onConfigChange } = useOnboardingState()
  const [
    {
      support,
      quorum,
      duration,
      delegatedVotingPeriod,
      quiteEndingPeriod,
      quiteEndingExtensionPeriod,
      executionDelayPeriod,
    },
    updateField,
  ] = useReducer(reduceFields, {
    support: DEFAULT_SUPPORT,
    quorum: DEFAULT_MIN_ACCEPTANCE_QUORUM,
    duration: DEFAULT_DURATION,
    delegatedVotingPeriod: DEFAULT_DELEGATED_VOTING_PERIOD,
    quiteEndingPeriod: DEFAULT_QUITE_ENDING_PERIOD,
    quiteEndingExtensionPeriod: DEFAULT_QUITE_ENDING_EXTENSION_PERIOD,
    executionDelayPeriod: DEFAULT_EXECUTION_DELAY_PERIOD,
  })
  const supportRef = useRef()

  const handleSupportRef = useCallback(ref => {
    supportRef.current = ref
    if (ref) {
      ref.focus()
    }
  }, [])

  const handleSupportChange = useCallback(
    value => {
      updateField(['support', value])
    },
    [updateField]
  )

  const handleQuorumChange = useCallback(
    value => {
      updateField(['quorum', value])
    },
    [updateField]
  )

  const handleDurationChange = useCallback(
    value => {
      updateField(['duration', value])
    },
    [updateField]
  )

  const handleDelegatedVotingPeriodChange = useCallback(
    value => {
      updateField(['delegatedVotingPeriod', value])
    },
    [updateField]
  )
  const handleQuiteEndingPeriodChange = useCallback(
    value => {
      updateField(['quiteEndingPeriod', value])
    },
    [updateField]
  )

  const handleQuiteEndingExtensionPeriodChange = useCallback(
    value => {
      updateField(['quiteEndingExtensionPeriod', value])
    },
    [updateField]
  )

  const handleExecutionDelayPeriodChange = useCallback(
    value => {
      updateField(['executionDelayPeriod', value])
    },
    [updateField]
  )

  const handleNextClick = () => {
    onConfigChange('voting', {
      voteDuration: duration,
      voteSupportRequired: support,
      voteMinAcceptanceQuorum: quorum,
      voteDelegatedVotingPeriod: delegatedVotingPeriod,
      voteQuietEndingPeriod: quiteEndingPeriod,
      voteQuietEndingExtension: quiteEndingExtensionPeriod,
      voteExecutionDelay: executionDelayPeriod,
    })
    onNext()
  }

  const carouselItems = [
    <TimeParameterPanel
      title="Voting Duration"
      description="Vote duration is the length of time that the vote will be open for participation. For example, if the Vote Duration is set to 24 hours, then tokenholders have 24 hours to participate in the vote."
      value={duration}
      onUpdate={handleDurationChange}
    />,
    <TimeParameterPanel
      title="Delegate Voting Period"
      description="Delegate voting period is the duration from the start of a vote that representatives are allowed to vote on behalf of principals."
      value={delegatedVotingPeriod}
      onUpdate={handleDelegatedVotingPeriodChange}
    />,
    <TimeParameterPanel
      title="Quite Ending Period"
      description="Quite ending period is the duration before the end of a vote to detect non-quiet endings. Non-quiet endings are endings which involve a late swing in the vote."
      value={quiteEndingPeriod}
      onUpdate={handleQuiteEndingPeriodChange}
    />,
    <TimeParameterPanel
      title="Quite Ending Extension Period"
      description="Quite ending extension period is the duration to extend a vote in the case of a non-quiet ending."
      value={quiteEndingExtensionPeriod}
      onUpdate={handleQuiteEndingExtensionPeriodChange}
    />,
    <TimeParameterPanel
      title="Delay Period"
      description="Delay period is the duration to wait before a passed vote can be executed. This allows people to react to the outcome and make decisions before the effects of the vote are realised."
      value={executionDelayPeriod}
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
        value={support}
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
        value={quorum}
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
        nextLabel="Next:"
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default VotingSettings
