import React, { useMemo } from 'react'
import {
  addressesEqual,
  Box,
  Button,
  GU,
  Info,
  Link,
  LoadingRing,
  textStyle,
  Timer,
  useTheme,
} from '@1hive/1hive-ui'
import { ConvictionCountdown } from './ConvictionVisuals'

import { useWallet } from '../providers/Wallet'
import { useDisputeState } from '../hooks/useDispute'

import { ProposalTypes } from '../types'
import { dateFormat } from '../utils/date-utils'
import { formatTokenAmount } from '../utils/token-utils'
import {
  DisputeStates,
  DISPUTE_STATE_RULED,
  RoundStates,
} from '../utils/dispute-utils'
import { getNetwork } from '../networks'

const DATE_FORMAT = 'YYYY/MM/DD , HH:mm'

function getInfoActionContent(proposal, account, actions) {
  const isSubmitter = addressesEqual(account, proposal.creator)
  const isChallenger = addressesEqual(account, proposal.challenger)

  if (proposal.statusData.open) {
    // Proposal has not been disputed
    if (proposal.disputedAt === 0) {
      return {
        info:
          proposal.type === ProposalTypes.Suggestion
            ? 'The suggestion will exist until it is successfully challenged or removed.'
            : `The proposed action will be executed if nobody challenges it ${
                proposal.type === ProposalTypes.Decision
                  ? 'during the voting period and the result of the vote is cast with majority support'
                  : 'and the proposal accrues sufficient conviction'
              }.`,
        actions: isSubmitter
          ? []
          : [
              {
                label: `Challenge ${
                  proposal.type === ProposalTypes.Decision
                    ? 'decision'
                    : 'proposal'
                }`,
                mode: 'strong',
                onClick: actions.onChallengeAction,
              },
            ],
      }
    }

    return { info: 'Proposals cannot be challenged more than once.' }
  }

  if (proposal.statusData.challenged && isSubmitter) {
    return {
      info:
        "If you don't accept the settlement or raise to Celeste, the settlement amount will be lost to the challenger.",
      actions: [
        {
          label: 'Accept settlement',
          mode: 'strong',
          onClick: actions.onSettleAction,
        },
        {
          label: 'Raise to celeste',
          mode: 'normal',
          onClick: actions.onDisputeAction,
        },
      ],
    }
  }

  // Means proposal is settled because submitter didn't responded
  if (proposal.statusData.settled && proposal.settledAt === 0) {
    if (isChallenger) {
      return {
        info:
          'When you claim your collateral, you’ll get a refund for your settlement offer, action deposit and dispute fees.',
        actions: [
          {
            label: 'Claim collateral',
            mode: 'strong',
            onClick: actions.onSettleAction,
          },
        ],
      }
    }
  }

  return null
}

function DisputableActionInfo({
  proposal,
  onChallengeAction,
  onDisputeAction,
  onResolveAction,
  onSettleAction,
}) {
  return (
    <Box heading="Disputable action">
      <div
        css={`
          display: grid;
          grid-gap: ${2 * GU}px;
        `}
      >
        {proposal.type === ProposalTypes.Decision ? (
          <VotingPeriod proposal={proposal} />
        ) : (
          <Conviction proposal={proposal} />
        )}
        {(proposal.statusData.challenged || proposal.statusData.settled) && (
          <Settlement proposal={proposal} />
        )}
        {(proposal.statusData.disputed || proposal.disputedAt > 0) && (
          <Dispute onResolveAction={onResolveAction} proposal={proposal} />
        )}
        <Actions
          proposal={proposal}
          onChallengeAction={onChallengeAction}
          onDisputeAction={onDisputeAction}
          onSettleAction={onSettleAction}
        />
      </div>
    </Box>
  )
}

function VotingPeriod({ proposal }) {
  const theme = useTheme()
  const periodNode = useMemo(() => {
    if (
      proposal.statusData.challenged ||
      proposal.statusData.disputed ||
      proposal.statusData.settled
    ) {
      return (
        <span>
          Paused{' '}
          <span
            css={`
              color: ${theme.contentSecondary};
            `}
          >
            ({dateFormat(proposal.pausedAt, DATE_FORMAT)})
          </span>
        </span>
      )
    }

    return proposal.endDate < Date.now() ? (
      <span>
        Ended{' '}
        <span
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          ({dateFormat(proposal.endDate, DATE_FORMAT)})
        </span>
      </span>
    ) : (
      <Timer end={proposal.endDate} />
    )
  }, [proposal.endDate, proposal.pausedAt, proposal.statusData, theme])

  const isResumed = proposal.statusData.open && proposal.pausedAt > 0

  return (
    <DataField
      label={`Voting period${isResumed ? ` (Resumed)` : ''}`}
      value={periodNode}
    />
  )
}

function Conviction({ proposal }) {
  if (proposal.type === ProposalTypes.Suggestion) {
    return null
  }

  const isCancelled =
    proposal.statusData.cancelled || proposal.statusData.settled

  return (
    <DataField
      label="Estimated time until pass"
      value={
        isCancelled ? 'Cancelled' : <ConvictionCountdown proposal={proposal} />
      }
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
                ({dateFormat(endDate, DATE_FORMAT)})
              </span>
            </span>
          ) : (
            <Timer end={endDate} />
          )
        }
      />
      {proposal.statusData.challenged && (
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

function Dispute({ onResolveAction, proposal }) {
  const theme = useTheme()
  const { account } = useWallet()
  const celesteUrl = getNetwork().celesteUrl
  const [disputeState, roundState] = useDisputeState(proposal.disputeId)

  return (
    <div>
      <DataField
        label="Dispute"
        value={
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Link
              href={`${celesteUrl}/disputes/${proposal.disputeId}`}
              css={`
                margin-right: ${0.5 * GU}px;
              `}
            >
              Celeste Q#{proposal.disputeId}
            </Link>
            <span
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              {disputeState !== null ? (
                `(${
                  roundState
                    ? RoundStates[roundState]
                    : DisputeStates[disputeState]
                })`
              ) : (
                <LoadingRing />
              )}
            </span>
          </div>
        }
      />
      {proposal.statusData.disputed && disputeState === DISPUTE_STATE_RULED && (
        <Button
          label="Resolve dispute"
          mode="strong"
          onClick={onResolveAction}
          wide
          disabled={!account}
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
      )}
    </div>
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

function Actions({
  proposal,
  onChallengeAction,
  onDisputeAction,
  onSettleAction,
}) {
  const { account } = useWallet()
  const content = getInfoActionContent(proposal, account, {
    onChallengeAction,
    onDisputeAction,
    onSettleAction,
  })

  if (!content) {
    return null
  }

  return (
    <div>
      {content.info && <Info>{content.info}</Info>}
      {content.actions &&
        content.actions.map((action, index) => (
          <Button
            key={index}
            label={action.label}
            mode={action.mode}
            onClick={action.onClick}
            wide
            disabled={!account}
            css={`
              margin-top: ${2 * GU}px;
            `}
          />
        ))}
    </div>
  )
}

export default DisputableActionInfo
