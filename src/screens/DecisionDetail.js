import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  BackButton,
  Box,
  GU,
  LoadingRing,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

import ActionCollateral from '../components/ActionCollateral'
import ChallengeProposalScreens from '../components/ModalFlows/ChallengeProposalScreens/ChallengeProposalScreens'
import Description from '../components/Description'
import DisputableActionInfo from '../components/DisputableActionInfo'
import DisputableInfo from '../components/DisputableInfo'
import DisputeFees from '../components/DisputeFees'
import IdentityBadge from '../components/IdentityBadge'
import MultiModal from '../components/MultiModal/MultiModal'
import ProposalHeader from '../components/ProposalDetail/ProposalHeader'
import RaiseDisputeScreens from '../components/ModalFlows/RaiseDisputeScreens/RaiseDisputeScreens'
import SettleProposalScreens from '../components/ModalFlows/SettleProposalScreens/SettleProposalScreens'
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
import { round, safeDiv } from '../utils/math-utils'
import { getConnectedAccountVote, getQuorumProgress } from '../utils/vote-utils'

import { PCT_BASE, VOTE_NAY, VOTE_YEA } from '../constants'

function DecisionDetail({ proposal, actions }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState(null)
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

  const handleResolveAction = useCallback(() => {
    actions.resolveAction(proposal.disputeId)
  }, [actions, proposal])

  const handleShowModal = useCallback(mode => {
    setModalVisible(true)
    setModalMode(mode)
  }, [])

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
                <div>
                  <ProposalHeader proposal={proposal} />
                  <h1
                    css={`
                      ${textStyle('title2')};
                    `}
                  >
                    {`Vote #${number}`}
                  </h1>
                </div>
                <div
                  css={`
                    display: grid;
                    grid-template-columns: auto;
                    grid-gap: ${5 * GU}px;
                  `}
                >
                  <Row
                    compactMode={oneColumn}
                    cols={proposal.pausedAt > 0 ? 3 : 2}
                  >
                    <DataField
                      label="Description"
                      value={
                        emptyScript ? (
                          proposal.metadata || 'No description'
                        ) : (
                          <Description path={description} />
                        )
                      }
                      loading={descriptionLoading}
                    />
                    {proposal.pausedAt > 0 && <div />}
                    <DataField
                      label="Status"
                      value={<VoteStatus vote={proposal} />}
                    />
                  </Row>
                  <Row
                    compactMode={oneColumn}
                    cols={proposal.pausedAt > 0 ? 3 : 2}
                  >
                    <DataField
                      label="Action collateral"
                      value={<ActionCollateral proposal={proposal} />}
                    />
                    {proposal.pausedAt > 0 && (
                      <DisputeFees proposal={proposal} />
                    )}
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
                  </Row>
                </div>
              </section>
              <div
                css={`
                  margin-top: ${6 * GU}px;
                  margin-bottom: ${4 * GU}px;
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
              <DisputableInfo proposal={proposal} />
              {proposal.statusData.open && (
                <VoteActions
                  onExecute={handleExecute}
                  onVoteNo={handleVoteNo}
                  onVoteYes={handleVoteYes}
                  vote={proposal}
                />
              )}
            </Box>
          }
          secondary={
            <>
              <DisputableActionInfo
                proposal={proposal}
                onChallengeAction={() => handleShowModal('challenge')}
                onDisputeAction={() => handleShowModal('dispute')}
                onResolveAction={handleResolveAction}
                onSettleAction={() => handleShowModal('settle')}
              />

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
      <MultiModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClosed={() => setModalMode(null)}
      >
        {modalMode === 'challenge' && (
          <ChallengeProposalScreens
            agreementActions={{
              challengeAction: actions.challengeAction,
              getAllowance: actions.getAllowance,
              approveChallengeTokenAmount: actions.approveChallengeTokenAmount,
            }}
            proposal={proposal}
          />
        )}
        {modalMode === 'settle' && (
          <SettleProposalScreens proposal={proposal} />
        )}
        {modalMode === 'dispute' && <RaiseDisputeScreens proposal={proposal} />}
      </MultiModal>
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

const Row = styled.div`
  display: grid;

  ${({ compactMode = false, cols = 2 }) => `
    grid-gap: ${(compactMode ? 2.5 : 5) * GU}px;
    grid-template-columns: ${compactMode ? 'auto' : `repeat(${cols}, 1fr)`};
  `}
`

export default DecisionDetail
