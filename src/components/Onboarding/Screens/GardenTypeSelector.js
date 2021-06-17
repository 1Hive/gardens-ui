import React, { useCallback, useState } from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

import { BYOT_TYPE, NATIVE_TYPE } from '../constants'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'

function GardenTypeSelector() {
  const theme = useTheme()
  const { config, onBack, onConfigChange, onNext } = useOnboardingState()
  const [selectedType, setSelectedType] = useState(config.garden.type)

  const handleSelectNative = useCallback(() => {
    setSelectedType(NATIVE_TYPE)
  }, [])

  const handleSelectBYOT = useCallback(() => {
    setSelectedType(BYOT_TYPE)
  }, [])

  const handleNext = useCallback(() => {
    onConfigChange('garden', { type: selectedType })
    onNext()
  }, [onConfigChange, onNext, selectedType])

  return (
    <div>
      <div
        css={`
          margin-bottom: ${6 * GU}px;
          text-align: center;
        `}
      >
        <h1
          css={`
            ${textStyle('title1')};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Garden type
        </h1>
        <div>
          <p
            css={`
              ${textStyle('body1')};
              color: ${theme.contentSecondary};
            `}
          >
            Choose which type of garden you'd like to launch.
          </p>
        </div>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-bottom: ${6 * GU}px;
        `}
      >
        <Card
          icon={defaultGardenLogo}
          paragraph="Launch garden with new token"
          onSelect={handleSelectNative}
          selected={selectedType === NATIVE_TYPE}
          title="Native"
        />
        <Card
          icon={defaultGardenLogo}
          paragraph="Launch garden with existing token"
          onSelect={handleSelectBYOT}
          selected={selectedType === BYOT_TYPE}
          title="BYOT"
        />
      </div>
      <Navigation
        backEnabled={false}
        nextEnabled={selectedType !== -1}
        nextLabel="Next:"
        onBack={onBack}
        onNext={handleNext}
      />
    </div>
  )
}

function Card({ icon, title, onSelect, paragraph, selected }) {
  const theme = useTheme()
  return (
    <div
      css={`
        cursor: pointer;
        padding: ${5 * GU}px;
        background: ${theme.surface};
        border: 1px solid ${theme.border};
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
        ${selected
          ? `
          box-shadow: 0px 0px 7px 1px ${theme.accentStart};
          background: linear-gradient(
            268deg,
            ${theme.accentEnd},
            ${theme.accentStart}
          );
        `
          : `  &:hover {
          box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.2);
        }`}
      `}
      onClick={onSelect}
    >
      <img
        src={icon}
        alt=""
        height="100"
        width="100"
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
          ${textStyle('title2')};
        `}
      >
        {title}
      </div>
      <div
        css={`
          color: ${theme.contentSecondary};
          ${textStyle('body1')};
        `}
      >
        {paragraph}
      </div>
    </div>
  )
}

export default GardenTypeSelector
