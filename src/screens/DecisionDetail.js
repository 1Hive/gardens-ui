import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Bar,
  BackButton,
  Box,
  GU,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import Description from '../components/Description'
import IdentityBadge from '../components/IdentityBadge'
import Loader from '../components/Loader'
import SummaryBar from '../components/DecisionDetail/SummaryBar'
import SummaryRow from '../components/DecisionDetail/SummaryRow'
import VoteCasted from '../components/DecisionDetail/VoteCasted'
// import VoteActions from '../components/DecisionDetail/VoteActions'

import { useWallet } from '../providers/Wallet'
import { useDescribeVote } from '../hooks/useDescribeVote'
import { useAppState } from '../providers/AppState'

import { addressesEqualNoSum as addressesEqual } from '../lib/web3-utils'
import { safeDiv } from '../lib/math-utils'
import { getConnectedAccountVote } from '../lib/vote-utils'

import { VOTE_NAY, VOTE_YEA } from '../constants'

function DecisionDetail({ proposal, actions }) {
  // const theme = useTheme()
  const history = useHistory()
  const { layoutName } = useLayout()
  const { account: connectedAccount } = useWallet()

  // const oneColumn = layoutName === 'small' || layoutName === 'medium'
  const {
    description,
    // emptyScript,
    loading: descriptionLoading,
  } = useDescribeVote(proposal?.script, proposal?.id)

  const connectedAccountVote = getConnectedAccountVote(
    proposal,
    connectedAccount
  )

  const youVoted =
    connectedAccountVote === VOTE_YEA || connectedAccountVote === VOTE_NAY

  const { number, creator } = proposal || {}

  const handleBack = useCallback(() => {
    history.push('/home')
  }, [history])

  // const handleVoteNo = useCallback(() => {
  //   actions.voteOnDecision(proposal.number, VOTE_NAY)
  // }, [actions, proposal.number])

  // const handleVoteYes = useCallback(() => {
  //   actions.voteOnDecision(proposal.number, VOTE_YEA)
  // }, [actions, proposal.number])

  // const handleExecute = useCallback(() => {
  //   actions.executeDecision(proposal.number)
  // }, [actions, proposal.number])

  if (descriptionLoading) {
    return <Loader />
  }

  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
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
                  value={<Description path={description} />}
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
            <SummaryInfo vote={proposal} />
            {youVoted && <VoteCasted vote={proposal} />}
            {/* <VoteActions
              onExecute={handleExecute}
              onVoteNo={handleVoteNo}
              onVoteYes={handleVoteYes}
              vote={proposal}
            /> */}
          </Box>
        }
        secondary={<div />}
      />
    </div>
  )
}

function DataField({ label, value }) {
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

      <div
        css={`
          ${textStyle('body2')};
        `}
      >
        {value}
      </div>
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

      {/* <StatusInfo vote={vote} /> */}
    </div>
  )
}

export default DecisionDetail
