import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Box,
  Button,
  GU,
  Info,
  Link,
  SidePanel,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'

// Components
import Balance from '../components/Balance'
import {
  ConvictionCountdown,
  ConvictionBar,
} from '../components/ConvictionVisuals'
import IdentityBadge from '../components/IdentityBadge'
import Loader from '../components/Loader'
import ProposalActions from '../components/ProposalDetail/ProposalActions'
import SupportersDistribution from '../components/SupportersDistribution'
import SupportProposalPanel from '../components/panels/SupportProposalPanel'

// Hooks
import useProposalLogic from '../logic/proposal-logic'
import { useWallet } from '../providers/Wallet'

// utils
import BigNumber from '../lib/bigNumber'
import { getTokenIconBySymbol, formatTokenAmount } from '../utils/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '../utils/web3-utils'
import {
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_CANCELLED_STRING,
  ZERO_ADDR,
} from '../constants'
import signalingBadge from '../assets/signalingBadge.svg'

const CANCEL_ROLE_HASH = soliditySha3('CANCEL_PROPOSAL_ROLE')

function ProposalDetail({ match }) {
  const {
    actions: { convictionActions },
    isLoading,
    panelState,
    permissions,
    proposal,
    requestToken,
    vaultBalance,
  } = useProposalLogic(match)

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
    status,
  } = proposal || {}

  const handleBack = useCallback(() => {
    history.push('/home')
  }, [history])

  const handleCancelProposal = useCallback(() => {
    convictionActions.cancelProposal(id)
  }, [id, convictionActions])

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

  if (isLoading || !proposal) {
    return <Loader />
  }

  const signalingProposal = addressesEqual(beneficiary, ZERO_ADDR)

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
                  {name}
                </h1>
                <div
                  css={`
                    display: grid;
                    grid-template-columns: ${layoutName !== 'small'
                      ? 'auto auto auto'
                      : 'auto'};
                    grid-gap: ${layoutName !== 'small' ? 5 * GU : 2.5 * GU}px;
                  `}
                >
                  {requestToken && (
                    <>
                      <Amount
                        requestedAmount={requestedAmount}
                        requestToken={requestToken}
                      />
                      <div
                        css={`
                          margin-top: ${2 * GU}px;
                          grid-column: span 2;
                          min-width: ${40 * GU}px;
                          color: ${theme.contentSecondary};
                        `}
                      >
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
                      </div>
                    </>
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
                  {requestToken && !signalingProposal && (
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
                </div>
                {status === PROPOSAL_STATUS_ACTIVE_STRING && (
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
                  </>
                )}
                <ProposalActions
                  proposal={proposal}
                  onExecuteProposal={convictionActions.executeProposal}
                  onRequestSupportProposal={panelState.requestOpen}
                  onStakeToProposal={convictionActions.stakeToProposal}
                  onWithdrawFromProposal={
                    convictionActions.withdrawFromProposal
                  }
                />
              </section>
            </Box>
          }
          secondary={
            <div>
              {!signalingProposal && requestToken && (
                <Box heading="Status" padding={3 * GU}>
                  {status === PROPOSAL_STATUS_CANCELLED_STRING ? (
                    <Info mode="warning">
                      This proposal was removed from consideration
                    </Info>
                  ) : (
                    <ConvictionCountdown proposal={proposal} />
                  )}
                </Box>
              )}
              {hasCancelRole && status === PROPOSAL_STATUS_ACTIVE_STRING && (
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

              <SupportersDistribution
                stakes={filteredStakes}
                totalTokensStaked={totalTokensStaked}
              />
            </div>
          }
        />
      </div>
      <SidePanel
        title="Support this proposal"
        opened={panelState.visible}
        onClose={panelState.requestClose}
      >
        <SupportProposalPanel
          id={id}
          onDone={panelState.requestClose}
          onStakeToProposal={convictionActions.stakeToProposal}
        />
      </SidePanel>
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
