import React, { Fragment, useCallback, useReducer, useState } from 'react'
import {
  Field,
  GU,
  Help,
  Info,
  Link,
  Markdown,
  Modal,
  TextInput,
} from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'
import {
  DurationFields,
  Header,
  FileUploaderField,
  TextFileUploader,
} from '../../kit'

const MAX_TITLE_LENGTH = 50

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'title':
      return { ...fields, title: value }
    case 'covenantFile':
      return { ...fields, covenantFile: value }
    case 'challengePeriod':
      return { ...fields, challengePeriod: value }
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
  const [covenantOpened, setCovenantOpened] = useState(false)
  const [{ title, covenantFile, challengePeriod }, updateField] = useReducer(
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
    [updateField, setFormError]
  )

  const handleCovenantFileChange = useCallback(
    file => {
      setFormError(null)
      updateField(['covenantFile', file])
    },
    [updateField, setFormError]
  )

  const handleChallengePeriod = useCallback(
    value => {
      setFormError(null)
      updateField(['challengePeriod', value])
    },
    [updateField, setFormError]
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
        title,
        covenantFile,
        challengePeriod,
      })
      onNext()
    }
  }, [onConfigChange, challengePeriod, covenantFile, onNext, title])

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
        <div
          css={`
            display: flex;
          `}
        >
          <FileUploaderField
            allowedMIMETypes={['text/markdown', 'text/plain']}
            file={covenantFile}
            onFileUpdated={handleCovenantFileChange}
            description={
              <>
                Drag and drop a document here or <TextFileUploader /> to upload
                your community covenant. By uploading a file, you agree to
                Gardens uploading this file to IPFS.
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
        </div>
        <DurationFields
          label={
            <Fragment>
              Challenge Period
              <Help hint="What is the Challenge Period?">
                Once a proposal has been challenged, this is the amount of time
                the proposal's creator has to either accept a settlement or
                raise the dispute to{' '}
                <Link href="https://1hive.gitbook.io/celeste/">Celeste</Link>.
              </Help>
            </Fragment>
          }
          duration={challengePeriod}
          onUpdate={handleChallengePeriod}
        />
        <Info>We recommend sticking with the default duration.</Info>
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
      <Modal
        css={`
          z-index: 4;
        `}
        visible={covenantOpened}
        onClose={() => setCovenantOpened(false)}
        width="960px"
      >
        <div
          css={`
            padding: 0 ${4 * GU}px;
            padding-top: ${2 * GU}px;
          `}
        >
          <Markdown normalized content={covenantFile?.content ?? ''} />
        </div>
      </Modal>
      <Navigation
        backEnabled
        nextEnabled={Boolean(title && !!covenantFile && challengePeriod)}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default AgreementSettings
