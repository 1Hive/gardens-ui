import { IndividualStepTypes } from './stepper-statuses'

export const TRANSACTION_SIGNING_DESC = {
  [IndividualStepTypes.STEP_WAITING]: 'Waiting for signature',
  [IndividualStepTypes.STEP_PROMPTING]: 'Waiting for signature',
  [IndividualStepTypes.STEP_WORKING]:
    'Hang tight. Your transaction is being processed by the network…',
  [IndividualStepTypes.STEP_SUCCESS]:
    'Your transaction has successfully been processed!',
  [IndividualStepTypes.STEP_ERROR]: 'An error has occured',
}

export const MESSAGE_SIGNING_DESC = {
  [IndividualStepTypes.STEP_WAITING]: 'Waiting for signature',
  [IndividualStepTypes.STEP_PROMPTING]: 'Waiting for signature',
  [IndividualStepTypes.STEP_WORKING]: 'Message being signed',
  [IndividualStepTypes.STEP_SUCCESS]: 'Message signed',
  [IndividualStepTypes.STEP_ERROR]: 'An error has occured',
}
