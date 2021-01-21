import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  GU,
  Info,
  Link,
  LoadingRing,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import Description from '../components/Description'
import DisputableActionInfo from '../components/DisputableActionInfo'
import IdentityBadge from '../components/IdentityBadge'
import SummaryBar from '../components/DecisionDetail/SummaryBar'
import SummaryRow from '../components/DecisionDetail/SummaryRow'
import VoteActions from '../components/DecisionDetail/VoteActions'
import VoteCasted from '../components/DecisionDetail/VoteCasted'
import VoteStatus, {
  getStatusAttributes,
} from '../components/DecisionDetail/VoteStatus'

import { useAppState } from '../providers/AppState'
import { useDescribeVote } from '../hooks/useDescribeVote'
import { useWallet } from '../providers/Wallet'

import { addressesEqualNoSum as addressesEqual } from '../utils/web3-utils'
import { dateFormat } from '../utils/date-utils'
import { round, safeDiv } from '../utils/math-utils'
import { getConnectedAccountVote, getQuorumProgress } from '../utils/vote-utils'

import {
  PCT_BASE,
  VOTE_NAY,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_SETTLED,
  VOTE_YEA,
} from '../constants'
import celesteStarIconSvg from '../assets/icon-celeste-star.svg'
import coinsIconSvg from '../assets/icon-coins.svg'
import honeyIconSvg from '../assets/honey.svg'
import lockIconSvg from '../assets/icon-lock.svg'
import warningIconSvg from '../assets/icon-warning.svg'

