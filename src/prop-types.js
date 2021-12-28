import PropTypes from 'prop-types'

import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '@components/Stepper/stepper-statuses'

export const TransactionStatusType = PropTypes.oneOf([
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
])
