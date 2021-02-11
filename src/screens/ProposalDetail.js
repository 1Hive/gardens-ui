import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  Button,
  GU,
  // Info,
  Link,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

// Components
import Balance from '../components/Balance'
import {
  // ConvictionCountdown,
  ConvictionBar,
} from '../components/ConvictionVisuals'
import IdentityBadge from '../components/IdentityBadge'
import ProposalActions from '../components/ProposalDetail/ProposalActions'
import ProposalIcon from '../components/ProposalIcon'
import ProposalStatus, {
  getStatusAttributes,
} from '../components/ProposalDetail/ProposalStatus'
import SupportersDistribution from '../components/SupportersDistribution'

// Hooks
import { useWallet } from '../providers/Wallet'

// utils
import BigNumber from '../lib/bigNumber'
import { getTokenIconBySymbol, formatTokenAmount } from '../utils/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '../utils/web3-utils'
import { convertToString, ProposalTypes } from '../types'
import signalingBadge from '../assets/signalingBadge.svg'

const CANCEL_ROLE_HASH = soliditySha3('CANCEL_PROPOSAL_ROLE')

function ProposalDetail({
  proposal,
  actions,
  permissions,
  requestToken,
  vaultBalance,
}) {
  const theme = useTheme()
  const history = useHistory()
  const { layoutName } = useLayout()
  const oneColumn = layoutName === 'small' || layoutName === 'medium'

  const { account: connectedAccount } = useWallet()

  const {
    id,
    name,
    creator,
    beneficiary,
    link,
    requestedAmount,
    stakes = [],
    totalTokensStaked,
    statusData,
  } = proposal || {}

  const { background, borderColor } = getStatusAttributes(proposal, theme)

  const handleBack = useCallback(() => {
    history.push('/home')
  }, [history])

  const handleCancelProposal = useCallback(() => {
    actions.cancelProposal(id)
  }, [id, actions])

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
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      margin-bottom: ${2 * GU}px;
                    `}
                  >
                    <ProposalIcon type={proposal.type} />
                    <span
                      css={`
                        margin-left: ${0.5 * GU}px;
                      `}
                    >
                      {convertToString(proposal.type)}
                    </span>
                  </div>
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
                            requestedAmount,
                            requestToken.decimals
                          )}
                        </strong>{' '}
                        {requestToken.name} out of{' '}
                        <strong>
                          {formatTokenAmount(
                            vaultBalance,
                            requestToken.decimals
                          )}
                        </strong>{' '}
                        {requestToken.name} currently in the common pool.
                      </span>
                    ) : (
                      <span>
                        This suggestion is for signaling purposes and is not
                        requesting any Honey
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
                  {fundingProposal && (
                    <Amount
                      requestedAmount={requestedAmount}
                      requestToken={requestToken}
                    />
                  )}
                  <DataField
                    label="Link"
                    value={
                      link ? (
                        <Link href={link} external>
                          Read more
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
                  />
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
                  <DataField
                    label="Status"
                    value={<ProposalStatus proposal={proposal} />}
                  />
                </div>
                {(statusData.open ||
                  statusData.challenged ||
                  statusData.disputed) && (
                  <>
                    <DataField
                      label="Progress"
                      value={
                        <ConvictionBar
                          proposal={proposal}
                          withThreshold={!!requestToken}
                        />
                      }
                    />
                    <ProposalActions
                      proposal={proposal}
                      onExecuteProposal={actions.executeProposal}
                      // onRequestSupportProposal={panelState.requestOpen}
                      onStakeToProposal={actions.stakeToProposal}
                      onWithdrawFromProposal={actions.withdrawFromProposal}
                    />
                  </>
                )}
              </section>
            </Box>
          }
          secondary={
            <div>
              {/* TODO: */}
              {/* {fundingProposal && (
                <Box heading="Status" padding={3 * GU}>
                  {statusData.cancelled ? (
                    <Info mode="warning">
                      This proposal was removed from consideration
                    </Info>
                  ) : (
                    <ConvictionCountdown proposal={proposal} />
                  )}
                </Box>
              )} */}
              {statusData.open && (
                <>
                  {hasCancelRole && (
                    <Box padding={3 * GU}>
                      <span
                        css={`
                          color: ${theme.contentSecondary};
                        `}
                      >
                        You can remove this proposal from consideration
                      </span>
                      <Button
                        onClick={handleCancelProposal}
                        wide
                        css={`
                          margin-top: ${3 * GU}px;
                        `}
                      >
                        Remove proposal
                      </Button>
                    </Box>
                  )}
                  {!fundingProposal && (
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
      {/* <SidePanel
        title="Support this proposal"
        opened={panelState.visible}
        onClose={panelState.requestClose}
      >
        <SupportProposalPanel
          id={id}
          onDone={panelState.requestClose}
          onStakeToProposal={convictionActions.stakeToProposal}
        />
      </SidePanel> */}
    </div>
  )
}

const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => {
  const signalingProposal = requestedAmount.eq(0)
  const tokenIcon = getTokenIconBySymbol(symbol)
  return (
    <DataField
      label={!signalingProposal && 'Request Amount'}
      value={
        signalingProposal ? (
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <img src={signalingBadge} alt="" height="24" width="24" />
            <span
              css={`
                margin-left: ${1 * GU}px;
                ${textStyle('body2')};
                font-weight: 300;
              `}
            >
              Signaling proposal
            </span>
          </div>
        ) : (
          <Balance
            amount={requestedAmount}
            decimals={decimals}
            symbol={symbol}
            verified={verified}
            icon={tokenIcon}
          />
        )
      }
    />
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

export default ProposalDetail