function DecisionDetail({ proposal, actions }) {
  const theme = useTheme()
  const history = useHistory()
  const { layoutName } = useLayout()
  const { account: connectedAccount } = useWallet()
  const {
    config: { voting: votingConfig },
  } = useAppState()

  const {
    description,
    emptyScript,
    loading: descriptionLoading,
  } = useDescribeVote(proposal.script, proposal.id)

  const oneColumn = layoutName === 'small' || layoutName === 'medium'
  const connectedAccountVote = getConnectedAccountVote(
    proposal,
    connectedAccount
  )

  const { background, borderColor } = getStatusAttributes(proposal, theme)

  const youVoted =
    connectedAccountVote === VOTE_YEA || connectedAccountVote === VOTE_NAY

  const { creator, minAcceptQuorum, nay, number, yea } = proposal || {}

  const totalVotes = parseFloat(yea) + parseFloat(nay)
  const yeasPct = safeDiv(parseFloat(yea), totalVotes)

  const quorumProgress = getQuorumProgress(proposal)

  const handleBack = useCallback(() => {
    history.push('/home')
  }, [history])

  const handleVoteNo = useCallback(() => {
    actions.voteOnDecision(proposal.number, VOTE_NAY)
  }, [actions, proposal.number])

  const handleVoteYes = useCallback(() => {
    actions.voteOnDecision(proposal.number, VOTE_YEA)
  }, [actions, proposal.number])

  const handleExecute = useCallback(() => {
    actions.executeDecision(proposal.number)
  }, [actions, proposal.number])

  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      <BackButton
        onClick={handleBack}
        css={`
          background: ${theme.background};
          margin-bottom: ${2 * GU}px;
          border: 0;
        `}
      />
      <div
        css={`
          > div > div:nth-child(2) {
            width: ${oneColumn ? '100%' : `${40 * GU}px`};
          }
        `}
      >
        <Split
          primary={
            <Box
              css={`
                background: ${background};
                border-color: ${borderColor};
              `}
            >
              <section
                css={`
                  display: grid;
                  grid-template-rows: auto;
                  grid-row-gap: ${7 * GU}px;
                `}
              >
                <h1
                  css={`
                    ${textStyle('title2')};
                  `}
                >
                  {`Vote #${number}`}
                </h1>
                <div
                  css={`
                    display: grid;
                    grid-template-columns: ${layoutName !== 'small'
                      ? `auto auto`
                      : 'auto'};
                    grid-column-gap: ${layoutName !== 'small'
                      ? 10 * GU
                      : 2.5 * GU}px;
                    grid-row-gap: ${5 * GU}px;
                  `}
                >
                  <DataField
                    label="Description"
                    value={
                      emptyScript ? (
                        proposal.metadata
                      ) : (
                        <Description path={description} />
                      )
                    }
                    loading={descriptionLoading}
                  />
                  <DataField
                    label="Status"
                    value={<VoteStatus vote={proposal} />}
                  />
                  <DataField
                    label="Action collateral"
                    value={<ActionCollateral proposal={proposal} />}
                  />
                  <DataField
                    label="Submitted by"
                    value={
                      <IdentityBadge
                        connectedAccount={addressesEqual(
                          creator,
                          connectedAccount
                        )}
                        entity={creator}
                      />
                    }
                  />
                </div>
              </section>
              <div
                css={`
                  margin-top: ${6 * GU}px;
                `}
              >
                <SummaryInfo vote={proposal} />
                {youVoted && (
                  <VoteCasted
                    account={connectedAccount}
                    accountVote={connectedAccountVote}
                    vote={proposal}
                  />
                )}
              </div>
              <VoteInfoActions
                onExecute={handleExecute}
                onVoteNo={handleVoteNo}
                onVoteYes={handleVoteYes}
                vote={proposal}
              />
            </Box>
          }
          secondary={
            <>
              <Box heading="Disputable action">
                <DisputableActionInfo proposal={proposal} />
              </Box>
              <Box heading="Relative support %">
                <div
                  css={`
                    ${textStyle('body2')};
                  `}
                >
                  {round(yeasPct * 100, 2)}%{' '}
                  <span
                    css={`
                      color: ${theme.surfaceContentSecondary};
                    `}
                  >
                    (
                    {votingConfig.supportRequiredPct
                      .div(PCT_BASE.div(100))
                      .toNumber()}
                    % support needed)
                  </span>
                </div>
                <SummaryBar
                  positiveSize={yeasPct}
                  requiredSize={votingConfig.supportRequiredPct.div(PCT_BASE)}
                  css={`
                    margin-top: ${2 * GU}px;
                  `}
                />
              </Box>
              <Box heading="Minimum approval %">
                <div
                  css={`
                    ${textStyle('body2')};
                  `}
                >
                  {round(quorumProgress * 100, 2)}%{' '}
                  <span
                    css={`
                      color: ${theme.surfaceContentSecondary};
                    `}
                  >
                    (
                    {votingConfig.minAcceptQuorumPct
                      .div(PCT_BASE.div(100))
                      .toNumber()}
                    % approval needed)
                  </span>
                </div>
                <SummaryBar
                  positiveSize={quorumProgress}
                  requiredSize={minAcceptQuorum.div(PCT_BASE)}
                  css={`
                    margin-top: ${2 * GU}px;
                  `}
                />
              </Box>
            </>
          }
        />
      </div>
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
          margin-bottom: ${2 * GU}px;
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

function SummaryInfo({ vote }) {
  // const { account: connectedAccount } = useWallet()
  const { stakeToken } = useAppState()
  const theme = useTheme()
  const { minAcceptQuorum, nay, yea } = vote

  const totalVotes = parseFloat(yea) + parseFloat(nay)
  const yeasPct = safeDiv(parseFloat(yea), totalVotes)
  const naysPct = safeDiv(parseFloat(nay), totalVotes)

  return (
    <div>
      <DataField
        label="Current votes"
        value={
          <>
            <SummaryBar
              positiveSize={yeasPct}
              negativeSize={naysPct}
              requiredSize={minAcceptQuorum}
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            />
            <div
              css={`
                display: inline-block;
              `}
            >
              <SummaryRow
                color={theme.positive}
                label="Yes"
                pct={Math.floor(yeasPct * 100)}
                token={{
                  amount: yea,
                  symbol: stakeToken.symbol,
                  decimals: stakeToken.decimals,
                }}
              />
              <SummaryRow
                color={theme.negative}
                label="No"
                pct={Math.floor(naysPct * 100)}
                token={{
                  amount: nay,
                  symbol: stakeToken.symbol,
                  decimals: stakeToken.decimals,
                }}
              />
            </div>
          </>
        }
      />
    </div>
  )
}

function ActionCollateral({ proposal }) {
  const { collateralRequirement } = proposal
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img
        src={honeyIconSvg}
        alt=""
        height="28"
        width="28"
        css={`
          margin-right: ${0.5 * GU}px;
        `}
      />
      <div
        css={`
          margin-right: ${0.5 * GU}px;
        `}
      >
        {collateralRequirement.formattedActionAmount}{' '}
        {collateralRequirement.tokenSymbol}
      </div>
      <img src={lockIconSvg} alt="" width="16" height="16" />
    </div>
  )
}

