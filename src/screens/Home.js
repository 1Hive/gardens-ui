import React from 'react'
import { GU, SidePanel } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import Loader from '../components/Loader'
import ProposalsList from '../components/Feed/ProposalsList'

import useAppLogic from '../logic/app-logic'

const Home = React.memo(function Home() {
  const {
    actions,
    filters,
    isLoading,
    proposals,
    proposalPanel,
  } = useAppLogic()

  return (
    <div
      css={`
        margin-top: ${3 * GU}px;
      `}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          css={`
            display: flex;
          `}
        >
          {/* // TODO: Add filters and hero banner */}
          <div>filter sidebar</div>
          <ProposalsList
            activeFilters={filters.isActive}
            proposals={proposals}
            onProposalCountIncrease={filters.onProposalCountIncrease}
            onRankingFilterChange={filters.ranking.onChange}
            onStakeToProposal={actions.stakeToProposal}
            onWithdrawFromProposal={actions.withdrawFromProposal}
            rankingItems={filters.ranking.items}
            selectedRanking={filters.ranking.filter}
          />
          <div>Hero banner</div>
        </div>
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

export default Home
