import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import Metrics from '../components/Metrics'
import Proposals from './Proposals'
import ProposalDetail from './ProposalDetail'
import { useAppState } from '../providers/AppState'
import useFilterProposals from '../hooks/useFilterProposals'

const MainScreen = React.memo(
  ({
    isLoading,
    myStakes,
    onExecuteIssuance,
    onExecuteProposal,
    onRequestNewProposal,
    onStakeToProposal,
    onWithdrawFromProposal,
    proposals,
    selectedProposal,
    totalActiveTokens,
  }) => {
    const {
      requestToken,
      stakeToken,
      totalSupply,
      vaultBalance,
    } = useAppState()

    const {
      filteredProposals,
      proposalExecutionStatusFilter,
      proposalSupportStatusFilter,
      proposalTextFilter,
      handleProposalSupportFilterChange,
      handleProposalExecutionFilterChange,
      handleSearchTextFilterChange,
    } = useFilterProposals(proposals, myStakes)

    const history = useHistory()
    const handleBack = useCallback(() => {
      history.push(`/`)
    }, [history])

    const handleTabChange = tabIndex => {
      handleProposalExecutionFilterChange(tabIndex)
      handleProposalSupportFilterChange(-1)
    }

    if (isLoading) {
      return null
    }

    return (
      <>
        {selectedProposal ? (
          <ProposalDetail
            onBack={handleBack}
            onExecuteProposal={onExecuteProposal}
            onStakeToProposal={onStakeToProposal}
            onWithdrawFromProposal={onWithdrawFromProposal}
            proposal={selectedProposal}
            requestToken={requestToken}
          />
        ) : (
          <>
            <Metrics
              totalSupply={totalSupply}
              commonPool={vaultBalance}
              onExecuteIssuance={onExecuteIssuance}
              stakeToken={stakeToken}
              requestToken={requestToken}
              totalActiveTokens={totalActiveTokens}
            />
            <Proposals
              filteredProposals={filteredProposals}
              proposalExecutionStatusFilter={proposalExecutionStatusFilter}
              proposalSupportStatusFilter={proposalSupportStatusFilter}
              proposalTextFilter={proposalTextFilter}
              handleProposalSupportFilterChange={
                handleProposalSupportFilterChange
              }
              handleExecutionStatusFilterChange={handleTabChange}
              handleSearchTextFilterChange={handleSearchTextFilterChange}
              requestToken={requestToken}
              onRequestNewProposal={onRequestNewProposal}
            />
          </>
        )}
      </>
    )
  }
)

export default MainScreen
