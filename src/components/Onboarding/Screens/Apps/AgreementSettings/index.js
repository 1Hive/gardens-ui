import React, { Fragment, useCallback, useReducer, useState } from 'react'
import { Field, GU, Help, Info, Link, TextInput } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import {
  DurationFields,
  Header,
  FileUploaderField,
  TextFileUploader,
  AmountField,
} from '@components/Onboarding/kit'
import Navigation from '@components/Onboarding/Navigation'
import CovenantModal from './CovenantModal'

const MAX_TITLE_LENGTH = 50

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'title':
      return { ...fields, title: value }
    case 'covenantFile':
      return { ...fields, covenantFile: value }
    case 'challengePeriod':
      return { ...fields, challengePeriod: value }
    case 'challengeAmount':
      return { ...fields, challengeAmount: value }
    case 'actionAmount':
      return { ...fields, actionAmount: value }
    default:
      return fields
  }
}

const validateAgreementSettings = (title, covenantFile, challengePeriod) => {
  if (!title.trim()) {
    return 'Please add a title.'
  }
  if (!covenantFile || !covenantFile.content) {
    return 'File content empty. Please upload your Covenant.'
  }
  if (!challengePeriod) {
    return 'Please add a challenge period.'
  }
  return null
}

function AgreementSettings() {
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    step,
    steps,
  } = useOnboardingState()
  const [formError, setFormError] = useState()
  const [
    { actionAmount, challengeAmount, challengePeriod, covenantFile, title },
    updateField,
  ] = useReducer(reduceFields, config.agreement)
  const [covenantOpened, setCovenantOpened] = useState(false)

  const handleActionAmount = useCallback(
    value => {
      setFormError(null)
      updateField(['actionAmount', value])
    },
    [setFormError, updateField]
  )

  const handleChallengeAmount = useCallback(
    value => {
      setFormError(null)
      updateField(['challengeAmount', value])
    },
    [setFormError, updateField]
  )

  const handleChallengePeriod = useCallback(
    value => {
      setFormError(null)
      updateField(['challengePeriod', value])
    },
    [setFormError, updateField]
  )

  const handleCovenantFileChange = useCallback(
    file => {
      setFormError(null)
      updateField(['covenantFile', file])
    },
    [setFormError, updateField]
  )

  const handleTitleChange = useCallback(
    ({ target: { value } }) => {
      if (value.length <= MAX_TITLE_LENGTH) {
        setFormError(null)
        updateField(['title', value])
      }
    },
    [setFormError, updateField]
  )

  const handleNextClick = useCallback(() => {
    const error = validateAgreementSettings(
      title,
      covenantFile,
      challengePeriod
    )
    setFormError(error)

    if (!error) {
      onConfigChange('agreement', {
        actionAmount,
        challengeAmount,
        challengePeriod,
        covenantFile,
        title,
      })
      onNext()
    }
  }, [
    actionAmount,
    challengeAmount,
    challengePeriod,
    covenantFile,
    onConfigChange,
    onNext,
    title,
  ])

  return (
    <div>
      <Header
        title="Configure Community Covenant"
        subtitle="Encode the social contract of your DAO"
      />
      <div
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        <Field label="Title" required>
          <TextInput
            value={title}
            onChange={handleTitleChange}
            autofocus
            wide
          />
        </Field>
        <FileUploaderField
          allowedMIMETypes={['text/markdown', 'text/plain']}
          file={covenantFile}
          onFileUpdated={handleCovenantFileChange}
          description={
            <>
              Drag and drop a document here or <TextFileUploader /> to upload
              your community covenant. By uploading a file, you agree to Gardens
              uploading this file to IPFS.
            </>
          }
          label="Covenant"
          previewLabel={
            <div
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              <Link
                onClick={() => {
                  setCovenantOpened(true)
                }}
              >
                Preview Covenant
              </Link>
            </div>
          }
          required
        />
        <DurationFields
          label={
            <Fragment>
              Settlement Period
              <Help hint="What is the Settlement Period?">
                The <strong>Settlement Period</strong> is the amount of time the
                proposal author has to either accept a settlement or raise the
                dispute to{' '}
                <Link href="https://1hive.gitbook.io/celeste/">Celeste</Link>{' '}
                after a proposal has been challenged.
              </Help>
            </Fragment>
          }
          duration={challengePeriod}
          onUpdate={handleChallengePeriod}
          required
        />
        <AmountField
          label={
            <Fragment>
              Challenge Fee
              <Help hint="What is Challenge Fee?">
                <strong>Challenge Fee</strong> is the amount of collateral
                tokens that will be locked every time an action is challenged.
              </Help>
            </Fragment>
          }
          value={challengeAmount}
          onChange={handleChallengeAmount}
          required
          unitSymbol={config.tokens.symbol}
          wide
        />
        <AmountField
          label={
            <Fragment>
              Action Fee
              <Help hint="What is Action Fee?">
                <strong>The Action Fee</strong> is the amount of collateral
                tokens that will be locked every time an action is submitted.
              </Help>
            </Fragment>
          }
          value={actionAmount}
          onChange={handleActionAmount}
          required
          unitSymbol={config.tokens.symbol}
          wide
        />
        <Info>We recommend sticking with the default values.</Info>
        {formError && (
          <Info
            mode="error"
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            {formError}
          </Info>
        )}
      </div>
      <CovenantModal
        open={covenantOpened}
        file={covenantFile}
        onClose={() => setCovenantOpened(false)}
      />
      <Navigation
        backEnabled
        nextEnabled={Boolean(
          actionAmount &&
            challengeAmount &&
            challengePeriod &&
            !!covenantFile &&
            title
        )}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default AgreementSettings
