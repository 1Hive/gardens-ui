import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  Button,
  EthIdenticon,
  GU,
  Help,
  IconDown,
  IconUp,
  Link,
  shortenAddress,
  Split,
  Tag,
  textStyle,
  TransactionBadge,
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
import ExecuteProposalScreens from '../ModalFlows/ExecuteProposalScreens/ExecuteProposalScreens'
import IdentityBadge from '@components/IdentityBadge'
import LoadingRing from '@/components/LoadingRing'
import MultiModal from '@components/MultiModal/MultiModal'
import ProposalActions from './ProposalActions'
import ProposalComments from './ProposalComments'
import ProposalHeader from './ProposalHeader'
import ProposalStatus, {
  ABSTAIN_PROPOSAL,
  getStatusAttributes,
} from './ProposalStatus'
import RaiseDisputeScreens from '../ModalFlows/RaiseDisputeScreens/RaiseDisputeScreens'
import RemoveProposalScreens from '../ModalFlows/RemoveProposalScreens/RemoveProposalScreens'
import SettleProposalScreens from '../ModalFlows/SettleProposalScreens/SettleProposalScreens'
import SupportersDistribution from '../SupportersDistribution'
import SupportProposalScreens from '../ModalFlows/SupportProposal/SupportProposalScreens'

// Hooks
import useChallenge from '@hooks/useChallenge'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useWallet } from '@providers/Wallet'

// utils
import BigNumber from '@lib/bigNumber'
import { formatTokenAmount } from '@utils/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '@utils/web3-utils'
import { getNetwork } from '@/networks'
import { ProposalTypes } from '@/types'
import { ZERO_ADDR } from '@/constants'

