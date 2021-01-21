import React, { useMemo } from 'react'
import { GU, LoadingRing, textStyle, Timer, useTheme } from '@1hive/1hive-ui'
import { dateFormat } from '../utils/date-utils'
import {
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_SETTLED,
} from '../constants'

function DisputableActionInfo({ proposal }) {
  return (
    <div
      css={`
        display: grid;
        grid-gap: ${2 * GU}px;
      `}
    >
      <VotingPeriod proposal={proposal} />
      {proposal.voteStatus === VOTE_STATUS_CHALLENGED ||
        (proposal.voteStatus === VOTE_STATUS_SETTLED && (
          <SettlementPeriod proposal={proposal} />
        ))}
      {proposal.voteStatus === VOTE_STATUS_DISPUTED && (
        <DataField
          label="Dispute"
          value={<div>Celeste Q#{proposal.disputeId}</div>}
        />
      )}
    </div>
  )
}

function VotingPeriod({ proposal }) {
  const theme = useTheme()
  const periodNode = useMemo(() => {
    if (
      proposal.voteStatus === VOTE_STATUS_CHALLENGED ||
      proposal.voteStatus === VOTE_STATUS_DISPUTED
    ) {
      return (
        <span>
          Paused{' '}
          <span
            css={`
              color: ${theme.contentSecondary};
            `}
          >
            ({dateFormat(proposal.pausedAt, 'YYYY/MM/DD , HH:mm')})
          </span>
        </span>
      )
    }
  }, [proposal.pausedAt, proposal.voteStatus, theme])

  const isResumed =
    proposal.voteStatus === VOTE_STATUS_ONGOING && proposal.pausedAt > 0

  return (
    <DataField
      label={`Voting period${isResumed ? `(Resumed)` : ''}`}
      value={periodNode}
    />
  )
}

function SettlementPeriod({ proposal }) {
  const endDate = new Date(proposal.pausedAt + proposal.challengeEndDate)
  return (
    <DataField label="Settlement period" value={<Timer endDate={endDate} />} />
  )
}

function DataField({ label, value, loading = false }) {
  const theme = useTheme()

  return (
    <div>
      <h2
        css={`
          ${textStyle('label1')};
          font-weight: 200;
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>

      {loading ? (
        <LoadingRing />
      ) : (
        <div
          css={`
            ${textStyle('body2')};
          `}
        >
          {value}
        </div>
      )}
    </div>
  )
}

export default DisputableActionInfo
