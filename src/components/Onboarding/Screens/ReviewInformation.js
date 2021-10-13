import React from 'react'
import { Accordion, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { Header } from '../kit'
import Navigation from '../Navigation'
import { useOnboardingState } from '@providers/Onboarding'
import { NATIVE_TYPE } from '../constants'

function ReviewInformation() {
  const { onBack, onStartDeployment } = useOnboardingState()

  return (
    <div>
      <Header title="Review information" />
      <div
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        <Accordion
          items={[
            ['Type', <ReviewGardenType />],
            ['Profile', <ReviewGardenProfile />],
            ['Tokenomics', <div>Tokenomics!</div>],
            ['Governance', <div>Governance!</div>],
          ]}
        />
      </div>
      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Launch your garden"
        onBack={onBack}
        onNext={onStartDeployment}
      />
    </div>
  )
}

function ReviewGardenType() {
  const { config } = useOnboardingState()
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px;
        width: 100%;
      `}
    >
      <Field
        label="Garden type"
        value={
          config.garden.type === NATIVE_TYPE
            ? 'Native Token'
            : 'Pre-existing Token'
        }
      />
    </div>
  )
}

function ReviewGardenProfile() {
  const { config } = useOnboardingState()
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px;
        width: 100%;
      `}
    >
      <div>
        <Field label="Garden name" value={config.garden.name} />
        <Field label="Garden description" value={config.garden.description} />
        <Field label="Forum" value={config.garden.forum} />
      </div>
      <LineBreak />
      <div>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          ASSETS
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          {config.garden.logo_type && (
            <Field
              label="Header logo"
              value={config.garden.logo_type.blob.name}
            />
          )}
          {config.garden.logo && (
            <Field label="Garden logo" value={config.garden.logo.blob.name} />
          )}
          {config.garden.token_logo && (
            <Field
              label="Token icon"
              value={config.garden.token_logo.blob.name}
            />
          )}
        </div>
      </div>
      {config.garden.links.community.length > 0 && (
        <>
          <LineBreak />
          <div>
            <div
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              COMMUNITY LINKS (optional)
            </div>
            <div>
              {config.garden.links.community.map(({ link, label }) => (
                <Field label={label} value={link} />
              ))}
            </div>
          </div>
        </>
      )}
      {config.garden.links.documentation.length > 0 && (
        <>
          <LineBreak />
          <div>
            <div
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              DOCUMENTATION LINKS
            </div>
            <div>
              {config.garden.links.documentation.map(({ link, label }) => (
                <Field label={label} value={link} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const Field = ({ label, value }) => {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-bottom: ${3 * GU}px;
      `}
    >
      <h2
        css={`
          ${textStyle('label1')};
          font-weight: 200;
          color: ${theme.contentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>
      <div>{value}</div>
    </div>
  )
}

const LineBreak = () => {
  const theme = useTheme()

  return (
    <div
      css={`
        height: 1px;
        border-top: 0.5px solid ${theme.surfaceOpened};
        margin-bottom: ${3 * GU}px;
      `}
    />
  )
}

export default ReviewInformation
