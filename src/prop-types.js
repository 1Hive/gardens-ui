import PropTypes from 'prop-types'
import { IndividualStepTypes } from '@components/Stepper/stepper-statuses'

export const TransactionStatusType = PropTypes.oneOf([
  IndividualStepTypes.STEP_ERROR,
  IndividualStepTypes.STEP_PROMPTING,
  IndividualStepTypes.STEP_SUCCESS,
  IndividualStepTypes.STEP_WAITING,
  IndividualStepTypes.STEP_WORKING,
])
