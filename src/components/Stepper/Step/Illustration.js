import { IndividualStepTypes } from '../stepper-statuses'
import { useTheme } from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'
import blockIcon from '@assets/blockIcon.svg'
import signRequestFailIllustration from '@assets/signRequestFail.svg'
import signRequestSuccessIllustration from '@assets/signRequestSuccess.svg'
import trxBeingMinedIllustration from '@assets/trxBeingMined.svg'
import React from 'react'
import signRequestSuccessIllustrationDark from '@assets/dark-mode/signRequestSuccess.svg'
import signRequestFailIllustrationDark from '@assets/dark-mode/signRequestFail.svg'
import trxBeingMinedIllustrationDark from '@assets/dark-mode/honey.svg'

const illustrations = {
  [IndividualStepTypes.Working]: trxBeingMinedIllustration,
  [IndividualStepTypes.Success]: signRequestSuccessIllustration,
  [IndividualStepTypes.Error]: signRequestFailIllustration,
}

// const illustrationsDarkMode = {
//   [STEP_WORKING]: trxBeingMinedIllustrationDark,
//   [STEP_SUCCESS]: signRequestSuccessIllustrationDark,
//   [STEP_ERROR]: signRequestFailIllustrationDark,
// }

function Illustration({ status, index }) {
  const theme = useTheme()

  const { appearance } = useAppTheme()

  const illustrationsType =
    appearance === 'light' ? illustrations : illustrationsDarkMode

  return (
    <>
      {status === IndividualStepTypes.Prompting ? (
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
          <img src={blockIcon} height={48} width={48} />
        </div>
      ) : (
        <img src={illustrationsType[status]} height={96} width={96} />
      )}
    </>
  )
}

export default Illustration
