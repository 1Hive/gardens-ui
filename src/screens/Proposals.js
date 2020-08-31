import React, { useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  DataView,
  Link,
  GU,
  IconPlus,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import { getTokenIconBySymbol } from '../lib/token-utils'
import { useHistory } from 'react-router-dom'

import { ConvictionBar } from '../components/ConvictionVisuals'
import Balance from '../components/Balance'
import FilterBar from '../components/FilterBar/FilterBar'
import IdentityBadge from '../components/IdentityBadge'
import { useWallet } from '../providers/Wallet'
import {
  PROPOSAL_STATUS_EXECUTED_STRING,
  PROPOSAL_STATUS_ACTIVE_STRING,
} from '../constants'

import { addressesEqualNoSum as addressesEqual } from '../lib/web3-utils'

const ENTRIES_PER_PAGE = 5

const Proposals = React.memo(
  ({
    filteredProposals,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
    handleProposalSupportFilterChange,
    handleExecutionStatusFilterChange,
    handleSearchTextFilterChange,
    handleProposalTypeFilterChange,
    requestToken,
    onRequestNewProposal,
  }) => {
    const { account } = useWallet()
    const { layoutName } = useLayout()
    const compactMode = layoutName === 'small'

    const {
      convictionFields = [],
      beneficiaryField = [],
      linkField = [],
    } = useMemo(() => {
      if (proposalExecutionStatusFilter === 0) {
        return {
          convictionFields: [{ label: 'Progress', align: 'start' }],
        }
      }

      return {
        beneficiaryField: [{ label: 'Beneficiary', align: 'start' }],
        linkField: [{ label: 'Link', align: 'start' }],
      }
    }, [proposalExecutionStatusFilter])

    const requestedField = requestToken
      ? [{ label: 'Request amount', align: 'start' }]
      : []

    const sortedProposals = useMemo(
      () =>
        filteredProposals.sort(
          (a, b) => b.currentConviction - a.currentConviction
        ),
      [filteredProposals]
    )

    const updateTextFilter = useCallback(
      textValue => {
        handleSearchTextFilterChange(textValue)
      },
      [handleSearchTextFilterChange]
    )

    const history = useHistory()
    const handleSelectProposal = useCallback(
      id => {
        history.push(`/proposal/${id}`)
      },
      [history]
    )

    return (
      <div>
        {!compactMode && (
          <Box padding={2 * GU}>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
              `}
            >
              {account && (
                <Button
                  mode="strong"
                  onClick={onRequestNewProposal}
                  label="New proposal"
                  icon={<IconPlus />}
                  display={compactMode ? 'icon' : 'label'}
                />
              )}
              <FilterBar
                proposalsSize={filteredProposals.length}
                proposalExecutionStatusFilter={proposalExecutionStatusFilter}
                proposalStatusFilter={proposalSupportStatusFilter}
                proposalTextFilter={proposalTextFilter}
                proposalTypeFilter={proposalTypeFilter}
                handleExecutionStatusFilterChange={
                  handleExecutionStatusFilterChange
                }
                handleProposalStatusFilterChange={
                  handleProposalSupportFilterChange
                }
                handleTextFilterChange={updateTextFilter}
                handleProposalTypeFilterChange={handleProposalTypeFilterChange}
              />
            </div>
          </Box>
        )}

        <DataView
          heading={
            compactMode && (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <strong
                  css={`
                    ${textStyle('body1')}
                  `}
                >
                  Proposals
                </strong>
                {account && (
                  <Button
                    mode="strong"
                    onClick={onRequestNewProposal}
                    label="New proposal"
                    icon={<IconPlus />}
                    display={compactMode ? 'icon' : 'label'}
                  />
                )}
              </div>
            )
          }
          fields={[
            { label: 'Proposal', align: 'start' },
            ...linkField,
            ...requestedField,
            ...convictionFields,
            ...beneficiaryField,
          ]}
          emptyState={
            <p
              css={`
                ${textStyle('title2')};
                font-weight: 600;
              `}
            >
              No proposals yet!
            </p>
          }
          entries={sortedProposals}
          renderEntry={proposal => {
            const entriesElements = [
              <IdAndTitle
                id={proposal.id}
                name={proposal.name}
                selectProposal={handleSelectProposal}
              />,
            ]
            if (
              proposal.status === PROPOSAL_STATUS_EXECUTED_STRING ||
              !requestToken
            ) {
              entriesElements.push(
                <Link href={proposal.link} external>
                  Read more
                </Link>
              )
            }
            if (requestToken) {
              entriesElements.push(
                <Amount
                  requestedAmount={proposal.requestedAmount}
                  requestToken={requestToken}
                />
              )
            }
            if (proposal.status === PROPOSAL_STATUS_ACTIVE_STRING) {
              entriesElements.push(
                <ProposalInfo proposal={proposal} requestToken={requestToken} />
              )
            }
            if (proposal.status === PROPOSAL_STATUS_EXECUTED_STRING) {
              entriesElements.push(
                <IdentityBadge
                  connectedAccount={addressesEqual(
                    proposal.beneficiary,
                    account
                  )}
                  entity={proposal.beneficiary}
                />
              )
            }

            return entriesElements
          }}
          tableRowHeight={14 * GU}
          entriesPerPage={ENTRIES_PER_PAGE}
        />
      </div>
    )
  }
)

const ProposalInfo = ({ proposal, requestToken }) => {
  return (
    <div
      css={`
        width: ${23 * GU}px;
      `}
    >
      <ConvictionBar proposal={proposal} withThreshold={requestToken} />
    </div>
  )
}

const IdAndTitle = ({ id, name, selectProposal }) => {
  const theme = useTheme()
  const handleOnClick = useCallback(() => {
    selectProposal(id)
  }, [id, selectProposal])

  return (
    <Link onClick={handleOnClick}>
      <span
        css={`
          color: ${theme.surfaceContentSecondary};
        `}
      >
        {name}
      </span>
    </Link>
  )
}

const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => {
  const tokenIcon = getTokenIconBySymbol(symbol)
  return (
    <div>
      <Balance
        amount={requestedAmount}
        decimals={decimals}
        symbol={symbol}
        verified={verified}
        icon={tokenIcon}
      />
    </div>
  )
}

export default Proposals
