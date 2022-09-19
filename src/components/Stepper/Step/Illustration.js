import { IndividualStepTypes } from '../stepper-statuses'
import { useTheme } from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'
import blockIcon from '@images/icons/base/blockIcon.svg'
import signRequestFailIllustration from '@images/icons/base/signRequestFail.svg'
import signRequestSuccessIllustration from '@images/icons/base/signRequestSuccess.svg'
import trxBeingMinedIllustration from '@images/icons/base/trxBeingMined.svg'
import React from 'react'
import signRequestSuccessIllustrationDark from '@images/icons/dark-mode/signRequestSuccess.svg'
import signRequestFailIllustrationDark from '@images/icons/dark-mode/signRequestFail.svg'
import trxBeingMinedIllustrationDark from '@images/icons/dark-mode/honey.svg'

const illustrations = {
  [IndividualStepTypes.Working]: '/icons/base/trxBeingMined.svg',
  [IndividualStepTypes.Success]: '/icons/base/signRequestSuccess.svg',
  [IndividualStepTypes.Error]: '/icons/base/signRequestFail.svg',
}

const illustrationsDarkMode = {
  [IndividualStepTypes.Working]: trxBeingMinedIllustrationDark,
  [IndividualStepTypes.Success]: signRequestSuccessIllustrationDark,
  [IndividualStepTypes.Error]: signRequestFailIllustrationDark,
}

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
          <img src={'/icons/base/blockIcon.svg'} height={48} width={48} />
        </div>
      ) : (
        <img src={illustrationsType[status]} height={96} width={96} />
      )}
    </>
  )
}

export default Illustration
