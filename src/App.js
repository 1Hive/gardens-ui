import React, { useCallback } from 'react'
import {
  Box,
  Button,
  IconPlus,
  Header,
  SidePanel,
  Split,
  SyncIndicator,
  useLayout,
} from '@aragon/ui'
import { useHistory } from 'react-router-dom'

import AccountModule from './components/Account/AccountModule'
import AddProposalPanel from './components/AddProposalPanel'
import Metrics from './components/Metrics'
import Proposals from './screens/Proposals'
import ProposalDetail from './screens/ProposalDetail'
import StakingTokens from './screens/StakingTokens'

import useAppLogic from './app-logic'
import { useAppState } from './providers/AppState'
import { useWallet } from './providers/Wallet'
import useFilterProposals from './hooks/useFilterProposals'
import useSelectedProposal from './hooks/useSelectedProposal'

const App = React.memo(function App() {
  const {
    actions,
    isLoading,
    myStakes,
    proposals,
    proposalPanel,
    totalActiveTokens,
    totalOpenProposals,
  } = useAppLogic()

  const { account } = useWallet()
  const { requestToken, stakeToken, totalSupply, vaultBalance } = useAppState()

  const history = useHistory()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const selectedProposal = useSelectedProposal(proposals)

  const handleBack = useCallback(() => {
    history.push(`/`)
  }, [history])

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
              {!selectedProposal && account && (
                <Button
                  mode="strong"
                  onClick={proposalPanel.requestOpen}
                  label="New proposal"
                  icon={<IconPlus />}
                  display={compactMode ? 'icon' : 'label'}
                />
              )}
            </div>
          }
        />

        <Split
          primary={
            !isLoading && (
              <>
                {selectedProposal ? (
                  <ProposalDetail
                    onBack={handleBack}
                    onExecuteProposal={actions.executeProposal}
                    onStakeToProposal={actions.stakeToProposal}
                    onWithdrawFromProposal={actions.withdrawFromProposal}
                    proposal={selectedProposal}
                    requestToken={requestToken}
                  />
                ) : (
                  <>
                    <Metrics
                      totalSupply={totalSupply}
                      commonPool={vaultBalance}
                      stakeToken={stakeToken}
                      requestToken={requestToken}
                      totalActiveTokens={totalActiveTokens}
                      totalOpenProposals={totalOpenProposals}
                    />
                    <Proposals
                      filteredProposals={filteredProposals}
                      proposalExecutionStatusFilter={
                        proposalExecutionStatusFilter
                      }
                      proposalSupportStatusFilter={proposalSupportStatusFilter}
                      proposalTextFilter={proposalTextFilter}
                      handleProposalSupportFilterChange={
                        handleProposalSupportFilterChange
                      }
                      handleExecutionStatusFilterChange={handleTabChange}
                      handleSearchTextFilterChange={
                        handleSearchTextFilterChange
                      }
                      requestToken={requestToken}
                      stakeToken={stakeToken}
                      myStakes={myStakes}
                      totalActiveTokens={totalActiveTokens}
                    />
                  </>
                )}
              </>
            )
          }
          secondary={
            <div>
              <Box heading="Wallet">
                <AccountModule compact={compactMode} />
              </Box>
              {account && (
                <StakingTokens
                  myStakes={myStakes}
                  totalActiveTokens={totalActiveTokens}
                />
              )}
            </div>
          }
          invert="horizontal"
        />

        <SidePanel
          title="New proposal"
          opened={proposalPanel.visible}
          onClose={proposalPanel.requestClose}
        >
          <AddProposalPanel onSubmit={actions.newProposal} />
        </SidePanel>
      </>
    </>
  )
})

export default () => {
  return <App />
}
