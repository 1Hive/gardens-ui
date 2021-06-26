import React, { Fragment, useCallback, useReducer, useState } from 'react'
import {
  Field,
  GU,
  Help,
  Info,
  Link,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'
import { DurationFields, Header } from '../../kit'

const MAX_TITLE_LENGTH = 50
const MAX_CONTENT_LENGTH = 8000

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'title':
      return { ...fields, title: value }
    case 'content':
      return { ...fields, content: value }
    case 'challengePeriod':
      return { ...fields, challengePeriod: value }
    default:
      return fields
  }
}

const validateAgreementSettings = (title, content, challengePeriod) => {
  if (!title.trim()) {
    return 'Please add a title.'
  }
  if (!content.trim()) {
    return 'Please add a content.'
  }
  if (!challengePeriod) {
    return 'Please add a challenge period.'
  }
  return null
}

function AgreementSettings() {
  const theme = useTheme()
  const {
    config,
    onBack,
    onNext,
    onConfigChange,
    step,
    steps,
  } = useOnboardingState()
  const [formError, setFormError] = useState()
  const [{ title, content, challengePeriod }, updateField] = useReducer(
    reduceFields,
    config.agreement
  )

  const handleTitleChange = useCallback(
    ({ target: { value } }) => {
      if (value.length <= MAX_TITLE_LENGTH) {
        setFormError(null)
        updateField(['title', value])
      }
    },
    [updateField]
  )

  const handleContentChange = useCallback(
    ({ target: { value } }) => {
      if (value.length <= MAX_CONTENT_LENGTH) {
        setFormError(null)
        updateField(['content', value])
      }
    },
    [updateField]
  )

  const handleChallengePeriod = useCallback(
    value => {
      setFormError(null)
      updateField(['challengePeriod', value])
    },
    [updateField]
  )

  const handleNextClick = useCallback(() => {
    const error = validateAgreementSettings(title, content, challengePeriod)
    setFormError(error)

    if (!error) {
      onConfigChange('agreement', {
        title,
        content,
        challengePeriod,
      })
      onNext()
    }
  }, [onConfigChange, challengePeriod, content, onNext, title])

  return (
    <div>
      <Header
        title="Configure Community Agreement"
        subtitle="Create the character of your DAO"
      />
      <Field label="Title" required>
        <TextInput value={title} onChange={handleTitleChange} autofocus wide />
      </Field>
      <Field label="Content/Covenant" required>
        <TextInput
          value={content}
          placeholder="Define the mission, vision, and values of your community using
          markdown format."
          onChange={handleContentChange}
          multiline
          wide
        />
      </Field>
      <DurationFields
        label={
          <Fragment>
            Challenge Period
            <Help hint="What is the Challenge Period?">
              Once a proposal has been challenged, this is the amount of time
              the proposal's creator has to either accept a settlement or raise
              the dispute to{' '}
              <Link href="https://1hive.gitbook.io/celeste/">Celeste</Link>.
            </Help>
          </Fragment>
        }
        duration={challengePeriod}
        onUpdate={handleChallengePeriod}
      />
      <div
        css={`
          margin-top: -${2 * GU}px;
          margin-bottom: ${3 * GU}px;
          font-style: italic;
          color: ${theme.contentSecondary.alpha(0.5)};
          ${textStyle('body3')}
        `}
      >
        We recommend sticking with the default duration.
      </div>
      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${4 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}
      <Navigation
        backEnabled
        nextEnabled={Boolean(title && content && challengePeriod)}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default AgreementSettings
