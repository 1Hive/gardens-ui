import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  Button,
  GU,
  Help,
  Link,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

// Components
import ActionCollateral from '../ActionCollateral'
import Balance from '../Balance'
import ChallengeProposalScreens from '../ModalFlows/ChallengeProposalScreens/ChallengeProposalScreens'
import { ConvictionBar } from '../ConvictionVisuals'
import DisputableActionInfo from '../DisputableActionInfo'
import DisputableInfo from '../DisputableInfo'
import DisputeFees from '../DisputeFees'
import IdentityBadge from '@components/IdentityBadge'
import MultiModal from '@components/MultiModal/MultiModal'
import ProposalActions from './ProposalActions'
import ProposalHeader from './ProposalHeader'
import ProposalStatus, { getStatusAttributes } from './ProposalStatus'
import RaiseDisputeScreens from '../ModalFlows/RaiseDisputeScreens/RaiseDisputeScreens'
import ExecuteProposalScreens from '../ModalFlows/ExecuteProposalScreens/ExecuteProposalScreens'
import RemoveProposalScreens from '../ModalFlows/RemoveProposalScreens/RemoveProposalScreens'
import SettleProposalScreens from '../ModalFlows/SettleProposalScreens/SettleProposalScreens'
import SupportersDistribution from '../SupportersDistribution'
import SupportProposalScreens from '../ModalFlows/SupportProposal/SupportProposalScreens'

// Hooks
import { useWallet } from '@providers/Wallet'

// utils
import BigNumber from '@lib/bigNumber'
import { formatTokenAmount } from '@utils/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '@utils/web3-utils'
import { ProposalTypes } from '@/types'
import { ZERO_ADDR } from '@/constants'

const CANCEL_ROLE_HASH = soliditySha3('CANCEL_PROPOSAL_ROLE')

