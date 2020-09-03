import React from 'react'
import { SidePanel, Split, SyncIndicator } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import MainScreen from '../components/Feed/MainScreen'
import StakingTokens from '../components/Feed/StakingTokens'
import Wallet from '../components/Wallet'

import useAppLogic from '../app-logic'
import { useWallet } from '../providers/Wallet'
import useSelectedProposal from '../hooks/useSelectedProposal'

const Feed = React.memo(function Feed() {
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
})

export default Feed