function VoteInfoActions({ onExecute, onVoteNo, onVoteYes, vote }) {
  if (vote.voteStatus === VOTE_STATUS_CHALLENGED) {
    return (
      <Info mode="warning">
        This vote has been paused as the result of the originating action being
        challenged. When the challenge is resolved, if allowed, the voting
        period will resume and last the rest of its duration time. Othersiwe, it
        will be cancelled.
      </Info>
    )
  }

  if (vote.voteStatus === VOTE_STATUS_DISPUTED) {
    return <VoteDisputedInfo vote={vote} />
  }

  if (vote.voteStatus === VOTE_STATUS_SETTLED) {
    return <VoteSettledInfo vote={vote} />
  }

  return (
    <VoteActions
      onExecute={onExecute}
      onVoteNo={onVoteNo}
      onVoteYes={onVoteYes}
      vote={vote}
    />
  )
}

function VoteDisputedInfo({ vote }) {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      <Box
        padding={6 * GU}
        css={`
          border: 0;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin: 0 ${11 * GU}px;
          `}
        >
          <img src={celesteStarIconSvg} width="52" height="52" alt="" />
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
              You have invoked Celeste and are awaiting a response
            </div>
            <div>
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                You invoked celeste on{' '}
              </span>
              {dateFormat(vote.disputedAt, 'YYYY/MM/DD HH:mm')}.{' '}
              <span
                css={`
                  color: ${theme.contentSecondary};
                `}
              >
                You can follow the process in{' '}
              </span>
              <Link href="celeste.1hive.org">Celeste Dashboard</Link>.
              {/* TODO: Update link when available */}
            </div>
          </div>
        </div>
      </Box>
      <Info
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Celeste has been invoked to settle a challenge. When the challenge is
        resolved, if allowed, the estimated time for it to pass will be resumed
        for the remaining of its duration time. Othersiwe, this proposal will be
        cancelled.
      </Info>
    </div>
  )
}

function VoteSettledInfo({ vote }) {
  const theme = useTheme()
  const { account } = useWallet()

  const isSubmitter = addressesEqual(vote.creator, account)
  const isChallenger = addressesEqual(vote.challenger, account)

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      {isSubmitter ||
        (isChallenger && (
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
              <img
                src={isSubmitter ? coinsIconSvg : warningIconSvg}
                width="52"
                height="52"
                alt=""
              />
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
                    {isSubmitter
                      ? 'You have accepted the settlement offer'
                      : 'You have challenged this vote'}
                  </div>
                </div>
                <div>
                  <span
                    css={`
                      color: ${theme.contentSecondary};
                    `}
                  >
                    {isSubmitter
                      ? 'You acccepted the setttlement offer on'
                      : 'You have challenged this action on'}
                  </span>
                  {dateFormat(
                    isSubmitter
                      ? vote.settledAt > 0
                        ? vote.settledAt
                        : vote.challengeEndDate
                      : vote.challengedAt,
                    'YYYY/MM/DD HH:mm'
                  )}{' '}
                  <span
                    css={`
                      color: ${theme.contentSecondary};
                    `}
                  >
                    and your {isSubmitter ? 'action' : 'challenge'} collateral
                    has been slashed{' '}
                    <span
                      css={`
                        color: ${theme.content};
                      `}
                    >
                      -
                      {
                        vote.collateralRequirement[
                          isSubmitter
                            ? 'formattedActionAmount'
                            : 'formattedChallengeAmount'
                        ]
                      }{' '}
                      {vote.collateralRequirement.tokenSymbol}
                    </span>
                    . You can manage your deposit balances in{' '}
                  </span>
                  <Link href="#/profile" external={false}>
                    Stake Management
                  </Link>
                  .
                </div>
              </div>
            </div>
          </Box>
        ))}
      <Info mode="warning">
        This vote has been cancelled as the result of the originating action
        being challenged and the settlement offer being accepted.
      </Info>
    </div>
  )
}

export default DecisionDetail
