import React from 'react'
import { useTheme } from '@1hive/1hive-ui'
import {
  STEP_ERROR,
  STEP_SUCCESS,
  STEP_PROMPTING,
  STEP_WORKING,
} from '../stepper-statuses'
// import TokenLoader from '../../TokenLoader'
import { useAppTheme } from '@providers/AppTheme'

import signRequestSuccessIllustration from '@assets/signRequestSuccess.svg'
import signRequestFailIllustration from '@assets/signRequestFail.svg'
import trxBeingMinedIllustration from '@assets/honey.svg'

import signRequestSuccessIllustrationDark from '@assets/dark-mode/signRequestSuccess.svg'
import signRequestFailIllustrationDark from '@assets/dark-mode/signRequestFail.svg'
import trxBeingMinedIllustrationDark from '@assets/dark-mode/honey.svg'

const illustrations = {
  [STEP_WORKING]: trxBeingMinedIllustration,
  [STEP_SUCCESS]: signRequestSuccessIllustration,
  [STEP_ERROR]: signRequestFailIllustration,
}
const illustrationsDarkMode = {
  [STEP_WORKING]: trxBeingMinedIllustrationDark,
  [STEP_SUCCESS]: signRequestSuccessIllustrationDark,
  [STEP_ERROR]: signRequestFailIllustrationDark,
}

function Illustration({ status, index }) {
  const theme = useTheme()
  const { appearance } = useAppTheme()

  const illustrationsType =
    appearance === 'light' ? illustrations : illustrationsDarkMode
  console.log(appearance)

  return (
    <>
      {status === STEP_PROMPTING ? (
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${theme.surfaceIcon};
            height: 100%;
            width: 100%;
            border-radius: 100%;
          `}
        />
      ) : (
        <img src={illustrationsType[status]} height={96} width={96} />
      )}
    </>
  )
}

export default Illustration
