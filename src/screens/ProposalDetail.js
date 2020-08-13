import React, { useCallback, useMemo } from 'react'
import {
  BackButton,
  Bar,
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
import Balance from '../components/Balance'
import {
  ConvictionCountdown,
  ConvictionBar,
} from '../components/ConvictionVisuals'
import IdentityBadge from '../components/IdentityBadge'
import ProposalActions from '../components/ProposalActions'
import SupportProposal from '../components/panels/SupportProposal'

import { useAppState } from '../providers/AppState'
import usePanelState from '../hooks/usePanelState'
import { useWallet } from '../providers/Wallet'

import { getTokenIconBySymbol, formatTokenAmount } from '../lib/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '../lib/web3-utils'

import {
  PROPOSAL_STATUS_ACTIVE,
  PROPOSAL_STATUS_CANCELLED,
  PROPOSAL_STATUS_EXECUTED,
} from '../constants'

const CANCEL_ROLE_HASH = soliditySha3('CANCEL_PROPOSAL_ROLE')

function ProposalDetail({
  proposal,
  onBack,
  onCancelProposal,
  onExecuteProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
  requestToken,
}) {
  const { layoutName } = useLayout()

  const theme = useTheme()
  const panelState = usePanelState()
  const { vaultBalance, permissions } = useAppState()

  const { account: connectedAccount } = useWallet()

  console.log('PROPOSAL!!! ', proposal)

  const {
    id,
    name,
    creator,
    beneficiary,
    link,
    requestedAmount,
    status,
  } = proposal

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

  const handleCancelProposal = useCallback(() => {
    onCancelProposal(id)
  }, [id, onCancelProposal])

  return (
    <div>
      <Bar>
        <BackButton onClick={onBack} />
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
                        margin-top: ${2.5 * GU}px;
                        grid-column: span 2;
                        width: ${50 * GU}px;
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
                {requestToken && (
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
              {status === PROPOSAL_STATUS_ACTIVE && (
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
                    onExecuteProposal={onExecuteProposal}
                    onRequestSupportProposal={panelState.requestOpen}
                    onStakeToProposal={onStakeToProposal}
                    onWithdrawFromProposal={onWithdrawFromProposal}
                  />
                </>
              )}
            </section>
          </Box>
        }
        secondary={
          <div>
            {requestToken && (
              <Box heading="Status" padding={3 * GU}>
                {status === PROPOSAL_STATUS_CANCELLED ? (
                  <Info mode="warning">
                    This proposal was removed from consideration
                  </Info>
                ) : (
                  <ConvictionCountdown proposal={proposal} />
                )}
              </Box>
            )}
            {hasCancelRole && status === PROPOSAL_STATUS_ACTIVE && (
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
          </div>
        }
      />
      <SidePanel
        title="Support this proposal"
        opened={panelState.visible}
        onClose={panelState.requestClose}
      >
        <SupportProposal
          id={id}
          onDone={panelState.requestClose}
          onStakeToProposal={onStakeToProposal}
        />
      </SidePanel>
    </div>
  )
}

const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => {
  const tokenIcon = getTokenIconBySymbol(symbol)
  return (
    <DataField
      label="Request Amount"
      value={
        <Balance
          amount={requestedAmount}
          decimals={decimals}
          symbol={symbol}
          verified={verified}
          icon={tokenIcon}
        />
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