function ProposalDetail({
  commonPool,
  proposal,
  actions,
  permissions,
  requestToken,
  stableToken,
}) {
  const theme = useTheme()
  const history = useHistory()
  const { layoutName } = useLayout()
  const oneColumn = layoutName === 'small' || layoutName === 'medium'
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState(null)

  const { account: connectedAccount } = useWallet()

  const {
    name,
    creator,
    beneficiary,
    link,
    requestedAmount,
    requestedAmountConverted,
    stable,
    stakes = [],
    statusData,
    totalTokensStaked,
  } = proposal || {}

  const { background, borderColor } = getStatusAttributes(proposal, theme)

  const handleBack = useCallback(() => {
    history.goBack()
  }, [history])

  const handleResolveAction = useCallback(() => {
    actions.resolveAction(proposal.disputeId)
  }, [actions, proposal])

  const handleShowModal = useCallback(mode => {
    setModalVisible(true)
    setModalMode(mode)
  }, [])

  const hasCancelRole = useMemo(() => {
    if (!connectedAccount) {
      return false
    }

    if (addressesEqual(creator, connectedAccount)) {
      return true
    }

    return permissions.find(
      ({ roleHash, granteeAddress }) =>
        roleHash === CANCEL_ROLE_HASH &&
        addressesEqual(granteeAddress, connectedAccount)
    )
  }, [connectedAccount, creator, permissions])

  const filteredStakes = useMemo(
    () =>
      stakes.filter(({ amount }) => {
        return amount.gt(new BigNumber(0))
      }),
    [stakes]
  )

  const fundingProposal =
    requestToken && proposal.type === ProposalTypes.Proposal

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
                    {name}
                  </h1>
                  <div
                    css={`
                      margin-top: ${2 * GU}px;
                      grid-column: span 2;
                      min-width: ${40 * GU}px;
                      color: ${theme.contentSecondary};
                    `}
                  >
                    {fundingProposal ? (
                      <span>
                        This proposal is requesting{' '}
                        <strong>
                          {formatTokenAmount(
                            requestedAmountConverted,
                            requestToken.decimals
                          )}
                        </strong>{' '}
                        {requestToken.symbol} out of{' '}
                        <strong>
                          {formatTokenAmount(commonPool, requestToken.decimals)}
                        </strong>{' '}
                        {requestToken.symbol} currently in the common pool.
                      </span>
                    ) : (
                      <span>
                        This suggestion is for signaling purposes and is not
                        requesting any {requestToken.symbol}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  css={`
                    display: grid;
                    grid-template-columns: ${layoutName !== 'small'
                      ? 'auto auto auto'
                      : 'auto'};
                    grid-gap: ${layoutName !== 'small' ? 5 * GU : 2.5 * GU}px;
                  `}
                >
                  <DataField
                    label="Forum"
                    value={
                      link ? (
                        <Link href={link} external>
                          Read the full proposal
                        </Link>
                      ) : (
                        <span
                          css={`
                            ${textStyle('body2')};
                          `}
                        >
                          No link provided
                        </span>
                      )
                    }
                    css="grid-column-start: span 2;"
                  />
                  <DataField
                    label="Status"
                    value={<ProposalStatus proposal={proposal} />}
                  />
                  {fundingProposal && (
                    <Amount
                      requestedAmount={requestedAmount}
                      requestedAmountConverted={requestedAmountConverted}
                      requestToken={requestToken}
                      stable={stable}
                      stableToken={stableToken}
                    />
                  )}

                  {fundingProposal && (
                    <DataField
                      label="Beneficiary"
                      value={
                        <IdentityBadge
                          connectedAccount={addressesEqual(
                            beneficiary,
                            connectedAccount
                          )}
                          entity={beneficiary}
                        />
                      }
                    />
                  )}
                  <DataField
                    label="Created By"
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
                  {proposal.number !== '1' && (
                    <>
                      <DataField
                        label="Deposit Amount"
                        value={<ActionCollateral proposal={proposal} />}
                      />
                      {proposal.pausedAt > 0 && (
                        <DisputeFees proposal={proposal} />
                      )}
                    </>
                  )}
                </div>
                {(statusData.open ||
                  statusData.challenged ||
                  statusData.disputed) && (
                  <DataField
                    label="Progress"
                    value={
                      <ConvictionBar
                        proposal={proposal}
                        withThreshold={!!requestToken}
                      />
                    }
                  />
                )}
                <DisputableInfo proposal={proposal} />
                <ProposalActions
                  proposal={proposal}
                  onChangeSupport={() => handleShowModal('update')}
                  onExecuteProposal={() => handleShowModal('execute')}
                  onRequestSupportProposal={() => handleShowModal('support')}
                />
              </section>
            </Box>
          }
          secondary={
            <div>
              {proposal.creator !== ZERO_ADDR && (
                <DisputableActionInfo
                  proposal={proposal}
                  onChallengeAction={() => handleShowModal('challenge')}
                  onDisputeAction={() => handleShowModal('dispute')}
                  onResolveAction={handleResolveAction}
                  onSettleAction={() => handleShowModal('settle')}
                />
              )}
              {statusData.open && (
                <>
                  {hasCancelRole && (
                    <Box padding={3 * GU}>
                      <span
                        css={`
                          color: ${theme.contentSecondary};
                        `}
                      >
                        As the original author, you can remove this proposal
                        from consideration
                      </span>
                      <Button
                        onClick={() => handleShowModal('remove')}
                        wide
                        css={`
                          margin-top: ${3 * GU}px;
                        `}
                      >
                        Remove proposal
                      </Button>
                    </Box>
                  )}
                  {!fundingProposal && proposal.number !== '1' && (
                    <Box
                      padding={3 * GU}
                      css={`
                        color: ${theme.contentSecondary};
                      `}
                    >
                      This suggestion will be active until it is removed by the
                      creator or an authorised entity.
                    </Box>
                  )}
                </>
              )}

              <SupportersDistribution
                stakes={filteredStakes}
                totalTokensStaked={totalTokensStaked}
              />
            </div>
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
              approveTokenAmount: actions.approveTokenAmount,
            }}
            proposal={proposal}
          />
        )}
        {modalMode === 'settle' && (
          <SettleProposalScreens proposal={proposal} />
        )}
        {modalMode === 'dispute' && <RaiseDisputeScreens proposal={proposal} />}
        {(modalMode === 'support' || modalMode === 'update') && (
          <SupportProposalScreens proposal={proposal} mode={modalMode} />
        )}
        {modalMode === 'remove' && (
          <RemoveProposalScreens proposal={proposal} />
        )}
        {modalMode === 'execute' && (
          <ExecuteProposalScreens proposal={proposal} />
        )}
      </MultiModal>
    </div>
  )
}

function DataField({ label, value, ...props }) {
  const theme = useTheme()

  return (
    <div {...props}>
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

const Amount = ({
  requestedAmount,
  requestedAmountConverted,
  requestToken,
  stable,
  stableToken,
}) => {
  const theme = useTheme()
  const primaryToken = stable ? stableToken : requestToken

  return (
    <DataField
      label="Request Amount"
      value={
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <Balance
            amount={requestedAmount}
            decimals={primaryToken.decimals}
            symbol={primaryToken.symbol}
            icon={primaryToken.icon}
          />
          {stable && (
            <div
              css={`
                display: flex;
                align-items: center;
                color: ${theme.contentSecondary};
                margin-left: ${0.5 * GU}px;
              `}
            >
              <span>≈</span>
              <span
                css={`
                  margin: 0px ${0.5 * GU}px;
                `}
              >
                {formatTokenAmount(
                  requestedAmountConverted,
                  requestToken.decimals
                )}{' '}
                {requestToken.symbol}
              </span>
              <Help hint="">
                Converted to {requestToken.symbol} at time of execution
              </Help>
            </div>
          )}
        </div>
      }
    />
  )
}

export default ProposalDetail
