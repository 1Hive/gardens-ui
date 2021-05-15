import React from 'react'
import { Box, GU, Info, Link, textStyle, useTheme } from '@1hive/1hive-ui'

import { useWallet } from '../providers/Wallet'

import { addressesEqualNoSum as addressesEqual } from '../utils/web3-utils'
import { dateFormat } from '../utils/date-utils'

import warningIconSvg from '../assets/icon-warning.svg'
import { formatTokenAmount } from '../utils/token-utils'

import celesteStarIconSvg from '../assets/icon-celeste-star.svg'
import coinsIconSvg from '../assets/icon-coins.svg'
import { ProposalTypes } from '../types'
import { getNetwork } from '../networks'

const DATE_FORMAT = 'YYYY/MM/DD , HH:mm'

function DisputableInfo({ proposal }) {
  if (proposal.statusData.challenged) {
    return <ProposalChallengedInfo proposal={proposal} />
  }

  if (proposal.statusData.disputed) {
    return <ProposalDisputedInfo proposal={proposal} />
  }

  if (proposal.statusData.settled) {
    return <ProposalSettledInfo proposal={proposal} />
  }

  return null
}

function ProposalChallengedInfo({ proposal }) {
  const theme = useTheme()
  const { account } = useWallet()

  return (
    <div>
      {addressesEqual(proposal.challenger, account) && (
        <InfoBox
          content={
            <div>
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                You have challenged this action on{' '}
              </span>
              {dateFormat(proposal.challengedAt, DATE_FORMAT)}{' '}
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                and locked{' '}
                <span
                  css={`
                    color: ${theme.content};
                  `}
                >
                  {formatTokenAmount(
                    proposal.collateralRequirement.challengeAmount,
                    proposal.collateralRequirement.tokenDecimals
                  )}{' '}
                  {proposal.collateralRequirement.tokenSymbol}
                </span>{' '}
                as the action collateral. You can manage your deposit balances
                in{' '}
              </span>
              <Link href="#/collateral" external={false}>
                Collateral Manager
              </Link>
              .
            </div>
          }
          iconSrc={warningIconSvg}
          title="You have challenged this vote"
        />
      )}
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        {proposal.type === ProposalTypes.Decision
          ? `This vote has been paused as the result of the originating action being
          challenged. When the challenge is resolved, if allowed, the voting
          period will resume and last the rest of its duration time. Othersiwe, it
          will be cancelled.`
          : `This proposal has been challenged but you can continue to support it to increase conviction. When the challenge is resolved, if allowed, the proposal will be resumed ${
              proposal.type === ProposalTypes.Proposal
                ? `for the remainder of its duration`
                : ''
            }. Otherwise this proposal will be cancelled.`}
      </Info>
    </div>
  )
}

function ProposalDisputedInfo({ proposal }) {
  const theme = useTheme()
  const { account } = useWallet()
  const celesteUrl = getNetwork().celesteUrl

  const isSubmitter = addressesEqual(proposal.creator, account)
  const isChallenger = addressesEqual(proposal.challenger, account)

  return (
    <div>
      {(isSubmitter || isChallenger) && (
        <InfoBox
          content={
            <div>
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                {isSubmitter ? 'You' : 'Submitter'} invoked celeste on{' '}
              </span>
              {dateFormat(proposal.disputedAt, 'YYYY/MM/DD HH:mm')}.{' '}
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                You can follow the process in{' '}
              </span>
              <Link href={`${celesteUrl}/disputes/${proposal.disputeId}`}>
                Celeste Dashboard
              </Link>
              .
            </div>
          }
          iconSrc={celesteStarIconSvg}
          title={`${
            isSubmitter ? 'You' : 'Submitter'
          } have invoked Celeste and are awaiting a response`}
        />
      )}

      <Info
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Celeste has been invoked to settle a dispute with this proposal
        {proposal.type !== ProposalTypes.Decision
          ? ' but you can still support it and increase its conviction'
          : ''}
        . When the dispute is resolved, if allowed, the proposal will continue
        as normal othersiwe it will be cancelled.
      </Info>
    </div>
  )
}

function ProposalSettledInfo({ proposal }) {
  const theme = useTheme()
  const { account } = useWallet()

  const isSubmitter = addressesEqual(proposal.creator, account)
  const isChallenger = addressesEqual(proposal.challenger, account)

  return (
    <div>
      {(isSubmitter || isChallenger) && (
        <InfoBox
          iconSrc={isSubmitter ? coinsIconSvg : warningIconSvg}
          title={
            isSubmitter
              ? 'You have accepted the settlement offer'
              : 'You have challenged this vote'
          }
          content={
            <div>
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                {isSubmitter
                  ? 'You acccepted the setttlement offer on'
                  : 'You have challenged this action on'}
              </span>{' '}
              {dateFormat(
                isSubmitter
                  ? proposal.settledAt > 0
                    ? proposal.settledAt
                    : proposal.challengeEndDate
                  : proposal.challengedAt,
                'YYYY/MM/DD HH:mm'
              )}{' '}
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                and{' '}
                {isSubmitter ? (
                  `${formatTokenAmount(
                    proposal.settlementOffer,
                    proposal.collateralRequirement.tokenDecimals
                  )} ${
                    proposal.collateralRequirement.tokenSymbol
                  }  from your action collateral has been slashed and the remaining unlocked`
                ) : (
                  <span>
                    your challenge collateral has returned to your wallet{' '}
                    <span
                      css={`
                        color: ${theme.content};
                      `}
                    >
                      {formatTokenAmount(
                        proposal.collateralRequirement.challengeAmount,
                        proposal.collateralRequirement.tokenDecimals
                      )}{' '}
                      {proposal.collateralRequirement.tokenSymbol}
                    </span>
                  </span>
                )}
                . You can manage your deposit balances in{' '}
              </span>
              <Link href="#/profile" external={false}>
                Collateral Manager
              </Link>
              .
            </div>
          }
        />
      )}
      <Info mode="warning">
        This {proposal.type === ProposalTypes.Decision ? 'vote' : 'proposal'}{' '}
        has been cancelled as the result of the originating action being
        challenged and the settlement offer being accepted.
      </Info>
    </div>
  )
}

const InfoBox = ({ content, iconSrc, title }) => {
  return (
    <Box
      padding={6 * GU}
      css={`
        border: 0;
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          margin: 0 ${11 * GU}px;
        `}
      >
        <img src={iconSrc} width="52" height="52" alt="" />
        <div
          css={`
            margin-left: ${3.5 * GU}px;
          `}
        >
          <div
            css={`
              ${textStyle('body1')};
              margin-bottom: ${2 * GU}px;
            `}
          >
            <div
              css={`
                ${textStyle('body1')};
                margin-bottom: ${2 * GU}px;
              `}
            >
              {title}
            </div>
          </div>
          {content}
        </div>
      </div>
    </Box>
  )
}

export default DisputableInfo
