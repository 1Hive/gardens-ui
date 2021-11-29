import React from 'react'
import { useTheme, IconBlock } from '@1hive/1hive-ui'

import {
  STEP_ERROR,
  STEP_SUCCESS,
  STEP_PROMPTING,
  STEP_WORKING,
} from '../stepper-statuses'

import signRequestSuccessIllustration from '@assets/signRequestSuccess.svg'
import signRequestFailIllustration from '@assets/signRequestFail.svg'
import trxBeingMinedIllustration from '@assets/trxBeingMined.svg'

const illustrations = {
  [STEP_WORKING]: trxBeingMinedIllustration,
  [STEP_SUCCESS]: signRequestSuccessIllustration,
  [STEP_ERROR]: signRequestFailIllustration,
}

function Illustration({ status, index }) {
  const theme = useTheme()
  return (
    <>
      {status === STEP_PROMPTING ? (
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            border-radius: 100%;
            background-color: ${theme.contentSecondary};
            color: ${theme.positiveContent};
          `}
        >
          <IconBlock size="large" />
        </div>
      ) : (
        <img src={illustrations[status]} height={96} width={96} />
      )}
    </>
  )
}

export default Illustration
