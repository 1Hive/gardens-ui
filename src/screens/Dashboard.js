import React from 'react'
import { SidePanel, Split, SyncIndicator } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/AddProposalPanel'
import MainScreen from './MainScreen'
import StakingTokens from './StakingTokens'
import Wallet from '../components/Wallet'

import useAppLogic from '../app-logic'
import { useWallet } from '../providers/Wallet'
import useSelectedProposal from '../hooks/useSelectedProposal'

const Dashboard = React.memo(function Dashboard() {
  const {
    actions,
    isLoading,
    myStakes,
    proposals,
    proposalPanel,
    totalActiveTokens,
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
      totalActiveTokens={totalActiveTokens}
    />
  )

  return (
    <div>
      <SyncIndicator visible={isLoading} />

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
                totalActiveTokens={totalActiveTokens}
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
})

export default Dashboard
