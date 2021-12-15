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
import CovenantModal from './CovenantModal'
import {
  DurationFields,
  Header,
  FileUploaderField,
  TextFileUploader,
  AmountField,
} from '@components/Onboarding/kit'
import Navigation from '@components/Onboarding/Navigation'
import { useOnboardingState } from '@providers/Onboarding'

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

const validateAgreementSettings = (
  title,
  covenantFile,
  actionAmount,
  challengeAmount,
  challengePeriod
) => {
  if (!title.trim()) {
    return 'Please add a title.'
  }
  if (!covenantFile?.content) {
    return 'File content empty. Please upload your Covenant.'
  }
  if (!actionAmount) {
    return 'Please add an action deposit.'
  }
  if (!challengeAmount) {
    return 'Please add a challenge deposit.'
  }
  if (!challengePeriod) {
    return 'Please add a settlement period.'
  }
  return null
}

function AgreementSettings() {
  const theme = useTheme()
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
  const [formatValidationColor, setFormatValidationColor] = useState(
    theme.contentSecondary
  )

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
      actionAmount,
      challengeAmount,
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

  const handleOnDragAccepted = useCallback(() => {
    setFormatValidationColor(theme.contentSecondary)
  }, [theme])

  const handleOnDragRejected = useCallback(() => {
    setFormatValidationColor(theme.error)
  }, [theme])

  const collateralTokenSymbol =
    config.tokens.existingTokenSymbol || config.tokens.symbol

  return (
    <div>
      <Header
        title="Configure Governance"
        subtitle="Community covenant"
        thirdtitle="Encode your garden's social contract"
      />
      <div
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        <Field label="Title">
          <TextInput
            value={title}
            onChange={handleTitleChange}
            autofocus
            wide
          />
        </Field>
        <div
          css={`
            display: flex;
            align-items: center;
            margin-bottom: ${1 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('label2')};
              color: ${theme.surfaceContentSecondary};
              margin-right: ${0.5 * GU}px;
            `}
          >
            Covenant
          </span>
          <Help>
            A covenant is a document, stored on IPFS, which explains what the
            Garden is about in plain English. It establishes values, rules, and
            customs. And is used to protect the Garden from malicious actors
            without sacrificing the agency of its members. Take{' '}
            <Link href="https://1hive.org/#/covenant">1Hive’s Covenant</Link> as
            an example.
          </Help>
        </div>
        <div
          css={`
            display: flex;
            flex-direction: column;
            ${textStyle('body2')};
            color: ${theme.contentSecondary};
          `}
        >
          <span>
            Drag and drop a document here or <TextFileUploader /> to upload your
            community covenant. By uploading a file, you agree to Gardens
            uploading this file to IPFS.
          </span>
          <span
            css={`
              color: ${formatValidationColor};
              font-weight: 600;
              margin-top: ${1 * GU}px;
              margin-bottom: ${2 * GU}px;
            `}
          >
            Valid file formats are: MD and TXT
          </span>
        </div>
        <FileUploaderField
          allowedMIMETypes={['text/markdown', 'text/plain']}
          file={covenantFile}
          onDragAccepted={handleOnDragAccepted}
          onDragRejected={handleOnDragRejected}
          onFileUpdated={handleCovenantFileChange}
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
        />
        <AmountField
          label={
            <Fragment>
              Action Deposit
              <Help hint="What is Action Deposit?">
                <strong>Action Deposit</strong> is the amount of collateral
                tokens that will be locked every time an action (proposal for
                funding, signaling proposal and decision vote) is submitted.
              </Help>
            </Fragment>
          }
          value={actionAmount}
          onChange={handleActionAmount}
          unitSymbol={collateralTokenSymbol}
          wide
        />
        <AmountField
          label={
            <Fragment>
              Challenge Deposit
              <Help hint="What is Challenge Deposit?">
                <strong>Challenge Deposit</strong> is the amount of collateral
                tokens that will be locked every time an action (proposal for
                funding, signaling proposal or decision vote) is challenged.
              </Help>
            </Fragment>
          }
          value={challengeAmount}
          onChange={handleChallengeAmount}
          unitSymbol={collateralTokenSymbol}
          wide
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
        />
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
        nextEnabled
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default AgreementSettings
