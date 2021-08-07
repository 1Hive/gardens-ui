import React, { useCallback, useState } from 'react'
import Lottie from 'react-lottie'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import { useOnboardingState } from '@providers/Onboarding'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import byotAnimation from '@assets/byotAnimation.json'
import nativeAnimation from '@assets/nativeAnimation.json'

import { BYOT_TYPE, NATIVE_TYPE } from '../constants'

function GardenTypeSelector() {
  const theme = useTheme()
  const { config, onConfigChange, onNext } = useOnboardingState()
  const [selectedType] = useState(config.garden.type)

  const handleNext = useCallback(
    selectedType => {
      onConfigChange('garden', { type: selectedType })
      onNext()
    },
    [onConfigChange, onNext]
  )

  const handleSelectNative = useCallback(() => {
    handleNext(NATIVE_TYPE)
  }, [handleNext])

  const handleSelectBYOT = useCallback(() => {
    handleNext(BYOT_TYPE)
  }, [handleNext])

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
            font-size: 3em;
            margin-bottom: ${3 * GU}px;
          `}
        >
          Garden Type
        </h1>
        <div>
          <p
            css={`
              ${textStyle('title4')};
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
          justify-content: center;
          margin-top: ${5.5 * GU}px;
          margin-bottom: ${15.5 * GU}px;
        `}
      >
        <Card
          icon={defaultGardenLogo}
          paragraph="Create a new token that is native to your garden. "
          onSelect={handleSelectNative}
          selected={selectedType === NATIVE_TYPE}
          animationData={nativeAnimation}
          title="Native Token"
        />
        <Card
          icon={defaultGardenLogo}
          paragraph="Use an existing ERC-20 token to within your garden."
          onSelect={handleSelectBYOT}
          selected={selectedType === BYOT_TYPE}
          animationData={byotAnimation}
          title="Pre-existing Token"
        />
      </div>
    </div>
  )
}

function Card({ icon, title, onSelect, paragraph, selected, animationData }) {
  const [isStopped, setIsStopped] = useState(true)
  const theme = useTheme()

  const handleAnimation = useCallback(() => {
    setIsStopped(false)
  }, [setIsStopped])

  const defaultOptions = {
    loop: false,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <div
      css={`
        cursor: pointer;
        padding: ${5 * GU}px;
        background: ${theme.surface};
        border: 1px solid ${theme.border};
        width: ${33 * GU}px;
        height: ${47.5 * GU}px;
        margin: ${1.25 * GU}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: box-shadow 0.3s ease;
        border-radius: 50% 50% ${2 * GU}px ${2 * GU}px;
        ${selected
          ? `
          border: 2px solid #56D571;
        `
          : `  &:hover {
          box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.2);
        }`};
      `}
      onClick={onSelect}
      onMouseOver={handleAnimation}
    >
      <div
        css={`
          background: #59d673;
          border-radius: 50%;
          width: ${27.25 * GU}px;
          height: ${27.25 * GU}px;
          padding: ${3 * GU}px;
        `}
      >
        <Lottie
          options={{ ...defaultOptions, animationData }}
          isStopped={isStopped}
        />
      </div>
      <div>
        <div
          css={`
            color: ${theme.content};
            ${textStyle('body1')};
          `}
        >
          {title}
        </div>
        <div
          css={`
            color: ${theme.contentSecondary};
            ${textStyle('body2')};
          `}
        >
          {paragraph}
        </div>
      </div>
    </div>
  )
}

export default GardenTypeSelector
