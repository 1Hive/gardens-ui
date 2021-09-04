import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from './stepper-statuses'

export const TRANSACTION_SIGNING_DESC = {
  [STEP_WAITING]: 'Waiting for signature',
  [STEP_PROMPTING]: 'Waiting for signature',
  [STEP_WORKING]:
    'Hang tight. Your transaction is being processed by the network...',
  [STEP_SUCCESS]:
    'Your transaction has successfully been processed! You might need to wait a few seconds for the UI to update',
  [STEP_ERROR]: 'An error has occured',
}

export const MESSAGE_SIGNING_DESC = {
  [STEP_WAITING]: 'Waiting for signature',
  [STEP_PROMPTING]: 'Waiting for signature',
  [STEP_WORKING]: 'Message being signed',
  [STEP_SUCCESS]: 'Message signed',
  [STEP_ERROR]: 'An error has occured',
}
