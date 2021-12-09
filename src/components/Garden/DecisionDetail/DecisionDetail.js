import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  BackButton,
  Box,
  GU,
  LoadingRing,
  Split,
  textStyle,
  TransactionBadge,
  useLayout,
  useTheme,
} from "@1hive/1hive-ui";

import ActionCollateral from "../ActionCollateral";
import ChallengeProposalScreens from "../ModalFlows/ChallengeProposalScreens/ChallengeProposalScreens";
import Description from "../Description";
import DisputableActionInfo from "../DisputableActionInfo";
import DisputableInfo from "../DisputableInfo";
import DisputeFees from "../DisputeFees";
import IdentityBadge from "@components/IdentityBadge";
import MultiModal from "@components/MultiModal/MultiModal";
import ProposalHeader from "../ProposalDetail/ProposalHeader";
import RaiseDisputeScreens from "../ModalFlows/RaiseDisputeScreens/RaiseDisputeScreens";
import SettleProposalScreens from "../ModalFlows/SettleProposalScreens/SettleProposalScreens";
import SummaryBar from "./SummaryBar";
import SummaryRow from "./SummaryRow";
import VoteActions from "./VoteActions";
import VoteCasted from "./VoteCasted";
import VoteOnDecisionScreens from "../ModalFlows/VoteOnDecisionScreens/VoteOnDecisionScreens";
import VoteStatus, { getStatusAttributes } from "./VoteStatus";

import { useDescribeVote } from "@hooks/useDescribeVote";
import { useGardenState } from "@providers/GardenState";
import { useWallet } from "@providers/Wallet";

import { addressesEqualNoSum as addressesEqual } from "@utils/web3-utils";
import { round, safeDiv } from "@utils/math-utils";
import { getConnectedAccountCast, getQuorumProgress } from "@utils/vote-utils";
import { getNetwork } from "@/networks";

import { PCT_BASE, VOTE_NAY, VOTE_YEA } from "@/constants";
import { css, jsx } from "@emotion/react";
import styled from "styled-components";

