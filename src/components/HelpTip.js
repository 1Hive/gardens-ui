import React from 'react'
import { Help } from '@1hive/1hive-ui'

const KNOWN_HELP_DESCRIPTIONS = {
  'support-percentage': [
    'Support Percentage',
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
      The <strong>Minimum Approval</strong> is the percentage of the total token
      supply that is required to vote “Yes” on this type of proposal before it
      can be approved. For example, if the “Minimum Approval” is set to 20%,
      then more than 20% of the outstanding token supply must vote “Yes” for it
      to pass.
    </>,
  ],
  'challenge-deposit': [
    'Challenge Deposit',
    <>
      The <strong>Challenge Deposit</strong> is the amount of tokens locked
      every time a proposal is challenged. This deposit is submitted at the time
      of the challenge.
    </>,
  ],
  'proposal-deposit': [
    'Proposal Deposit',
    <>
      The <strong>Proposal Deposit</strong> is the amount of tokens locked every
      time a proposal is created. They will be automatically locked from the
      funds available in your deposit manager.
    </>,
  ],
  'settlement-period': [
    'Settlement Period',
    <>
      The <strong>Settlement Period</strong> is the amount of time the proposal
      author has to either accept the settlement offer or raise the dispute to
      Celeste.
    </>,
  ],
  'settlement-offer': [
    'Settlement Offer',
    <>
      The <strong>Settlement Offer</strong> (denominated in your Garden's token)
      is the amount of tokens you stand to receive from the proposal author, if
      he or she chooses to withdraw their proposal before it is raised to
      Celeste.
    </>,
  ],
  'common-pool': [
    'Common Pool',
    <>
      The <strong>Common Pool</strong> is the amount of tokens available for
      funding proposals.
    </>,
  ],
  'total-supply': [
    'Total Supply',
    <>
      The <strong>Total Supply</strong> is the the total amount of tokens in
      circulation, including the common pool.
    </>,
  ],
  'total-support': [
    'Total Support',
    <>
      The <strong>Total Support</strong> is the amount of tokens currently being
      used to support proposals.
    </>,
  ],
  all: [
    'All proposals',
    <>View all proposals (suggestion, funding, and decision).</>,
  ],
  suggestion: [
    'Suggestion Proposals',
    <>
      Suggestion proposals are used to gather community sentiment for ideas or
      future funding proposals.
    </>,
  ],
  decision: [
    'Decision proposals',
    <>
      Decisions are proposals which seek to update the DAO's DNA (i.e. the
      metagovernance parameters)
    </>,
  ],
  funding: [
    'Funding proposals',
    <>
      Funding proposals ask for an amount of funds. These funds are granted if
      the proposal in question receives enough support (conviction).
    </>,
  ],
}

function HelpTip({ type }) {
  const [name, description] = KNOWN_HELP_DESCRIPTIONS[type]
  return <Help hint={`${name}`}>{description}</Help>
}

export default HelpTip
