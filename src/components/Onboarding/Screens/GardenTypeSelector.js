import React, { useCallback, useState } from 'react'
import Lottie from 'react-lottie-player'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import { useOnboardingState } from '@providers/Onboarding'
import byotAnimation from '@assets/lotties/byotAnimation.json'
import nativeAnimation from '@assets/lotties/nativeAnimation.json'

import { BYOT_TYPE, NATIVE_TYPE } from '../constants'
import { Header } from '../kit'

function GardenTypeSelector() {
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
      <Header
        title="Select Type"
        subtitle="Choose the type of garden you'd like to launch."
      />
      <div
        css={`
          display: flex;
          align-items: flex-start;
          justify-content: center;
        `}
      >
        <Card
          paragraph="Create a new token that is native to your garden. "
          onSelect={handleSelectNative}
          selected={selectedType === NATIVE_TYPE}
          animationData={nativeAnimation}
          title="Native Token"
        />
        <Card
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

function Card({ title, onSelect, paragraph, selected, animationData }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const theme = useTheme()

  const handleStartAnimation = useCallback(() => {
    setIsPlaying(true)
  }, [setIsPlaying])

  const handleStopAnimation = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  return (
    <div
      css={`
        cursor: pointer;
        margin: 0px 10px;
        max-width: 274px;
        border-radius: 135px 135px ${2 * GU}px ${2 * GU}px;
        background: ${theme.surface};
        border: 1px solid ${theme.border};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: box-shadow 0.5s ease, transform 0.3s ease,
          border-color 1.5s ease;
        ${selected
          ? `
          border: 2px solid #56D571;
          transform: scale(1.02);
        `
          : `  &:hover {
          box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.2);
          border: 2px solid #56D571;
          transform: scale(1.02);
        }`};
      `}
      onClick={onSelect}
      onMouseOver={handleStartAnimation}
      onMouseLeave={handleStopAnimation}
    >
      <div
        css={`
          background: #59d673;
          border-radius: 50%;
          width: 218px;
          height: 218px;
          margin: ${3 * GU}px;
          padding: ${3 * GU}px;
        `}
      >
        <Lottie
          animationData={animationData}
          loop={false}
          play={isPlaying}
          // If selected we place on the last frame of the lottie
          goTo={selected ? 34 : 0}
        />
      </div>
      <div
        css={`
          padding-left: ${3.5 * GU}px;
          padding-right: ${3.5 * GU}px;
          padding-bottom: ${3.5 * GU}px;
        `}
      >
        <div
          css={`
            color: ${theme.content};
            ${textStyle('body1')};
            margin-bottom: ${2 * GU}px;
          `}
        >
          {title}
        </div>
        <div
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {paragraph}
        </div>
      </div>
    </div>
  )
}

export default GardenTypeSelector
