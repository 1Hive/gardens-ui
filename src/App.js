import React from 'react'
import { SidePanel, Split } from '@1hive/1hive-ui'

import AddProposalPanel from './components/AddProposalPanel'
import AppLoader from './components/AppLoader'
import MainScreen from './screens/MainScreen'
import StakingTokens from './screens/StakingTokens'
import Wallet from './components/Wallet'

import useAppLogic from './app-logic'
import { useWallet } from './providers/Wallet'
import useSelectedProposal from './hooks/useSelectedProposal'

const App = React.memo(function App() {
  const {
    actions,
    isLoading,
    myStakes,
    proposals,
    proposalPanel,
    totalStaked,
  } = useAppLogic()

  const { account } = useWallet()
  const selectedProposal = useSelectedProposal(proposals)

  const MainScreenComponent = (
    <MainScreen
      isLoading={isLoading}
      myStakes={myStakes}
      onExecuteIssuance={actions.executeIssuance}
      onExecuteProposal={actions.executeProposal}
      onCancelProposal={actions.cancelProposal}
      onRequestNewProposal={proposalPanel.requestOpen}
      onStakeToProposal={actions.stakeToProposal}
      onWithdrawFromProposal={actions.withdrawFromProposal}
      proposals={proposals}
      selectedProposal={selectedProposal}
      totalActiveTokens={totalStaked}
    />
  )

function App() {
  return (
    <div>
      {isLoading && <AppLoader />}
      {!account ? (
        MainScreenComponent
      ) : (
        <Split
          primary={MainScreenComponent}
          secondary={
            <div>
              <Wallet myStakes={myStakes} />
              <StakingTokens
                myStakes={myStakes}
                totalActiveTokens={totalStaked}
              />
            </div>
          }
          invert="horizontal"
        />
      )}

      <SidePanel
        title="New proposal"
        opened={proposalPanel.visible}
        onClose={proposalPanel.requestClose}
      >
        <AddProposalPanel onSubmit={actions.newProposal} />
      </SidePanel>
    </div>
  )
}

export default App
