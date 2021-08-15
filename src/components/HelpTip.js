import React from 'react'
import { Help } from '@1hive/1hive-ui'

const KNOWN_HELP_DESCRIPTIONS = {
  'support-percentage': [
    'Support percentage',
    <>
      <strong>Support</strong> is the relative percentage of tokens that are
      required to vote “Yes” for a proposal to be approved. For example, if
      “Support” is set to 50%, then more than 50% of the tokens used to vote on
      a proposal must vote “Yes” for it to pass.
    </>,
  ],
  'minimum-approval': [
    'Minimum Approval',
    <>
      <strong>Minimum Approval</strong> is the percentage of the total token
      supply that is required to vote “Yes” on a proposal before it can be
      approved. For example, if the “Minimum Approval” is set to 20%, then more
      than 20% of the outstanding token supply must vote “Yes” on a proposal for
      it to pass.
    </>,
  ],
  'challenge-deposit': [
    'Challenge Deposit',
    <>
      <strong>Challenge deposit</strong> is the amount of tokens locked every
      time a proposal is challenged. This deposit will be submitted at the time
      of the challenge.
    </>,
  ],
  'proposal-deposit': [
    'Proposal Deposit',
    <>
      <strong>Proposal deposit</strong> is the amount of tokens locked every
      time a proposal is created. They will be automatically locked from the
      funds available in your deposit manager.
    </>,
  ],
  'settlement-period': [
    'Minimum Approval',
    <>
      The <strong>Settlement Period</strong> is the interval of time that starts
      when a disputable action is challenged and lasts until it’s resolved
      between the parties (submitter and challenger), by accepting the
      settlement offer or by raising the dispute to Celeste.
    </>,
  ],
  'settlement-offer': [
    'Settlement Offer',
    <>
      The <strong>Settlement Offer</strong> is the amount of tokens that you
      would accept from the proposal submitter in order to cancel the action
      without raising it to Celeste. This amount, if settled, will be slashed
      from the proposal submitter's collateral and sent to you so it cannot be
      greater than the collateral locked for the action but it can be zero.
    </>,
  ],
}

function HelpTip({ type }) {
  const [name, description] = KNOWN_HELP_DESCRIPTIONS[type]

  return <Help hint={`What is ${name}?`}>{description}</Help>
}

export default HelpTip