// assets
import warningIcon from '../Agreement/assets/warning.svg'
import { AbstainCardHeader } from '../Feed/AbstainCard'
import ProposalDetailPoll from './ProposalDetailPoll'

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

  const { chainId } = useConnectedGarden()
  const { account: connectedAccount } = useWallet()
  const network = getNetwork(chainId)

  const isAbstainProposal = proposal.metadata === ABSTAIN_PROPOSAL
  const isPollProposal = proposal.type === ProposalTypes.Poll

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
    txHash,
  } = proposal || {}

  console.log(proposal)

  const { background, borderColor } = getStatusAttributes(proposal, theme)

  const handleBack = useCallback(() => {
    history.goBack()
  }, [history])

  const handleResolveAction = useCallback(() => {
    actions.resolveAction(proposal.disputeId)
  }, [actions, proposal])

  const handleShowModal = useCallback((mode) => {
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
            <>
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
                    {isAbstainProposal ? (
                      <AbstainCardHeader showHint={false} />
                    ) : (
                      <ProposalHeader proposal={proposal} />
                    )}

                    <h1
                      css={`
                        ${textStyle('title2')};
                      `}
                    >
                      {name}
                    </h1>

                    {!isAbstainProposal ? (
                      <>
                        <div
                          css={`
                            margin-top: ${1 * GU}px;
                          `}
                        >
                          <TransactionBadge
                            transaction={txHash}
                            networkType={network.type}
                            explorerProvider={network.explorer}
                          />
                        </div>

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
                                {formatTokenAmount(
                                  commonPool,
                                  requestToken.decimals
                                )}
                              </strong>{' '}
                              {requestToken.symbol} currently in the common
                              pool.
                            </span>
                          ) : !isPollProposal ? (
                            <span>
                              This suggestion is for signaling purposes and is
                              not requesting any {requestToken.symbol}
                            </span>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div
                        css={`
                          margin-top: ${2 * GU}px;
                          grid-column: span 2;
                          min-width: ${40 * GU}px;
                          color: ${theme.contentSecondary};
                        `}
                      >
                        This is a special kind of suggestion proposal that is
                        always available. It serves the purpose of regulating
                        the community&apos;s expenditure by increasing the
                        amount of support required for all other funding
                        proposals to pass.
                        <br />
                        So if you think that the community is spending money
                        unproductively supporting the abstain proposal, or
                        creating a new signaling proposal that makes the case
                        for how you think the community should actually be
                        allocating resources have a meaningful influence on the
                        behavior of the system.
                      </div>
                    )}
                  </div>

                  {isPollProposal ? (
                    <ProposalDetailPoll proposal={proposal} />
                  ) : null}

                  {!isAbstainProposal && !isPollProposal ? (
                    <div
                      css={`
                        display: grid;
                        grid-template-columns: ${layoutName !== 'small'
                          ? 'auto auto auto'
                          : 'auto'};
                        grid-gap: ${layoutName !== 'small'
                          ? 5 * GU
                          : 2.5 * GU}px;
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
                  ) : null}
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
              {proposal.pausedAt > 0 && (
                <Box
                  padding={2.4 * GU}
                  css={`
                    background: ${background};
                    border-color: ${borderColor};
                  `}
                >
                  <ArgumentBox
                    proposal={proposal}
                    connectedAccount={connectedAccount}
                  />
                </Box>
              )}
            </>
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
        <ProposalComments link={link} />
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

function ArgumentBox({ proposal, connectedAccount }) {
  const theme = useTheme()

  const { challenge } = useChallenge(proposal)
  const [showArgument, setShowArgument] = useState(true)

  return (
    <>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          ${textStyle('body1')};
          color: ${theme.warning};
        `}
      >
        <div
          css={`
            display: grid;
            grid-template-columns: ${5 * GU}px ${35 * GU}px;
            align-items: center;
          `}
        >
          <img src={warningIcon} width={30} height={30} />
          <h1>
            {connectedAccount === proposal.creator ? 'Your' : 'This'} proposal{' '}
            {proposal.statusData.challenged ? 'has been' : 'was'} challenged
          </h1>
        </div>
        <div
          onClick={() => setShowArgument(!showArgument)}
          css={`
            display: flex;
            align-items: center;
            :hover {
              cursor: pointer;
              text-decoration: underline;
            }
          `}
        >
          <h1
            css={`
              width: ${18 * GU}px;
            `}
          >
            {showArgument ? 'Hide' : 'Show'} arguments
          </h1>
          {showArgument ? <IconUp /> : <IconDown />}
        </div>
      </div>
      {showArgument &&
        (challenge?.challenger ? (
          <div
            css={`
              display: flex;
              justify-content: flex-start;
              margin: ${4.5 * GU}px ${4.5 * GU}px 0 0;
            `}
          >
            <div
              css={`
                width: ${5 * GU}px;
                margin-right: ${5 * GU}px;
              `}
            >
              {challenge.challenger.image ? (
                <img
                  src={challenge.challenger.image}
                  height={43}
                  width={43}
                  css={`
                    border-radius: 50%;
                  `}
                />
              ) : (
                <EthIdenticon
                  address={challenge.challenger.address}
                  radius={50}
                  scale={1.8}
                />
              )}
            </div>
            <div
              css={`
                flex-direction: column;
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: flex-start;
                  width: ${30 * GU}px;
                `}
              >
                <h2
                  css={`
                    font-weight: 600;
                    margin-right: ${1 * GU}px;
                  `}
                >
                  {challenge.challenger.name
                    ? challenge.challenger.name
                    : shortenAddress(challenge.challenger.address)}
                </h2>
                <Tag
                  background={theme.warningSurface.toString()}
                  color={theme.warningSurfaceContent.toString()}
                >
                  challenger
                </Tag>
              </div>
              <div
                css={`
                  margin-top: ${1.5 * GU}px;
                  color: ${theme.contentSecondary};
                `}
              >
                {challenge.context}
              </div>
            </div>
          </div>
        ) : (
          <LoadingRing />
        ))}
    </>
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
                Converted to {requestToken.symbol} at time of execution. For
                funding proposals denominated in {stableToken.symbol} to be made
                successfully, this Garden&apos;s{' '}
                <Link href="https://1hive.gitbook.io/gardens/garden-creators/price-oracle">
                  price oracle
                </Link>{' '}
                must be called consistently. Contact your Garden administrator
                or development team if the proposal execution transaction is
                continually failing or if the request stable amount is not
                accurate.
              </Help>
            </div>
          )}
        </div>
      }
    />
  )
}

export default ProposalDetail
