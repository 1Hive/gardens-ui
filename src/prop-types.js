import { IndividualStepTypes } from '@components/Stepper/stepper-statuses'
import PropTypes from 'prop-types'

export const TransactionStatusType = PropTypes.oneOf([
  IndividualStepTypes.Error,
  IndividualStepTypes.Prompting,
  IndividualStepTypes.Success,
  IndividualStepTypes.Waiting,
  IndividualStepTypes.Working,
])
