import React, { useCallback } from 'react'
import {
  DataView,
  Link,
  GU,
  Text,
  Tag,
  textStyle,
  useTheme,
  Tabs,
} from '@aragon/ui'
import { formatTokenAmount } from '../lib/token-utils'
import { useHistory } from 'react-router-dom'

import {
  ConvictionBar,
  ConvictionTrend,
  ConvictionCountdown,
} from '../components/ConvictionVisuals'
import Balance from '../components/Balance'
import FilterBar from '../components/FilterBar/FilterBar'
import IdentityBadge from '../components/IdentityBadge'
import { useWallet } from '../providers/Wallet'

import { addressesEqualNoSum as addressesEqual } from '../lib/web3-utils'

const ENTRIES_PER_PAGE = 6

const Proposals = React.memo(
  ({
    filteredProposals,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    handleProposalSupportFilterChange,
    handleExecutionStatusFilterChange,
    handleSearchTextFilterChange,
    requestToken,
    stakeToken,
    myStakes,
  }) => {
    const { account } = useWallet()

    const convictionFields =
      proposalExecutionStatusFilter === 0
        ? [
            { label: 'Conviction progress', align: 'start' },
            { label: 'Trend', align: 'start' },
          ]
        : []
    const beneficiaryField =
      proposalExecutionStatusFilter === 1
        ? [{ label: 'Beneficiary', align: 'start' }]
        : []
    const linkField =
      proposalExecutionStatusFilter === 1 || !requestToken
        ? [{ label: 'Link', align: 'start' }]
        : []
    const tabs = ['Open', 'Closed']
    const requestedField = requestToken
      ? [{ label: 'Requested', align: 'start' }]
      : []
    const statusField = requestToken
      ? [{ label: 'Status', align: 'start' }]
      : []

    const sortedProposals = filteredProposals.sort(
      (a, b) => b.currentConviction - a.currentConviction // desc order
    )

    const handleTabChange = useCallback(
      tabIndex => {
        handleExecutionStatusFilterChange(tabIndex)
      },
      [handleExecutionStatusFilterChange]
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
        {requestToken && (
          <Tabs
            items={tabs}
            selected={proposalExecutionStatusFilter}
            onChange={handleTabChange}
          />
        )}
        <DataView
          fields={[
            { label: 'Proposal', align: 'start' },
            ...linkField,
            ...requestedField,
            ...convictionFields,
            ...beneficiaryField,
            ...statusField,
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
            if (proposal.executed || !requestToken) {
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
            if (!proposal.executed) {
              entriesElements.push(
                <ProposalInfo
                  proposal={proposal}
                  myStakes={myStakes}
                  stakeToken={stakeToken}
                  requestToken={requestToken}
                />,
                <ConvictionTrend proposal={proposal} />
              )
            }
            if (proposal.executed) {
              entriesElements.push(
                <IdentityBadge
                  connectedAccount={addressesEqual(proposal.creator, account)}
                  entity={proposal.creator}
                />
              )
            }
            if (requestToken) {
              entriesElements.push(
                <ConvictionCountdown proposal={proposal} shorter />
              )
            }
            return entriesElements
          }}
          tableRowHeight={14 * GU}
          heading={
            <FilterBar
              proposalsSize={filteredProposals.length}
              proposalStatusFilter={proposalSupportStatusFilter}
              proposalTextFilter={proposalTextFilter}
              handleProposalStatusFilterChange={
                handleProposalSupportFilterChange
              }
              handleTextFilterChange={updateTextFilter}
              disableDropDownFilter={proposalExecutionStatusFilter === 1}
            />
          }
          entriesPerPage={ENTRIES_PER_PAGE}
        />
      </div>
    )
  }
)

const ProposalInfo = ({
  proposal,
  stakeToken,
  myStakes,
  requestToken,
  selectProposal = false,
}) => {
  const myStakeInfo = myStakes.find(stake => stake.proposalId === proposal.id)
  return (
    <div
      css={`
        width: ${23 * GU}px;
      `}
    >
      {selectProposal && (
        <IdAndTitle {...proposal} selectProposal={selectProposal} />
      )}
      <ConvictionBar proposal={proposal} withThreshold={requestToken} />
      {myStakeInfo?.amount.gt(0) && (
        <Tag>
          {`✓ Supported: ${formatTokenAmount(
            myStakeInfo.amount,
            parseInt(stakeToken.decimals)
          )} ${stakeToken.symbol}`}
        </Tag>
      )}
    </div>
  )
}

const IdAndTitle = ({ id, name, selectProposal }) => (
  <Link onClick={() => selectProposal(id)}>
    <Text color={useTheme().surfaceContent.toString()}>#{id}</Text>{' '}
    <Text color={useTheme().surfaceContentSecondary.toString()}>{name}</Text>
  </Link>
)

const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => (
  <div>
    <Balance
      amount={requestedAmount}
      decimals={decimals}
      symbol={symbol}
      verified={verified}
    />
  </div>
)

export default Proposals
