import React from 'react'
import {
  STEP_ERROR,
  STEP_SUCCESS,
  STEP_PROMPTING,
  STEP_WORKING,
} from '../stepper-statuses'
// import TokenLoader from '../../TokenLoader'

import signRequestSuccessIllustration from '../../../assets/signRequestSuccess.svg'
import signRequestFailIllustration from '../../../assets/signRequestFail.svg'
import signPrompIllustration from '../../../assets/honey.svg'

const illustrations = {
  [STEP_PROMPTING]: signPrompIllustration,
  [STEP_WORKING]: signRequestSuccessIllustration,
  [STEP_SUCCESS]: signRequestSuccessIllustration,
  [STEP_ERROR]: signRequestFailIllustration,
}

function Illustration({ status, index }) {
  return (
    <>
      {/* {status === STEP_WORKING ? (
        <div
          id="LOADER WRAPPER"
          css={`
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            align-items: center;
          `}
        >
          <TokenLoader />
        </div>
      ) : ( */}

      <img src={illustrations[status]} height={70} width={70} />

      {/* )} */}
    </>
  )
}

export default Illustration
