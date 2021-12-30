import { IndividualStepTypes } from './stepper-statuses'

export const TRANSACTION_SIGNING_DESC = {
  [IndividualStepTypes.Waiting]: 'Waiting for signature',
  [IndividualStepTypes.Prompting]: 'Waiting for signature',
  [IndividualStepTypes.Working]:
    'Hang tight. Your transaction is being processed by the network…',
  [IndividualStepTypes.Success]:
    'Your transaction has successfully been processed!',
  [IndividualStepTypes.Error]: 'An error has occured',
}

export const MESSAGE_SIGNING_DESC = {
  [IndividualStepTypes.Waiting]: 'Waiting for signature',
  [IndividualStepTypes.Prompting]: 'Waiting for signature',
  [IndividualStepTypes.Working]: 'Message being signed',
  [IndividualStepTypes.Success]: 'Message signed',
  [IndividualStepTypes.Error]: 'An error has occured',
}