function DecisionDetail({ proposal, actions }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ mode: "" });
  const theme = useTheme();
  const history = useHistory();
  const { layoutName } = useLayout();
  const { account: connectedAccount } = useWallet();
  const {
    config: { voting: votingConfig },
  } = useGardenState();

  const {
    description,
    emptyScript,
    loading: descriptionLoading,
  } = useDescribeVote(proposal.script, proposal.id);

  const network = getNetwork();

  const oneColumn = layoutName === "small" || layoutName === "medium";
  const connectedAccountCast = getConnectedAccountCast(
    proposal,
    connectedAccount
  );

  const { background, borderColor } = getStatusAttributes(proposal, theme);

  const youVoted =
    connectedAccountCast.vote === VOTE_YEA ||
    connectedAccountCast.vote === VOTE_NAY;

  const { creator, minAcceptQuorum, nay, number, statusData, yea } =
    proposal || {};

  const totalVotes = parseFloat(yea) + parseFloat(nay);
  const yeasPct = safeDiv(parseFloat(yea), totalVotes);

  const quorumProgress = getQuorumProgress(proposal);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleVote = useCallback((data) => {
    setModalVisible(true);
    setModalData({ mode: "vote", ...data });
  }, []);

  const handleExecute = useCallback(() => {
    actions.executeDecision(proposal.number, proposal.script);
  }, [actions, proposal.number, proposal.script]);

  const handleResolveAction = useCallback(() => {
    actions.resolveAction(proposal.disputeId);
  }, [actions, proposal]);

  const handleShowModal = useCallback((mode) => {
    setModalVisible(true);
    setModalData({ mode });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleModalClosed = useCallback(() => {
    setModalData({ mode: "" });
  }, []);

  return (
    <div
      css={css`
        margin-top: ${3 * GU}px;
      `}
    >
      <BackButton
        onClick={handleBack}
        css={css`
          background: ${theme.background.toString()};
          margin-bottom: ${2 * GU}px;
          border: 0;
        `}
      />
      <div
        css={css`
          > div > div:nth-child(2) {
            width: ${oneColumn ? "100%" : `${40 * GU}px`};
          }
        `}
      >
        <Split
          primary={
            <Box
              css={css`
                background: ${background};
                border-color: ${borderColor};
              `}
            >
              <section
                css={css`
                  display: grid;
                  grid-template-rows: auto;
                  grid-row-gap: ${7 * GU}px;
                `}
              >
                <div>
                  <ProposalHeader proposal={proposal} />
                  <h1
                    css={css`
                      ${textStyle("title2")};
                    `}
                  >
                    {`Vote #${number}`}
                  </h1>
                  <div
                    css={css`
                      margin-top: ${1 * GU}px;
                    `}
                  >
                    <TransactionBadge
                      transaction={proposal.txHash}
                      networkType={network.type}
                      explorerProvider={network.explorer}
                    />
                  </div>
                </div>
                <div
                  css={css`
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
                          proposal.metadata || "No description"
                        ) : (
                          <div>
                            {proposal.metadata && (
                              <div>
                                <div
                                  css={css`
                                    margin-bottom: ${1 * GU}px;
                                  `}
                                >
                                  {proposal.metadata}
                                </div>
                                <b>Actions</b>
                              </div>
                            )}
                            <Description path={description} />
                          </div>
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
                      label="Deposit Amount"
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
                css={css`
                  margin-top: ${6 * GU}px;
                  margin-bottom: ${4 * GU}px;
                `}
              >
                <SummaryInfo vote={proposal} />
                {youVoted && (
                  <VoteCasted
                    account={connectedAccount}
                    accountVote={connectedAccountCast.vote}
                    caster={connectedAccountCast.caster}
                    vote={proposal}
                  />
                )}
              </div>
              <DisputableInfo proposal={proposal} />
              {(statusData.open || statusData.pendingExecution) && (
                <VoteActions
                  onExecute={handleExecute}
                  onVote={handleVote}
                  vote={proposal}
                />
              )}
            </Box>
          }
          secondary={
            <>
              <DisputableActionInfo
                proposal={proposal}
                onChallengeAction={() => handleShowModal("challenge")}
                onDisputeAction={() => handleShowModal("dispute")}
                onResolveAction={handleResolveAction}
                onSettleAction={() => handleShowModal("settle")}
              />

              <Box heading="Relative support %">
                <div
                  css={css`
                    ${textStyle("body2")};
                  `}
                >
                  {round(yeasPct * 100, 2)}%{" "}
                  <span
                    css={css`
                      color: ${theme.surfaceContentSecondary.toString()};
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
                  css={css`
                    margin-top: ${2 * GU}px;
                  `}
                />
              </Box>
              <Box heading="Minimum approval %">
                <div
                  css={css`
                    ${textStyle("body2")};
                  `}
                >
                  {round(quorumProgress * 100, 2)}%{" "}
                  <span
                    css={css`
                      color: ${theme.surfaceContentSecondary.toString()};
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
                  css={css`
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
        onClose={handleCloseModal}
        onClosed={handleModalClosed}
      >
        {modalData.mode === "challenge" && (
          <ChallengeProposalScreens
            agreementActions={{
              challengeAction: actions.challengeAction,
              getAllowance: actions.getAllowance,
              approveTokenAmount: actions.approveTokenAmount,
            }}
            proposal={proposal}
          />
        )}
        {modalData.mode === "settle" && (
          <SettleProposalScreens proposal={proposal} />
        )}
        {modalData.mode === "dispute" && (
          <RaiseDisputeScreens proposal={proposal} />
        )}
        {modalData.mode === "vote" && (
          <VoteOnDecisionScreens proposal={proposal} {...modalData} />
        )}
      </MultiModal>
    </div>
  );
}

function DataField({ label, value, loading = false }) {
  const theme = useTheme();

  return (
    <div>
      <h2
        css={css`
          ${textStyle("label1")};
          font-weight: 200;
          color: ${theme.surfaceContentSecondary.toString()};
          margin-bottom: ${2 * GU}px;
        `}
      >
        {label}
      </h2>

      {loading ? (
        <LoadingRing />
      ) : (
        <div
          css={css`
            ${textStyle("body2")};
          `}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function SummaryInfo({ vote }) {
  const { config } = useGardenState();
  const { token } = config.voting;
  const theme = useTheme();
  const { minAcceptQuorum, nay, yea } = vote;

  const totalVotes = parseFloat(yea) + parseFloat(nay);
  const yeasPct = safeDiv(parseFloat(yea), totalVotes);
  const naysPct = safeDiv(parseFloat(nay), totalVotes);

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
              css={css`
                margin-bottom: ${2 * GU}px;
              `}
            />
            <div
              css={css`
                display: inline-block;
              `}
            >
              <SummaryRow
                color={theme.positive.toString()}
                label="Yes"
                pct={Math.floor(yeasPct * 100)}
                token={{
                  amount: yea,
                  symbol: token.symbol,
                  decimals: token.decimals,
                }}
              />
              <SummaryRow
                color={theme.negative.toString()}
                label="No"
                pct={Math.floor(naysPct * 100)}
                token={{
                  amount: nay,
                  symbol: token.symbol,
                  decimals: token.decimals,
                }}
              />
            </div>
          </>
        }
      />
    </div>
  );
}

const Row = styled.div`
  display: grid;

  ${({ compactMode = false, cols = 2 }) => `
    grid-gap: ${(compactMode ? 2.5 : 5) * GU}px;
    grid-template-columns: ${compactMode ? "auto" : `repeat(${cols}, 1fr)`};
  `}
`;

export default DecisionDetail;
