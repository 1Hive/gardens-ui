import React, { useMemo } from 'react'
import {
  addressesEqual,
  Button,
  GU,
  Info,
  LoadingRing,
  textStyle,
  Timer,
  useTheme,
} from '@1hive/1hive-ui'
import { useWallet } from '../providers/Wallet'
import { dateFormat } from '../utils/date-utils'
import { formatTokenAmount } from '../utils/token-utils'
import {
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_SETTLED,
} from '../constants'

function getInfoActionContent(proposal, account) {
  if (proposal.voteStatus === VOTE_STATUS_ONGOING) {
    // Proposal has not been disputed
    if (proposal.disputedAt === 0) {
      return {
        info:
          'The proposed action will be executed if nobody challenges it during the voting period and the result of the vote is casted with majority support.',
      }
    }

    if (addressesEqual(account, proposal.creator)) {
      return { info: 'The proposed action cannot be challenged.' }
    } else if (addressesEqual(account, proposal.challenger)) {
      return {
        info:
          'When you claim your collateral, you’ll get a refund for your settlement offer, action deposit and dispute fees.',
      }
    }
  }

  if (
    proposal.voteStatus === VOTE_STATUS_CHALLENGED &&
    addressesEqual(account, proposal.submitter)
  ) {
    return {
      info:
        "If you don't accept the settlement or raise to Celeste, the settlement amount will be lost to the challenger.",
      actions: [
        { label: 'Accept settlement', mode: 'strong' },
        { label: 'Raise to celeste', mode: 'normal' },
      ],
    }
  }

  if (proposal.voteStatus === VOTE_STATUS_SETTLED) {
    if (addressesEqual(account, proposal.challenger)) {
      return {
        info:
          'When you claim your collateral, you’ll get a refund for your settlement offer, action deposit and dispute fees.',
      }
    }
  }

  return null
}

function DisputableActionInfo({ proposal }) {
  return (
    <div
      css={`
        display: grid;
        grid-gap: ${2 * GU}px;
      `}
    >
      <VotingPeriod proposal={proposal} />
      {(proposal.voteStatus === VOTE_STATUS_CHALLENGED ||
        proposal.voteStatus === VOTE_STATUS_SETTLED) && (
        <Settlement proposal={proposal} />
      )}
      {proposal.voteStatus === VOTE_STATUS_DISPUTED && (
        <DataField
          label="Dispute"
          value={<div>Celeste Q#{proposal.disputeId}</div>}
        />
      )}
      <Actions proposal={proposal} />
    </div>
  )
}

function VotingPeriod({ proposal }) {
  const theme = useTheme()
  const periodNode = useMemo(() => {
    if (
      proposal.voteStatus === VOTE_STATUS_CHALLENGED ||
      proposal.voteStatus === VOTE_STATUS_DISPUTED ||
      proposal.voteStatus === VOTE_STATUS_SETTLED
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

function Settlement({ proposal }) {
  const theme = useTheme()
  const endDate = new Date(
    proposal.settledAt > 0 ? proposal.settledAt : proposal.challengeEndDate
  )

  return (
    <>
      <DataField
        label="Settlement period"
        value={
          endDate.getTime() < Date.now() ? (
            <span>
              Ended{' '}
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                ({dateFormat(endDate, 'YYYY/MM/DD , HH:mm')})
              </span>
            </span>
          ) : (
            <Timer end={endDate} />
          )
        }
      />
      {proposal.voteStatus === VOTE_STATUS_CHALLENGED && (
        <DataField
          label="Settlement amount"
          value={
            <span>
              {formatTokenAmount(
                proposal.settlementOffer,
                proposal.collateralRequirement.tokenDecimals
              )}{' '}
              {proposal.collateralRequirement.tokenSymbol}
            </span>
          }
        />
      )}
    </>
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

function Actions({ proposal }) {
  const { account } = useWallet()
  const content = getInfoActionContent(proposal, account)

  return (
    <div>
      {content?.info && <Info>{content.info}</Info>}
      {content?.actions &&
        content.actions.map(action => (
          <Button label={action.label} mode={action.mode} />
        ))}
    </div>
  )
}

export default DisputableActionInfo
