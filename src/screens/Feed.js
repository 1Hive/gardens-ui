import React from 'react'
import { SidePanel, SyncIndicator } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import MainScreen from '../components/Feed/MainScreen'

import useAppLogic from '../app-logic'
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

  const selectedProposal = useSelectedProposal(proposals)

  return (
    <div>
      <SyncIndicator visible={isLoading} />

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
