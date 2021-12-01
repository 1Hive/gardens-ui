import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, GU, textStyle } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'

function SavedProgress() {
  const { progress, step } = useOnboardingState()
  const [visible, setVisible] = useState(progress.hasSavedProgress)

  const handleHideProgress = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    if (progress.resumed || step > 0) {
      handleHideProgress()
    }
  }, [handleHideProgress, progress.resumed, step])

  if (!visible) {
    return null
  }

  return (
    <div
      css={`
        position: absolute;
        top: 85%;
        left: 50%;
        transform: translate(-50%, -50%);
      `}
    >
      <Box>
        <h1
          css={`
            ${textStyle('title3')};
          `}
        >
          Saved progress
        </h1>
        <p
          css={`
            ${textStyle('title4')};
            margin-top: ${2 * GU}px;
          `}
        >
          You have a saved progress! Would you like to pick up from where you
          left of?
        </p>
        <div
          css={`
            margin-top: ${3 * GU}px;
            display: flex;
            align-items: center;
            column-gap: ${1 * GU}px;
          `}
        >
          <Button label="Yes" mode="strong" wide onClick={progress.onResume} />
          <Button label="No" mode="normal" wide onClick={handleHideProgress} />
        </div>
      </Box>
    </div>
  )
}

export default SavedProgress
