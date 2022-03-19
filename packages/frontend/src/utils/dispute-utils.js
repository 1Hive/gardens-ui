export const DISPUTE_STATE_PREDRAFT = 0
export const DISPUTE_STATE_ADJUDICATING = 1
export const DISPUTE_STATE_RULED = 2

export const ROUND_STATE_INVALID = 0
export const ROUND_STATE_COMMITTING = 1
export const ROUND_STATE_REVEALING = 2
export const ROUND_STATE_APPEALING = 3
export const ROUND_STATE_CONFIRMINGAPPEAL = 4
export const ROUND_STATE_ENDED = 5

export const DisputeStates = {
  [DISPUTE_STATE_PREDRAFT]: 'PreDraft',
  [DISPUTE_STATE_ADJUDICATING]: 'Adjudicating',
  [DISPUTE_STATE_RULED]: 'Ruled',
}

export const RoundStates = {
  [ROUND_STATE_INVALID]: 'Invalid',
  [ROUND_STATE_COMMITTING]: 'Committing',
  [ROUND_STATE_REVEALING]: 'Revealing',
  [ROUND_STATE_APPEALING]: 'Appealing',
  [ROUND_STATE_CONFIRMINGAPPEAL]: 'ConfirmingAppeal',
  [ROUND_STATE_ENDED]: 'Ended',
}
