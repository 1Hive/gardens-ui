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
  [STEP_WORKING]: 'Please be patient while your transaction is being mined',
  [STEP_SUCCESS]: 'Thank you! Your transaction has been successfully mined',
  [STEP_ERROR]: 'An error has occured',
}

export const MESSAGE_SIGNING_DESC = {
  [STEP_WAITING]: 'Waiting for signature',
  [STEP_PROMPTING]: 'Waiting for signature',
  [STEP_WORKING]: 'Message being signed',
  [STEP_SUCCESS]: 'Message signed',
  [STEP_ERROR]: 'An error has occured',
}
