import React, { useCallback } from 'react'
import {
  Button,
  SidePanel,
  SyncIndicator,
  IconPlus,
  Header,
  useLayout,
} from '@aragon/ui'
import { useHistory } from 'react-router-dom'

import AddProposalPanel from './components/AddProposalPanel'
import Proposals from './screens/Proposals'
import ProposalDetail from './screens/ProposalDetail'
import useAppLogic from './app-logic'
import { useAppState } from './providers/AppState'
import useFilterProposals from './hooks/useFilterProposals'
import useSelectedProposal from './hooks/useSelectedProposal'

const App = React.memo(function App() {
  const {
    proposals,
    isLoading,
    myStakes,
    setProposalPanel,
    proposalPanel,
    onNewProposal,
    myActiveTokens,
    totalActiveTokens,
  } = useAppLogic()

  const { requestToken, stakeToken } = useAppState()

  const history = useHistory()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const selectedProposal = useSelectedProposal(proposals)

  const handleBack = useCallback(
    id => {
      history.push(`/`)
    },
    [history]
  )

  const {
    filteredProposals,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    handleProposalSupportFilterChange,
    handleProposalExecutionFilterChange,
    handleSearchTextFilterChange,
  } = useFilterProposals(proposals, myStakes)

  const handleTabChange = tabIndex => {
    handleProposalExecutionFilterChange(tabIndex)
    handleProposalSupportFilterChange(-1)
  }

  return (
    <>
      <SyncIndicator visible={isLoading} />
      <>
        <Header
          primary="Conviction Voting"
          secondary={
            <div>
              {!selectedProposal && (
                <Button
                  mode="strong"
                  onClick={() => setProposalPanel(true)}
                  label="New proposal"
                  icon={<IconPlus />}
                  display={compactMode ? 'icon' : 'label'}
                />
              )}
            </div>
          }
        />
        {!isLoading && (
          <>
            {selectedProposal ? (
              <ProposalDetail
                proposal={selectedProposal}
                onBack={handleBack}
                requestToken={requestToken}
              />
            ) : (
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
                stakeToken={stakeToken}
                myStakes={myStakes}
                myActiveTokens={myActiveTokens}
                totalActiveTokens={totalActiveTokens}
              />
            )}
          </>
        )}
        <SidePanel
          title="New proposal"
          opened={proposalPanel}
          onClose={() => setProposalPanel(false)}
        >
          <AddProposalPanel onSubmit={onNewProposal} />
        </SidePanel>
      </>
    </>
  )
})

export default () => {
  return <App />
}
