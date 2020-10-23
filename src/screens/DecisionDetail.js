import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  GU,
  IconTime,
  LoadingRing,
  Split,
  textStyle,
  Timer,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import Description from '../components/Description'
import IdentityBadge from '../components/IdentityBadge'
import SummaryBar from '../components/DecisionDetail/SummaryBar'
import SummaryRow from '../components/DecisionDetail/SummaryRow'
import VoteCasted from '../components/DecisionDetail/VoteCasted'
import VoteActions from '../components/DecisionDetail/VoteActions'
import VoteStatus from '../components/DecisionDetail/VoteStatus'

import { useWallet } from '../providers/Wallet'
import { useDescribeVote } from '../hooks/useDescribeVote'
import { useAppState } from '../providers/AppState'
import { useBlockTimeStamp } from '../hooks/useBlock'

import { addressesEqualNoSum as addressesEqual } from '../utils/web3-utils'
import { round, safeDiv } from '../utils/math-utils'
import {
  getConnectedAccountVote,
  getQuorumProgress,
  getVoteSuccess,
} from '../utils/vote-utils'
import { dateFormat } from '../utils/date-utils'

import { PCT_BASE, VOTE_NAY, VOTE_YEA } from '../constants'

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
            <Box>
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
                    grid-gap: ${layoutName !== 'small' ? 10 * GU : 2.5 * GU}px;
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
                  margin-top: ${2 * GU}px;
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
              <VoteActions
                onExecute={handleExecute}
                onVoteNo={handleVoteNo}
                onVoteYes={handleVoteYes}
                vote={proposal}
              />
            </Box>
          }
          secondary={
            <>
              <Box heading="Status">
                <Status vote={proposal} />
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
        label="Votes"
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

function Status({ vote }) {
  const theme = useTheme()

  const { endBlock } = vote
  const { upcoming, open, delayed, closed, transitionAt } = vote.data

  const endBlockTimeStamp = useBlockTimeStamp(endBlock)

  if (!closed || (delayed && getVoteSuccess(vote, PCT_BASE))) {
    return (
      <React.Fragment>
        <div
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${1 * GU}px;
          `}
        >
          {upcoming
            ? `Time to start `
            : open
            ? ` Time remaining`
            : `Time for enactment`}
        </div>
        <Timer end={transitionAt} maxUnits={4} />
      </React.Fragment>
    )
  }

  const dateHasLoaded = endBlockTimeStamp
  return (
    <React.Fragment>
      <VoteStatus vote={vote} />
      {!closed && (
        <div
          css={`
            margin-top: ${1 * GU}px;
            display: inline-grid;
            grid-template-columns: auto auto;
            grid-gap: ${1 * GU}px;
            align-items: center;
            color: ${theme.surfaceContentSecondary};
            ${textStyle('body2')};
          `}
        >
          <IconTime size="small" />{' '}
          {dateHasLoaded ? (
            dateFormat(new Date(endBlockTimeStamp))
          ) : (
            <div
              css={`
                height: 25px;
                width: 150px;
                background: #f9fafc;
                border-radius: 6px;
              `}
            />
          )}
        </div>
      )}
    </React.Fragment>
  )
}

export default DecisionDetail
