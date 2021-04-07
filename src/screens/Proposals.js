import BigNumber from 'bignumber.js'
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
import { getTokenIconBySymbol } from '../utils/token-utils'
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

import { addressesEqualNoSum as addressesEqual } from '../utils/web3-utils'

const ENTRIES_PER_PAGE = 5

const Proposals = React.memo(
  ({
    currentPage,
    filteredProposals,
    handleProposalSupportFilterChange,
    handleExecutionStatusFilterChange,
    handleSearchTextFilterChange,
    handleProposalTypeFilterChange,
    handleProposalPageChange,
    onRequestNewProposal,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
    requestToken,
  }) => {
    const { account } = useWallet()
    const { layoutName } = useLayout()
    const compactMode = layoutName === 'small'

    const {
      convictionFields = [],
      beneficiaryField = [],
      linkField = [],
    } = useMemo(() => {
      const fields = {
        convictionFields: [{ label: 'Progress', align: 'start' }],
        beneficiaryField: [{ label: 'Beneficiary', align: 'start' }],
        linkField: [{ label: 'Link', align: 'start' }],
      }
      if (proposalExecutionStatusFilter === -1) {
        return fields
      }

      if (proposalExecutionStatusFilter === 1) {
        delete fields.beneficiaryField
        delete fields.linkField
        return fields
      }

      delete fields.convictionFields
      return fields
    }, [proposalExecutionStatusFilter])

    const requestedField = requestToken
      ? [{ label: 'Request amount', align: 'start' }]
      : []

    // TODO: This is technically not entirely correct
    // as it does not sort based on conviction but the
    // amount of staked HNY. There was no simple
    // way to fetch the conviction for the proposals.
    const sortedProposals = useMemo(
      () =>
        filteredProposals.sort((a, b) => {
          const aStaked = a.stakes.reduce(
            (sum, { amount }) => sum.plus(amount),
            new BigNumber(0)
          )
          const bStaked = b.stakes.reduce(
            (sum, { amount }) => sum.plus(amount),
            new BigNumber(0)
          )
          if (bStaked.lt(aStaked)) {
            return -1
          } else if (bStaked.gt(aStaked)) {
            return 1
          }

          return 0
        }),
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
              <div>
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
                  handleProposalTypeFilterChange={
                    handleProposalTypeFilterChange
                  }
                />
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
            } else if (linkField.length) {
              entriesElements.push(<div />)
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
            } else if (convictionFields.length) {
              entriesElements.push(<div />)
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
          page={currentPage}
          onPageChange={handleProposalPageChange}
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
    <Link
      onClick={handleOnClick}
      css={`
        white-space: normal;
        text-align: left;
      `}
    >
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
