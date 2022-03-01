import { IndividualStepTypes } from '../stepper-statuses'
import { useTheme } from '@1hive/1hive-ui'
import React from 'react'

const illustrations = {
  [IndividualStepTypes.Working]: '/icons/base/trxBeingMined.svg',
  [IndividualStepTypes.Success]: '/icons/base/signRequestSuccess.svg',
  [IndividualStepTypes.Error]: '/icons/base/signRequestFail.svg',
}

function Illustration({ status, index }) {
  const theme = useTheme()
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
        <img src={illustrations[status]} height={96} width={96} />
      )}
    </>
  )
}

export default Illustration
